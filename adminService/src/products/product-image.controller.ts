import {
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from '@nestjs/passport'
import { AdminGuard } from '../images/guards/admin.guard'
import { ImageValidatorService } from '../images/image-validator.service'
import { ImageFileService } from '../images/image-file.service'
import { logUpload } from '../middleware/upload-logger.middleware'
import multerOptions from '../images/config/multer.config'

@UseGuards(AuthGuard('jwt'), AdminGuard)
@Controller('product')
export class ProductImageController {

    constructor(
        private readonly validator:   ImageValidatorService,
        private readonly fileService: ImageFileService,
    ) {}

    @Post('upload-image')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    async uploadImage(
        @UploadedFile() file: Express.Multer.File,
    ): Promise<{ imageUrl: string }> {

        if (!file?.filename || !file?.path) {
            throw new BadRequestException('Arquivo não enviado ou inválido')
        }

        try {
            await this.validator.validate(file)
            const imageUrl = this.fileService.generateUrl(file.filename)
            logUpload(file.filename, file.path)
            return { imageUrl }
        } catch (error) {
            await this.fileService.remove(file.path).catch(() => null)
            if (error instanceof BadRequestException) throw error
            throw new InternalServerErrorException('Erro ao processar o upload da imagem')
        }
    }
}
