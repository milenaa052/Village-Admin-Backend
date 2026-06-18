import { Module, forwardRef } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Admin } from './admin.model'
import { AdminService } from './admin.service'
import { AdminController } from './admin.controller'
import { AuthModule } from '../auth/auth.module'
import { AdminValidatorService } from './admin-validator.service'
import { AdminMapperService } from './admin-mapper.service'

@Module({
  imports: [SequelizeModule.forFeature([Admin]),
    forwardRef(() => AuthModule)
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminValidatorService, AdminMapperService],
  exports: [AdminService],
})
export class AdminModule {}