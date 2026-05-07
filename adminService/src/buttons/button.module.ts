import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Button } from './buttons.model';
import { ButtonService } from './button.service';
import { ButtonController } from './button.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([Button]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ButtonController],
  providers: [ButtonService],
  exports: [ButtonService],
})
export class ButtonModule {}