import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { extname } from 'path'
import { existsSync } from 'fs'
import FileType from 'file-type'
import { Image } from './images.model'
import { CreateImageDto } from './dto/create-image.dto'
import { UpdateImageDto } from './dto/update.image.dto'
import { removeFileByUrl, imageUrlFromFilename } from './config/upload.utils'
import { IMAGE_UPLOAD } from './image.constants'
import { ImageResponseDto } from './dto/image-response.dto'

@Injectable()
export class ImageService {
    constructor(
        @InjectModel(Image)
        private readonly imageModel: typeof Image
    ) {}

    async findAll() {
        const images = await this.imageModel.findAll()

        return images.map((image) =>
            this.formatResponse(image)
        )
    }

    async findOneById(id: number) {
        const image = await this.getImageOrFail(id)
        return this.formatResponse(image)
    }

    async create( createImageDto: CreateImageDto, file: Express.Multer.File) {
        if (!file || !file.filename || !file.path) {
            throw new BadRequestException(
                'Arquivo não enviado ou inválido'
            )   
        }

        await this.validateImage(file)

        try {
            const image = await this.imageModel.create({
                altText: createImageDto.altText,
                sectionId: createImageDto.sectionId,
                imageUrl: imageUrlFromFilename(
                    file.filename,
                )
            })
            
            return this.formatResponse(image)
        } catch (error) {
            await removeFileByUrl(
                file.path
            )

            throw new InternalServerErrorException('Erro ao criar imagem')
        }
    }

    async update(
        id: number,
        updateImageDto: UpdateImageDto,
        file?: Express.Multer.File
    ) {
        const image = await this.getImageOrFail(id)
        const previousImageUrl = image.imageUrl

        try {
            image.altText = updateImageDto.altText ?? image.altText

            if (file) {
                if (!file.filename || !file.path) {
                    throw new BadRequestException('Arquivo inválido')
                }

                await this.validateImage(file)
                image.imageUrl = imageUrlFromFilename(file.filename)
            }

            await image.save()

            if (
                file &&
                previousImageUrl &&
                previousImageUrl !==
                image.imageUrl
            ) {
                await removeFileByUrl(previousImageUrl)
            }

            return this.formatResponse(image)
        } catch (error) {
            if (file?.path) {
                await removeFileByUrl(file.path)
            }

            if (
                error instanceof BadRequestException ||
                error instanceof NotFoundException
            ) {
                throw error
            }

            throw new InternalServerErrorException('Erro ao atualizar imagem')
        }
    }

    async deleteById(id: number): Promise<{ message: string }> {
        const image = await this.getImageOrFail(id)

        await image.destroy()

        return {
            message: 'Imagem deletada com sucesso'
        }
    }

    private async getImageOrFail(id: number): Promise<Image> {
        const image = await this.imageModel.findByPk(id)

        if (!image) {
            throw new NotFoundException('Imagem não encontrada')
        }

        return image
    }

    private async validateImage(file: Express.Multer.File): Promise<void> {
        try {
            const fileType = await FileType.fromFile(file.path)

            if (
                !fileType || !IMAGE_UPLOAD.ALLOWED_EXTENSIONS.includes(
                    fileType.ext
                )
            ) {
                await removeFileByUrl(file.path)

                throw new BadRequestException('Arquivo inválido. Apenas jpg, jpeg e png são permitidos')
            }

            const originalExtension = extname(file.originalname).replace('.', '').toLowerCase()

            if (
                originalExtension &&
                originalExtension !==
                fileType.ext
            ) {
                await removeFileByUrl(file.path)

                throw new BadRequestException('Extensão do arquivo não confere com o conteúdo enviado')
            }
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error
            }

            if (file?.path && existsSync(file.path)) {
                await removeFileByUrl(file.path)
            }

            throw new BadRequestException('Erro ao validar imagem enviada')
        }
    }

    private formatResponse(image: Image): ImageResponseDto {
        return {
            idImage: image.idImage,
            imageUrl: image.imageUrl,
            altText: image.altText,
            sectionId: image.sectionId,
            createdAt: image.createdAt,
            updatedAt: image.updatedAt
        }
    }
}