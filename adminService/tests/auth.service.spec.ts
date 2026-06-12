import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from '../src/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { UnauthorizedException } from '@nestjs/common'
import { AdminService } from '../src/admin/admin.service'
import { ConfigService } from '@nestjs/config'

describe('AuthService', () => {

    let service: AuthService

    const mockAdminService = {
        findByEmail: jest.fn(),
        findById: jest.fn()
    }

    const mockJwtService = {
        sign: jest.fn()
    }

    const mockConfigService = {
        get: jest.fn().mockReturnValue('7d')
    }

    beforeEach(async () => {

        jest.clearAllMocks()

        mockConfigService.get.mockReturnValue('7d')

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: AdminService,
                    useValue: mockAdminService
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService
                }
            ]
        }).compile()

        service = module.get<AuthService>(AuthService)
    })

    describe('validateUser', () => {

        it('deve lançar UnauthorizedException se o usuário não existir', async () => {
            mockAdminService.findByEmail.mockResolvedValue(null)

            await expect(
                service.validateUser('teste@email.com', '123')
            ).rejects.toBeInstanceOf(UnauthorizedException)
        })

        it('deve lançar UnauthorizedException se a senha estiver incorreta', async () => {

            const mockAdmin = {
                comparePassword: jest.fn().mockResolvedValue(false)
            }

            mockAdminService.findByEmail.mockResolvedValue(mockAdmin)

            await expect(
                service.validateUser('teste@email.com', '123')
            ).rejects.toBeInstanceOf(UnauthorizedException)
            expect(mockAdmin.comparePassword).toHaveBeenCalledWith('123')
        })

        it('deve validar usuário com sucesso', async () => {

            const mockAdmin = {
                idAdmin: 1,
                name: 'Administrador',
                email: 'admin@email.com',
                comparePassword: jest.fn().mockResolvedValue(true)
            }

            mockAdminService.findByEmail.mockResolvedValue(mockAdmin)
            const result = await service.validateUser(
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

    describe('login', () => {

        it('deve realizar login com sucesso', async () => {

            const mockAdmin = {
                idAdmin: 1,
                name: 'Administrador',
                email: 'admin@email.com',
                comparePassword: jest.fn().mockResolvedValue(true)
            }
            const mockToken = 'jwt-token-fake'

            mockAdminService.findByEmail.mockResolvedValue(mockAdmin)
            mockJwtService.sign.mockReturnValue(mockToken)
            const result = await service.login({
                email: 'admin@email.com',
                password: '123456'
            })

            expect(mockAdminService.findByEmail)
                .toHaveBeenCalledWith('admin@email.com')

            expect(mockAdmin.comparePassword)

                .toHaveBeenCalledWith('123456')
            expect(mockJwtService.sign).toHaveBeenCalledWith(
                {
                    idUser: 1,
                    name: 'Administrador',
                    email: 'admin@email.com',
                    userType: 'ADMIN'
                },
                {
                    expiresIn: '7d'
                }
            )

            expect(result).toEqual({
                message: 'Login realizado com sucesso',
                token: mockToken,
                user: {
                    idUser: 1,
                    name: 'Administrador',
                    email: 'admin@email.com',
                    userType: 'ADMIN'
                }
            })
        })
    })

    describe('getProfile', () => {

        it('deve retornar perfil com sucesso', async () => {

            const mockAdmin = {
                idAdmin: 1,
                name: 'Administrador',
                email: 'admin@email.com'
            }

            mockAdminService.findById.mockResolvedValue(mockAdmin)
            const result = await service.getProfile(1, 'ADMIN')

            expect(mockAdminService.findById)
                .toHaveBeenCalledWith(1)

            expect(result).toEqual({
                message: 'Usuário autenticado com sucesso',
                user: {
                    idUser: 1,
                    name: 'Administrador',
                    email: 'admin@email.com',
                    userType: 'ADMIN'
                }
            })
        })

        it('deve lançar UnauthorizedException para tipo de usuário inválido', async () => {

            await expect(
                service.getProfile(1, 'USER' as any)
            ).rejects.toBeInstanceOf(UnauthorizedException)
        })

        it('deve lançar UnauthorizedException se usuário não existir', async () => {

            mockAdminService.findById.mockResolvedValue(null)

            await expect(
                service.getProfile(1, 'ADMIN')
            ).rejects.toBeInstanceOf(UnauthorizedException)
        })
    })

    describe('checkEmailExists', () => {

        it('deve retornar exists true quando email existir', async () => {

            mockAdminService.findByEmail.mockResolvedValue({
                idAdmin: 1
            })

            const result = await service.checkEmailExists(
                'admin@email.com'
            )

            expect(result).toEqual({
                exists: true,
                userType: 'ADMIN'
            })
        })

        it('deve retornar exists false quando email não existir', async () => {

            mockAdminService.findByEmail.mockResolvedValue(null)

            const result = await service.checkEmailExists(
                'admin@email.com'
            )

            expect(result).toEqual({
                exists: false
            })
        })
    })
})