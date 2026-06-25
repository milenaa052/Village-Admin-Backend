jest.mock('../src/utils/smtp', () => ({
    sendEmail: jest.fn()
}))

jest.mock('../src/config/logger', () => ({
    logger: {
        info:  jest.fn(),
        error: jest.fn()
    }
}))

jest.mock('crypto', () => ({
    ...jest.requireActual('crypto'),
    randomUUID: jest.fn().mockReturnValue('mocked-uuid')
}))

import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, ConflictException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { AdminInviteService } from '../src/admin/admin-invite.service'
import { Admin } from '../src/admin/admin.model'
import { CacheService } from '../src/utils/cache.service'
import { sendEmail } from '../src/utils/smtp'
import { logger } from '../src/config/logger'

describe('AdminInviteService', () => {

    let service: AdminInviteService

    const mockAdminModel = {
        findOne: jest.fn()
    }

    const mockCacheService = {
        store:      jest.fn(),
        search:     jest.fn(),
        invalidate: jest.fn()
    }

    beforeEach(async () => {

        jest.clearAllMocks()

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AdminInviteService,
                {
                    provide: getModelToken(Admin),
                    useValue: mockAdminModel
                },
                {
                    provide: CacheService,
                    useValue: mockCacheService
                }
            ]
        }).compile()

        service = module.get<AdminInviteService>(AdminInviteService)
    })

    // ─── sendInvite ──────────────────────────────────────────────────────────

    describe('sendInvite', () => {

        it('deve lançar ConflictException se email já estiver cadastrado', async () => {

            mockAdminModel.findOne.mockResolvedValue({ idAdmin: 1 })

            await expect(
                service.sendInvite('Convidador', 'existente@email.com')
            ).rejects.toBeInstanceOf(ConflictException)

            expect(mockCacheService.store).not.toHaveBeenCalled()
            expect(sendEmail).not.toHaveBeenCalled()
        })

        it('deve armazenar token no cache com TTL de 24h', async () => {

            mockAdminModel.findOne.mockResolvedValue(null)
            mockCacheService.store.mockResolvedValue(undefined);
            (sendEmail as jest.Mock).mockResolvedValue(undefined)

            await service.sendInvite('Convidador', 'novo@email.com')

            expect(mockCacheService.store).toHaveBeenCalledWith(
                'token:mocked-uuid',
                'novo@email.com',
                {
                    ttl: 60 * 60 * 24,
                    namespace: 'invite'
                }
            )
        })

        it('deve enviar email com link de convite correto', async () => {

            mockAdminModel.findOne.mockResolvedValue(null)
            mockCacheService.store.mockResolvedValue(undefined);
            (sendEmail as jest.Mock).mockResolvedValue(undefined)

            await service.sendInvite('Convidador', 'novo@email.com')

            expect(sendEmail).toHaveBeenCalledWith(
                'novo@email.com',
                'Convite para Área Administrativa — Aldeia Cultura Viva',
                expect.stringContaining(
                    '/admin/cadastro?token=mocked-uuid'
                )
            )
        })

        it('deve usar FRONTEND_URL do ambiente quando definido', async () => {

            process.env.FRONTEND_URL = 'https://meusite.com'

            mockAdminModel.findOne.mockResolvedValue(null)
            mockCacheService.store.mockResolvedValue(undefined);
            (sendEmail as jest.Mock).mockResolvedValue(undefined)

            await service.sendInvite('Convidador', 'novo@email.com')

            expect(sendEmail).toHaveBeenCalledWith(
                'novo@email.com',
                expect.any(String),
                expect.stringContaining(
                    'https://meusite.com/admin/cadastro?token=mocked-uuid'
                )
            )

            delete process.env.FRONTEND_URL
        })

        it('deve usar fallback http://localhost:5173 quando FRONTEND_URL não estiver definido', async () => {

            delete process.env.FRONTEND_URL

            mockAdminModel.findOne.mockResolvedValue(null)
            mockCacheService.store.mockResolvedValue(undefined);
            (sendEmail as jest.Mock).mockResolvedValue(undefined)

            await service.sendInvite('Convidador', 'novo@email.com')

            expect(sendEmail).toHaveBeenCalledWith(
                'novo@email.com',
                expect.any(String),
                expect.stringContaining(
                    'http://localhost:5173/admin/cadastro?token=mocked-uuid'
                )
            )
        })

        it('deve registrar log de sucesso após envio', async () => {

            mockAdminModel.findOne.mockResolvedValue(null)
            mockCacheService.store.mockResolvedValue(undefined);
            (sendEmail as jest.Mock).mockResolvedValue(undefined)

            await service.sendInvite('Convidador', 'novo@email.com')

            expect(logger.info).toHaveBeenCalledWith(
                expect.stringContaining('novo@email.com')
            )
        })

        it('deve registrar log de erro quando o envio de email falhar, sem lançar exceção', async () => {

            mockAdminModel.findOne.mockResolvedValue(null)
            mockCacheService.store.mockResolvedValue(undefined);
            (sendEmail as jest.Mock).mockRejectedValue(new Error('SMTP indisponível'))

            await expect(
                service.sendInvite('Convidador', 'novo@email.com')
            ).resolves.toBeUndefined()

            expect(logger.error).toHaveBeenCalledWith(
                expect.stringContaining('Erro ao enviar e-mail de convite:'),
                expect.any(Error)
            )
        })
    })

    // ─── validateToken ───────────────────────────────────────────────────────

    describe('validateToken', () => {

        it('deve retornar o email vinculado ao token quando válido', async () => {

            mockCacheService.search.mockResolvedValue('usuario@email.com')

            const result = await service.validateToken('mocked-uuid')

            expect(mockCacheService.search).toHaveBeenCalledWith(
                'token:mocked-uuid',
                'invite'
            )
            expect(result).toBe('usuario@email.com')
        })

        it('deve lançar BadRequestException quando token não existir no cache', async () => {

            mockCacheService.search.mockResolvedValue(null)

            await expect(
                service.validateToken('token-invalido')
            ).rejects.toBeInstanceOf(BadRequestException)
        })

        it('deve lançar BadRequestException quando token estiver expirado', async () => {

            mockCacheService.search.mockResolvedValue(undefined)

            await expect(
                service.validateToken('token-expirado')
            ).rejects.toBeInstanceOf(BadRequestException)
        })
    })

    // ─── consumeToken ────────────────────────────────────────────────────────

    describe('consumeToken', () => {

        it('deve invalidar o token no cache', async () => {

            mockCacheService.invalidate.mockResolvedValue(undefined)

            await service.consumeToken('mocked-uuid')

            expect(mockCacheService.invalidate).toHaveBeenCalledWith(
                'token:mocked-uuid',
                'invite'
            )
        })

        it('deve resolver sem erros', async () => {

            mockCacheService.invalidate.mockResolvedValue(undefined)

            await expect(
                service.consumeToken('mocked-uuid')
            ).resolves.toBeUndefined()
        })
    })
})