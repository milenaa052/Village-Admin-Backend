import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Content } from './content.model'
import { ContentDto } from './dto/content.dto'
import { CreateContentDto } from './dto/create-content.dto'
import { SectionValidatorService } from '../sections/rules/section-validator.service'

@Injectable()
export class ContentService {
    constructor(
        @InjectModel(Content) private readonly contentModel: typeof Content,
        private readonly sectionValidator: SectionValidatorService,
    ) {}

    async create(dto: CreateContentDto): Promise<Content> {
        await this.sectionValidator.validateContentCreate(dto.sectionId)
        try {
            return await this.contentModel.create({
                type: dto.type,
                content: dto.content,
                sectionId: dto.sectionId
            })
        } catch {
            throw new BadRequestException('Erro ao criar conteúdo')
        }
    }

    async findAll() {
        return this.contentModel.findAll()
    }

    async findById(id: number) {
        const content = await this.contentModel.findByPk(id)
        if (!content) throw new NotFoundException('Conteúdo não encontrado')
        return content
    }

    async update(idContent: number, dto: ContentDto) {
        const content = await this.contentModel.findByPk(idContent)
        if (!content) throw new NotFoundException('Conteúdo não encontrado')
        try {
            if (dto.type    !== undefined) content.type    = dto.type
            if (dto.content !== undefined) content.content = dto.content
            await content.save()
            return content
        } catch {
            throw new BadRequestException('Erro ao atualizar o conteúdo')
        }
    }

    async deleteById(id: number): Promise<{ message: string }> {
        const content = await this.contentModel.findByPk(id)
        if (!content) throw new NotFoundException('Conteúdo não encontrado')
        await content.destroy()
        return { message: 'Conteúdo deletado com sucesso' }
    }
}
