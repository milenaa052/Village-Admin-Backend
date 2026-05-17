import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Image } from './images.model';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update.image.dto';
import { removeFileByUrl, imageUrlFromFilename } from '../uploads/upload.utils';
import { extname } from 'path';
import { existsSync } from 'fs';
import FileType from 'file-type';

@Injectable()
export class ImageService {
    constructor(
        @InjectModel(Image) private readonly imageModel: typeof Image
    ) {}

    async findAll() {
        return await this.imageModel.findAll();
    }

    async findById(id: number) {
        const image = await this.imageModel.findByPk(id);

        if (!image) {
            throw new NotFoundException('Imagem não encontrada!');
        }

        return image;
    }

    async create(
        createImageDto: CreateImageDto,
        file: Express.Multer.File,
    ) {
        if (!file || !file.filename || !file.path) {
            throw new BadRequestException(
                'Arquivo não enviado ou inválido',
            );
        }

        await this.validateImage(file);
        console.log(createImageDto);
        console.log(file);


        try {
            const image = await this.imageModel.create({
                altText: createImageDto.altText,
                sectionId: createImageDto.sectionId,
                imageUrl: imageUrlFromFilename(file.filename),
            });

            return image;
        } catch (err) {
            await removeFileByUrl(file.path);

            throw new BadRequestException(
                'Erro ao criar imagem',
            );
        }
    }

    async update(
        id: number,
        updateImageDto: UpdateImageDto,
    ) {
        const image = await this.imageModel.findByPk(id);

        if (!image) {
            throw new NotFoundException(
                'Imagem não encontrada!',
            );
        }

        try {
            if (updateImageDto.altText !== undefined) {
                image.altText = updateImageDto.altText;
            }

            await image.save();

            return image;
        } catch (err) {
            throw new BadRequestException(
                'Erro ao atualizar imagem!',
            );
        }
    }

    async updateImage(
        id: number,
        file: Express.Multer.File,
    ) {
        const image = await this.imageModel.findByPk(id);

        if (!image) {
            throw new NotFoundException(
                'Imagem não encontrada!',
            );
        }

        if (!file || !file.filename || !file.path) {
            throw new BadRequestException(
                'Arquivo não enviado ou inválido',
            );
        }

        await this.validateImage(file);

        const oldImage = image.imageUrl;

        try {
            image.imageUrl = imageUrlFromFilename(
                file.filename,
            );

            await image.save();

            if (oldImage) {
                await removeFileByUrl(oldImage);
            }

            return image;
        } catch (err) {
            await removeFileByUrl(
                imageUrlFromFilename(file.filename),
            );

            throw new BadRequestException(
                'Erro ao atualizar imagem',
            );
        }
    }

    async deleteById(id: number) {
        const image = await this.imageModel.findByPk(id);

        if (!image) {
            throw new NotFoundException(
                'Imagem não encontrada!',
            );
        }

        if (image.imageUrl) {
            await removeFileByUrl(image.imageUrl);
        }

        await image.destroy();

        return {
            message: 'Imagem deletada com sucesso!',
        };
    }

    private async validateImage(
        file: Express.Multer.File,
    ) {
        try {

            const fileType = await FileType.fromFile(file.path);
            const allowedExts = ['jpg', 'jpeg', 'png'];

            if (
                !fileType ||
                !allowedExts.includes(fileType.ext)
            ) {
                await removeFileByUrl(file.path);

                throw new BadRequestException(
                    'Arquivo inválido. Apenas jpg, jpeg e png são permitidos.',
                );
            }

            const originalExt = extname(
                file.originalname || '',
            )
                .replace('.', '')
                .toLowerCase();

            if (
                originalExt &&
                originalExt !== fileType.ext
            ) {
                await removeFileByUrl(file.path);

                throw new BadRequestException(
                    'Extensão do arquivo não confere com conteúdo.',
                );
            }
        } catch (err) {
            if (err instanceof BadRequestException) {
                throw err;
            }

            try {
                if (
                    file &&
                    file.path &&
                    existsSync(file.path)
                ) {
                    await removeFileByUrl(file.path);
                }
            } catch {}

            throw new BadRequestException(
                'Erro ao validar imagem enviada',
            );
        }
    }
}