import { Module, forwardRef } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Content } from './content.model'
import { ContentService } from './content.service'
import { ContentController } from './content.controller'
import { AuthModule } from '../auth/auth.module'
import { SectionModule } from '../sections/section.module'

@Module({
  imports: [
    SequelizeModule.forFeature([Content]),
    forwardRef(() => AuthModule),
    forwardRef(() => SectionModule),
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
