import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { AuthValidatorService } from '../src/auth/auth-validator.service'
import { AdminService } from '../src/admin/admin.service'

describe('AuthValidatorService', () => {

    let service: AuthValidatorService

    const mockAdminService = {
        findByEmail: jest.fn()
    }

    beforeEach(async () => {

        jest.clearAllMocks()

        const module: TestingModule =
            await Test.createTestingModule({
                providers: [
                    AuthValidatorService,
                    {
                        provide: AdminService,
                        useValue: mockAdminService
                    }
                ]
            }).compile()

        service =
            module.get<AuthValidatorService>(
                AuthValidatorService
            )
    })

    it('deve lançar erro quando usuário não existir', async () => {

        mockAdminService.findByEmail.mockResolvedValue(null)

        await expect(
            service.validateUser(
                'teste@email.com',
                '123'
            )
        ).rejects.toThrow(
            UnauthorizedException
        )
    })

    it('deve lançar erro quando senha for inválida', async () => {

        const mockAdmin = {
            comparePassword: jest.fn()
                .mockResolvedValue(false)
        }

        mockAdminService.findByEmail
            .mockResolvedValue(mockAdmin)

        await expect(
            service.validateUser(
                'teste@email.com',
                '123'
            )
        ).rejects.toThrow(
            UnauthorizedException
        )
    })

    it('deve validar usuário com sucesso', async () => {

        const mockAdmin = {
            idAdmin: 1,
            name: 'Administrador',
            email: 'admin@email.com',
            comparePassword: jest.fn()
                .mockResolvedValue(true)
        }

        mockAdminService.findByEmail
            .mockResolvedValue(mockAdmin)

        const result =
            await service.validateUser(
                'admin@email.com',
                '123456'
            )

        expect(result).toEqual({
            idUser: 1,
            name: 'Administrador',
            email: 'admin@email.com',
            userType: 'ADMIN'
        })
    })
})