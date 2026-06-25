import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Section } from './section.model'
import { CreateSectionDto } from './dto/create-section.dto'
import { UpdateSectionDto } from './dto/update-section.dto'
import { SectionName } from './interface/section.interface'
import { getRules } from './rules/section.rules'
import { SectionValidatorService } from './rules/section-validator.service'

@Injectable()
export class SectionService {
    constructor(
        @InjectModel(Section) private readonly sectionModel: typeof Section,
        private readonly sectionValidator: SectionValidatorService,
    ) {}

    async create(dto: CreateSectionDto): Promise<Section> {
        const rules = getRules(dto.name)

        // Resolve title: use fixedTitle if not editable, require it otherwise
        let title: string
        if (!rules.titleEditable && rules.fixedTitle) {
            title = rules.fixedTitle
        } else {
            if (!dto.title?.trim()) throw new BadRequestException('Título é obrigatório')
            title = dto.title.trim()
        }

        // Resolve subtitle
        let subtitle: string | null = null
        if (rules.fixedSubtitle) {
            subtitle = rules.fixedSubtitle
        } else if (dto.subtitle?.trim()) {
            subtitle = dto.subtitle.trim()
        }

        try {
            return await this.sectionModel.create({ name: dto.name, title, subtitle: subtitle ?? '' })
        } catch {
            throw new BadRequestException('Erro ao criar a seção')
        }
    }

    async findAll() {
        return this.sectionModel.findAll()
    }

    async findById(id: number) {
        const section = await this.sectionModel.findByPk(id)
        if (!section) throw new NotFoundException('Seção não encontrada')
        return section
    }

    async update(idSection: number, dto: UpdateSectionDto) {
        const section = await this.sectionModel.findByPk(idSection)
        if (!section) throw new NotFoundException('Seção não encontrada')

        const rules = getRules(section.name as SectionName)

        // Enforce fixed title
        if (dto.title !== undefined) {
            this.sectionValidator.validateTitleEdit(section.name as SectionName, dto.title)
            section.title = dto.title.trim()
        }

        // Enforce fixed subtitle
        if (dto.subtitle !== undefined) {
            this.sectionValidator.validateSubtitleEdit(section.name as SectionName, dto.subtitle)
            section.subtitle = dto.subtitle.trim()
        }

        try {
            await section.save()
            return section
        } catch {
            throw new BadRequestException('Erro ao atualizar a seção')
        }
    }

    async deleteById(id: number): Promise<{ message: string }> {
        const section = await this.sectionModel.findByPk(id)
        if (!section) throw new NotFoundException('Seção não encontrada')
        await section.destroy()
        return { message: 'Seção deletada com sucesso' }
    }
}
