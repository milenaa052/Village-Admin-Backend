import { Module, forwardRef } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Section } from './section.model'
import { Content } from '../contents/content.model'
import { Card } from '../cards/card.model'
import { Stats } from '../stats/stats.model'
import { Button } from '../buttons/buttons.model'
import { Image } from '../images/images.model'
import { SectionService } from './section.service'
import { FullSectionService } from './fullSection.service'
import { SectionController } from './section.controller'
import { FullSectionController } from './fullSection.controller'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [SequelizeModule.forFeature([Section, Content, Card, Stats, Button, Image]),
    forwardRef(() => AuthModule)
  ],
  controllers: [SectionController, FullSectionController],
  providers: [SectionService, FullSectionService],
  exports: [SectionService, FullSectionService]
})
export class SectionModule {}