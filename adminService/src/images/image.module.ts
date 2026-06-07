import { Module, forwardRef } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Image } from './images.model'
import { ImageService } from './image.service'
import { ImageController } from './image.controller'
import { AuthModule } from '../auth/auth.module'

@Module({
    imports: [SequelizeModule.forFeature([Image]),
        forwardRef(() => AuthModule)
    ],
    controllers: [ImageController],
    providers: [ImageService],
    exports: [ImageService],
})

export class ImageModule {}