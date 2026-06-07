import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Section } from './section.model'
import { CreateSectionDto } from './dto/create-section.dto'
import { UpdateSectionDto } from './dto/update-section.dto'

@Injectable()
export class SectionService {
    constructor(
        @InjectModel(Section) private readonly sectionModel: typeof Section
    ) {}

    async create(createSectionDto: CreateSectionDto): Promise<Section> {

        try {
            const sectionData = {
                name: createSectionDto.name,
                title: createSectionDto.title,
                subtitle: createSectionDto.subtitle
            }

            const section = await this.sectionModel.create(sectionData)
            return section
        } catch (error) {
            throw new BadRequestException('Erro ao criar a seção')
        }
    }

    async findAll() {
        return await this.sectionModel.findAll()
    }

    async findById(id: number) {
        const section = await this.sectionModel.findByPk(id)

        if (!section) throw new NotFoundException('Seção não encontrado')
        return section
    }

    async update(idSection: number, updateSectionDto: UpdateSectionDto) {
        const section = await this.sectionModel.findByPk(idSection)
        if (!section) {
            throw new NotFoundException('Seção não encontrado')
        }

        try {
            await section.save()
            return section
        } catch (error) {
            throw new BadRequestException('Erro ao atualizar a seção')
        }
    }

    async deleteById(id: number): Promise<{ message: string }> {
        const section = await this.sectionModel.findByPk(id)
        
        if (!section) {
            throw new NotFoundException('Seção não encontrada')
        }

        await section.destroy()
        return { message: 'Seção deletada com sucesso' }
    }
}