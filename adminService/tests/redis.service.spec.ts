import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { RedisService } from '../src/redis/redis.service'

const mockRedisInstance = {
    quit: jest.fn()
}

jest.mock('ioredis', () => {
    return jest.fn().mockImplementation(() => mockRedisInstance)
})

describe('RedisService', () => {

    let service: RedisService

    const mockConfigService = {
        get: jest.fn((key: string, fallback?: string) => {
            const config: Record<string, string> = {
                REDIS_HOST: 'localhost',
                REDIS_PORT: '6379'
            }
            return config[key] ?? fallback
        })
    }

    beforeEach(async () => {

        jest.clearAllMocks()

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RedisService,
                {
                    provide: ConfigService,
                    useValue: mockConfigService
                }
            ]
        }).compile()

        service = module.get<RedisService>(RedisService)
    })

    describe('constructor', () => {

        it('deve ler REDIS_HOST e REDIS_PORT do ConfigService', () => {
            expect(mockConfigService.get).toHaveBeenCalledWith('REDIS_HOST', 'localhost')
            expect(mockConfigService.get).toHaveBeenCalledWith('REDIS_PORT', '6379')
        })

        it('deve criar três instâncias Redis (client, pub, sub)', () => {
            const IORedis = require('ioredis')
            expect(IORedis).toHaveBeenCalledTimes(3)
            expect(IORedis).toHaveBeenCalledWith({ host: 'localhost', port: 6379 })
        })
    })

    describe('getClient', () => {

        it('deve retornar o client Redis', () => {
            const client = service.getClient()
            expect(client).toBe(mockRedisInstance)
        })
    })

    describe('getPublisher', () => {

        it('deve retornar o publisher Redis', () => {
            const pub = service.getPublisher()
            expect(pub).toBe(mockRedisInstance)
        })
    })

    describe('getSubscriber', () => {

        it('deve retornar o subscriber Redis', () => {
            const sub = service.getSubscriber()
            expect(sub).toBe(mockRedisInstance)
        })
    })

    describe('onModuleDestroy', () => {

        it('deve chamar quit no publisher e no subscriber', async () => {
            mockRedisInstance.quit.mockResolvedValue('OK')

            await service.onModuleDestroy()

            expect(mockRedisInstance.quit).toHaveBeenCalledTimes(2)
        })

        it('deve aguardar o quit do publisher antes do subscriber', async () => {
            const order: string[] = []

            mockRedisInstance.quit
                .mockImplementationOnce(async () => { order.push('pub'); return 'OK' })
                .mockImplementationOnce(async () => { order.push('sub'); return 'OK' })

            await service.onModuleDestroy()

            expect(order).toEqual(['pub', 'sub'])
        })

        it('deve propagar erro se quit falhar', async () => {
            mockRedisInstance.quit.mockRejectedValue(new Error('Redis connection error'))

            await expect(service.onModuleDestroy()).rejects.toThrow('Redis connection error')
        })
    })
})