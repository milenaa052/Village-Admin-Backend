import { Injectable } from "@nestjs/common"
import { RedisService } from "../redis/redis.service"

interface CacheOptions {
    ttl?: number
    namespace?: string
}

@Injectable()
export class CacheService {
    constructor(
        private readonly redis: RedisService
    ) {}

    async invalidate(key: string, namespace = 'default'): Promise<void> {
        const fullKey = `${namespace}:${key}`
        await this.redis.getClient().del(fullKey)
    }

    async store(key: string, value: any,  options: CacheOptions = {}): Promise<void> {
        const { ttl = 300, namespace = 'default' } = options
        
        const fullKey = `${namespace}:${key}`

        await this.redis.getClient().set(
            fullKey,
            String(value),
            'EX',
            ttl
        )
    }

    async search(key: string, namespace = 'default'): Promise<string | null> {
        const fullKey = `${namespace}:${key}`

        return await this.redis.getClient().get(fullKey)
    }
}