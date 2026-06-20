import { Module } from '@nestjs/common'
import { RedisService } from "../redis/redis.service"
import { CacheService } from "./cache.service"

@Module({
    providers: [
        CacheService,
        RedisService
    ],
    exports: [
        CacheService
    ]
})

export class CacheModule {}