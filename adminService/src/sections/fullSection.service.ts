import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Section } from './section.model'
import { CreateFullSectionDto } from './dto/create-full-section.dto'
import { Sequelize } from 'sequelize-typescript'
import { Content } from '../contents/content.model'
import { Card } from '../cards/card.model'
import { Stats } from '../stats/stats.model'
import { Button } from '../buttons/buttons.model'
import { Image } from '../images/images.model'
import { SectionName } from './interface/section.interface'
import { getRules } from './rules/section.rules'

// Helper: group images by sectionId
function groupImagesBySectionId(images: Image[]): Record<number, object[]> {
    return images.reduce((acc, img) => {
        const sid = img.sectionId
        if (!acc[sid]) acc[sid] = []
        acc[sid].push(img.toJSON())
        return acc
    }, {} as Record<number, object[]>)
}

@Injectable()
export class FullSectionService {
    constructor(
        @InjectModel(Section) private readonly sectionModel: typeof Section,
        @InjectModel(Content) private readonly contentModel: typeof Content,
        @InjectModel(Card)    private readonly cardModel:    typeof Card,
        @InjectModel(Stats)   private readonly statsModel:   typeof Stats,
        @InjectModel(Button)  private readonly buttonsModel: typeof Button,
        @InjectModel(Image)   private readonly imageModel:   typeof Image,
        private readonly sequelize: Sequelize
    ) {}

    async createFullSection(dto: CreateFullSectionDto) {
        const transaction = await this.sequelize.transaction()

        try {
            const { section: sectionDto, contents, cards, stats, buttons } = dto

            if (!sectionDto?.name) {
                throw new BadRequestException('Nome da seção é obrigatório')
            }

            // ── Resolve title and subtitle using section rules ─────────────
            const rules = getRules(sectionDto.name as SectionName)

            const title: string = !rules.titleEditable && rules.fixedTitle
                ? rules.fixedTitle
                : (sectionDto.title?.trim() || '')

            if (!title) {
                throw new BadRequestException('Título é obrigatório')
            }

            const subtitle: string = rules.fixedSubtitle
                ? rules.fixedSubtitle
                : (sectionDto.subtitle?.trim() || '')

            // ── Create section ─────────────────────────────────────────────
            const newSection = await this.sectionModel.create(
                { name: sectionDto.name, title, subtitle },
                { transaction }
            )
            const sectionId = newSection.idSection

            // ── Bulk-create sub-entities ───────────────────────────────────
            if (contents?.length) {
                await this.contentModel.bulkCreate(
                    contents.map(item => ({ sectionId, type: item.type, content: item.content })),
                    { transaction, fields: ['sectionId', 'type', 'content'] }
                )
            }

            if (cards?.length) {
                await this.cardModel.bulkCreate(
                    cards.map(card => ({ sectionId, ...card })),
                    { transaction, fields: ['sectionId', 'title', 'description', 'icon'] }
                )
            }

            if (stats?.length) {
                await this.statsModel.bulkCreate(
                    stats.map(stat => ({ sectionId, ...stat })),
                    { transaction, fields: ['sectionId', 'title', 'value'] }
                )
            }

            if (buttons?.length) {
                await this.buttonsModel.bulkCreate(
                    buttons.map(btn => ({ sectionId, ...btn })),
                    { transaction, fields: ['sectionId', 'label', 'link'] }
                )
            }

            await transaction.commit()

            return {
                message: 'Seção completa criada com sucesso',
                section: newSection
            }

        } catch (error) {
            await transaction.rollback()
            console.error(error)
            if (error instanceof BadRequestException) throw error
            throw new BadRequestException('Erro ao criar seção completa')
        }
    }

    async findAll() {
        const [sections, allImages] = await Promise.all([
            this.sectionModel.findAll({
                include: [
                    { model: Content },
                    { model: Card },
                    { model: Stats },
                    { model: Button },
                ]
            }),
            this.imageModel.findAll()
        ])

        const imagesBySectionId = groupImagesBySectionId(allImages)

        return sections.map(s => ({
            ...s.toJSON(),
            images: imagesBySectionId[s.idSection] ?? []
        }))
    }

    async findById(id: number) {
        const section = await this.sectionModel.findByPk(id, {
            include: [
                { model: Content },
                { model: Card },
                { model: Stats },
                { model: Button },
            ]
        })
        if (!section) throw new NotFoundException('Seção não encontrada!')

        const images = await this.imageModel.findAll({ where: { sectionId: id } })

        return {
            ...section.toJSON(),
            images: images.map(img => img.toJSON())
        }
    }
}
