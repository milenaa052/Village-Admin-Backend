import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Image } from './images.model'
import { CreateImageDto } from './dto/create-image.dto'
import { UpdateImageDto } from './dto/update.image.dto'
import { logUpload } from '../middleware/upload-logger.middleware'
import { ImageValidatorService } from './image-validator.service'
import { ImageMapperService } from './image-mapper.service'
import { ImageFileService } from './image-file.service'
import { SectionValidatorService } from '../sections/rules/section-validator.service'

@Injectable()
export class ImageService {
    constructor(
        @InjectModel(Image) private readonly imageModel: typeof Image,
        private readonly validator:         ImageValidatorService,
        private readonly mapper:            ImageMapperService,
        private readonly fileService:       ImageFileService,
        private readonly sectionValidator:  SectionValidatorService,
    ) {}

    async findAll() {
        return (await this.imageModel.findAll()).map((img) => this.mapper.toResponse(img))
    }

    async findById(id: number) {
        return this.mapper.toResponse(await this.getImageOrFail(id))
    }

    async create(createImageDto: CreateImageDto, file: Express.Multer.File) {
        if (!file?.filename || !file?.path) {
            throw new BadRequestException('Arquivo não enviado ou inválido')
        }

        // Validate against section rules BEFORE saving the file to DB
        await this.sectionValidator.validateImageCreate(createImageDto.sectionId)
        await this.validator.validate(file)

        try {
            const image = await this.imageModel.create({
                altText:  createImageDto.altText,
                sectionId: createImageDto.sectionId,
                imageUrl: this.fileService.generateUrl(file.filename),
            })
            logUpload(file.filename, file.path)
            return this.mapper.toResponse(image)
        } catch (error) {
            await this.fileService.remove(file.path)
            if (error instanceof BadRequestException || error instanceof NotFoundException) throw error
            throw new InternalServerErrorException('Erro ao criar imagem')
        }
    }

    async update(id: number, updateImageDto: UpdateImageDto, file?: Express.Multer.File) {
        const image = await this.getImageOrFail(id)
        const previousImageUrl = image.imageUrl
        try {
            image.altText = updateImageDto.altText ?? image.altText
            if (file) {
                if (!file.filename || !file.path) throw new BadRequestException('Arquivo inválido')
                await this.validator.validate(file)
                image.imageUrl = this.fileService.generateUrl(file.filename)
            }
            await image.save()
            if (file && previousImageUrl && previousImageUrl !== image.imageUrl) {
                await this.fileService.remove(previousImageUrl)
            }
            return this.mapper.toResponse(image)
        } catch (error) {
            if (file?.path) await this.fileService.remove(file.path)
            if (error instanceof BadRequestException || error instanceof NotFoundException) throw error
            throw new InternalServerErrorException('Erro ao atualizar imagem')
        }
    }

    async deleteById(id: number): Promise<{ message: string }> {
        const image = await this.getImageOrFail(id)
        await image.destroy()
        return { message: 'Imagem deletada com sucesso' }
    }

    private async getImageOrFail(id: number): Promise<Image> {
        const image = await this.imageModel.findByPk(id)
        if (!image) throw new NotFoundException('Imagem não encontrada')
        return image
    }
}
