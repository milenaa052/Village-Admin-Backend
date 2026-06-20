import { Module, forwardRef } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Admin } from './admin.model'
import { AdminService } from './admin.service'
import { AdminController } from './admin.controller'
import { AuthModule } from '../auth/auth.module'
import { AdminValidatorService } from './admin-validator.service'
import { AdminMapperService } from './admin-mapper.service'
import { CacheModule } from '../utils/cache.module'
import { AdminRecoverPassService } from './admin-recover-pass.service'
import { CacheService } from '../utils/cache.service'
import { RedisService } from '../redis/redis.service'
import { RedisModule } from '../redis/redis.module'

@Module({
  imports: [SequelizeModule.forFeature([Admin]),
    forwardRef(() => AuthModule),
    CacheModule,
    RedisModule
  ],
  controllers: [AdminController],
  providers: [
    AdminService, 
    AdminValidatorService, 
    AdminMapperService, 
    AdminRecoverPassService,
    CacheService,
    RedisService
  ],
  exports: [AdminService],
})
export class AdminModule {}