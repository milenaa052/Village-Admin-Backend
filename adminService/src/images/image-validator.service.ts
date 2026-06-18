import { Injectable, BadRequestException } from '@nestjs/common'
import FileType from 'file-type'
import { IMAGE_UPLOAD } from './image.constants'
import { removeFileByUrl } from './config/upload.utils'
import { extname } from 'path'

@Injectable()
export class ImageValidatorService {

    async validate(file: Express.Multer.File): Promise<void> {

        const fileType =
            await FileType.fromFile(file.path)

        if (!fileType || !IMAGE_UPLOAD.ALLOWED_EXTENSIONS.includes(fileType.ext)) {

            await removeFileByUrl(file.path)

            throw new BadRequestException(
                'Arquivo inválido'
            )
        }

        const extension = extname(file.originalname).replace('.', '').toLowerCase()

        if (extension && extension !== fileType.ext) {

            await removeFileByUrl(file.path)

            throw new BadRequestException(
                'Extensão inválida'
            )
        }
    }
}