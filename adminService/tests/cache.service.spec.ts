import { Test, TestingModule } from '@nestjs/testing'
import { CacheService } from '../src/utils/cache.service'
import { RedisService } from '../src/redis/redis.service'

describe('CacheService', () => {

    let service: CacheService

    const mockRedisClient = {
        del: jest.fn(),
        set: jest.fn(),
        get: jest.fn()
    }

    const mockRedisService = {
        getClient: jest.fn().mockReturnValue(mockRedisClient)
    }

    beforeEach(async () => {

        jest.clearAllMocks()

        mockRedisService.getClient.mockReturnValue(mockRedisClient)

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CacheService,
                {
                    provide: RedisService,
                    useValue: mockRedisService
                }
            ]
        }).compile()

        service = module.get<CacheService>(CacheService)
    })

    describe('invalidate', () => {

        it('deve deletar a chave com namespace padrão', async () => {
            mockRedisClient.del.mockResolvedValue(1)

            await service.invalidate('minha-chave')

            expect(mockRedisClient.del).toHaveBeenCalledWith('default:minha-chave')
        })

        it('deve deletar a chave com namespace customizado', async () => {
            mockRedisClient.del.mockResolvedValue(1)

            await service.invalidate('minha-chave', 'usuarios')

            expect(mockRedisClient.del).toHaveBeenCalledWith('usuarios:minha-chave')
        })

        it('deve propagar erro se del falhar', async () => {
            mockRedisClient.del.mockRejectedValue(new Error('Redis error'))

            await expect(
                service.invalidate('minha-chave')
            ).rejects.toThrow('Redis error')
        })
    })

    describe('store', () => {

        it('deve armazenar valor com TTL e namespace padrão', async () => {
            mockRedisClient.set.mockResolvedValue('OK')

            await service.store('minha-chave', 'meu-valor')

            expect(mockRedisClient.set).toHaveBeenCalledWith(
                'default:minha-chave',
                'meu-valor',
                'EX',
                300
            )
        })

        it('deve armazenar valor com TTL e namespace customizados', async () => {
            mockRedisClient.set.mockResolvedValue('OK')

            await service.store('minha-chave', 'meu-valor', {
                ttl: 60,
                namespace: 'sessao'
            })

            expect(mockRedisClient.set).toHaveBeenCalledWith(
                'sessao:minha-chave',
                'meu-valor',
                'EX',
                60
            )
        })

        it('deve converter valor numérico para string', async () => {
            mockRedisClient.set.mockResolvedValue('OK')

            await service.store('contador', 42)

            expect(mockRedisClient.set).toHaveBeenCalledWith(
                'default:contador',
                '42',
                'EX',
                300
            )
        })

        it('deve propagar erro se set falhar', async () => {
            mockRedisClient.set.mockRejectedValue(new Error('Redis error'))

            await expect(
                service.store('minha-chave', 'meu-valor')
            ).rejects.toThrow('Redis error')
        })
    })

    describe('search', () => {

        it('deve retornar valor existente com namespace padrão', async () => {
            mockRedisClient.get.mockResolvedValue('meu-valor')

            const result = await service.search('minha-chave')

            expect(mockRedisClient.get).toHaveBeenCalledWith('default:minha-chave')
            expect(result).toBe('meu-valor')
        })

        it('deve retornar valor existente com namespace customizado', async () => {
            mockRedisClient.get.mockResolvedValue('meu-valor')

            const result = await service.search('minha-chave', 'sessao')

            expect(mockRedisClient.get).toHaveBeenCalledWith('sessao:minha-chave')
            expect(result).toBe('meu-valor')
        })

        it('deve retornar null para chave inexistente', async () => {
            mockRedisClient.get.mockResolvedValue(null)

            const result = await service.search('chave-inexistente')

            expect(result).toBeNull()
        })

        it('deve propagar erro se get falhar', async () => {
            mockRedisClient.get.mockRejectedValue(new Error('Redis error'))

            await expect(
                service.search('minha-chave')
            ).rejects.toThrow('Redis error')
        })
    })
})