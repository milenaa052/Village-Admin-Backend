import { Module, forwardRef } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Stats } from './stats.model'
import { StatsService } from './stats.service'
import { StatsController } from './stats.controller'
import { AuthModule } from '../auth/auth.module'
import { SectionModule } from '../sections/section.module'

@Module({
  imports: [
    SequelizeModule.forFeature([Stats]),
    forwardRef(() => AuthModule),
    forwardRef(() => SectionModule),
  ],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
