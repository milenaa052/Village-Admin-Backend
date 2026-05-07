import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Image } from './images.model';
import { ImageDto } from './dto/image.dto';

@Injectable()
export class ImageService {
    constructor(
        @InjectModel(Image) private readonly imageModel: typeof Image,
    ) {}

    async findAll() {
        return await this.imageModel.findAll();
    }

    async findById(id: number) {
        const image = await this.imageModel.findByPk(id);

        if (!image) throw new NotFoundException('Imagem não encontrada!');
        return image;
    }

    async update(idImage: number, imageDto: ImageDto) {
        const image = await this.imageModel.findByPk(idImage);
        if (!image) {
            throw new NotFoundException('Imagem não encontrada!');
        }

        try {
            Object.assign(image, imageDto);
            await image.save();
            return image;
        } catch (error) {
            throw new BadRequestException('Erro ao atualizar a imagem!');
        }
    }

    async deleteById(id: number): Promise<{ message: string }> {
        const image = await this.imageModel.findByPk(id);
        
        if (!image) {
            throw new NotFoundException('Imagem não encontrada!');
        }

        await image.destroy();
        return { message: 'Imagem deletada com sucesso!' };
    }
}