import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Content } from './content.model';
import { ContentDto } from './dto/content.dto';

@Injectable()
export class ContentService {
    constructor(
        @InjectModel(Content) private readonly contentModel: typeof Content,
    ) {}

    async findAll() {
        return await this.contentModel.findAll();
    }

    async findById(id: number) {
        const content = await this.contentModel.findByPk(id);

        if (!content) throw new NotFoundException('Conteúdo não encontrado!');
        return content;
    }

    async update(idContent: number, contentDto: ContentDto) {
        const content = await this.contentModel.findByPk(idContent);
        if (!content) {
            throw new NotFoundException('Conteúdo não encontrado!');
        }

        try {
            Object.assign(content, contentDto);
            await content.save();
            return content;
        } catch (error) {
            throw new BadRequestException('Erro ao atualizar o conteúdo!');
        }
    }

    async deleteById(id: number): Promise<{ message: string }> {
        const content = await this.contentModel.findByPk(id);
        
        if (!content) {
            throw new NotFoundException('Conteúdo não encontrado!');
        }

        await content.destroy();
        return { message: 'Conteúdo deletada com sucesso!' };
    }
}