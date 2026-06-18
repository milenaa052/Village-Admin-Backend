import { Module, forwardRef } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Image } from './images.model'
import { ImageService } from './image.service'
import { ImageController } from './image.controller'
import { AuthModule } from '../auth/auth.module'
import { ImageValidatorService } from './image-validator.service'
import { ImageMapperService } from './image-mapper.service'
import { ImageFileService } from './image-file.service'

@Module({
    imports: [SequelizeModule.forFeature([Image]),
        forwardRef(() => AuthModule)
    ],
    controllers: [ImageController],
    providers: [ImageService, ImageValidatorService, ImageMapperService, ImageFileService],
    exports: [ImageService],
})

export class ImageModule {}