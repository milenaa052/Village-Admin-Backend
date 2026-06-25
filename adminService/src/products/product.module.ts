import { Module, forwardRef } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Product } from './product.model'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { ProductImageController } from './product-image.controller'
import { AuthModule } from '../auth/auth.module'
import { Category } from '../categories/category.model'
import { ImageValidatorService } from '../images/image-validator.service'
import { ImageFileService } from '../images/image-file.service'

@Module({
  imports: [
    SequelizeModule.forFeature([Product, Category]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ProductController, ProductImageController],
  providers: [ProductService, ImageValidatorService, ImageFileService],
  exports: [ProductService],
})
export class ProductModule {}
