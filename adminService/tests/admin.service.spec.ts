import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, ConflictException, ForbiddenException, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { AdminService } from '../src/admin/admin.service'
import { Admin } from '../src/admin/admin.model'
import { PasswordValidator } from '../src/admin/password.validator'
import { UserType } from '../src/admin/interface/admin.interface'
import { AdminValidatorService } from '../src/admin/admin-validator.service'
import { AdminMapperService } from '../src/admin/admin-mapper.service'

describe('AdminService', () => {

    let service: AdminService

    const mockAdminModel = {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn()
    }

    const mockValidatorService = {
        validatePassword: jest.fn()
    }

    const mockMapperService = {
        toResponse: jest.fn()
    }

    beforeEach(async () => {

        jest.clearAllMocks()

        mockMapperService.toResponse.mockImplementation(
            (admin) => ({
                idAdmin: admin.idAdmin,
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
                type: admin.type,
                createdAt: admin.createdAt,
                updatedAt: admin.updatedAt
            })
        )

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AdminService,
                {
                    provide: getModelToken(Admin),
                    useValue: mockAdminModel
                },
                {
                    provide: AdminValidatorService,
                    useValue: mockValidatorService
                },
                {
                    provide: AdminMapperService,
                    useValue: mockMapperService
                }
            ]
        }).compile()

        service = module.get<AdminService>(AdminService)
    })

    it('deve criar um administrador com sucesso', async () => {

        jest.spyOn(service, 'findByEmail').mockResolvedValue(null)
        jest.spyOn(
            PasswordValidator,
            'validatePasswordLevel'
        ).mockReturnValue({
            validate: true,
            message: 'Senha válida',
            requirements: {
                hasUppercase: true,
                hasLowercase: true,
                hasNumber: true,
                hasSpecialChar: true,
                hasMinLength: true
            }
        })

        const mockAdmin = {
            idAdmin: 1,
            name: 'Admin',
            email: 'admin@email.com',
            phone: '41999999999',
            type: UserType.ADMIN,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        mockAdminModel.create.mockResolvedValue(mockAdmin)

        const result = await service.create({
            name: 'Admin',
            email: 'admin@email.com',
            password: 'Senha123@',
            phone: '41999999999'
        })

        expect(mockAdminModel.create).toHaveBeenCalled()
        expect(result).toEqual({
            idAdmin: mockAdmin.idAdmin,
            name: mockAdmin.name,
            email: mockAdmin.email,
            phone: mockAdmin.phone,
            type: mockAdmin.type,
            createdAt: mockAdmin.createdAt,
            updatedAt: mockAdmin.updatedAt
        })
    })

    it('deve lançar ConflictException se email já existir', async () => {

        jest.spyOn(service, 'findByEmail').mockResolvedValue({} as Admin)

        await expect(
            service.create({
                name: 'Admin',
                email: 'admin@email.com',
                password: 'Senha123@',
                phone: '41999999999'
            })
        ).rejects.toBeInstanceOf(ConflictException)
    })

    it('deve lançar BadRequestException para senha fraca', async () => {

        jest.spyOn(service, 'findByEmail')
            .mockResolvedValue(null)

        mockValidatorService.validatePassword
            .mockImplementation(() => {
                throw new BadRequestException(
                    'Senha muito fraca'
                )
            })

        await expect(
            service.create({
                name: 'Admin',
                email: 'admin@email.com',
                password: '123',
                phone: '41999999999'
            })
        ).rejects.toBeInstanceOf(
            BadRequestException
        )
    })

    it('deve retornar todos os administradores', async () => {

        const admins = [
            { idAdmin: 1, name: 'Admin 1' },
            { idAdmin: 2, name: 'Admin 2' }
        ]

        mockAdminModel.findAll.mockResolvedValue(admins)
        const result = await service.findAll()

        expect(mockAdminModel.findAll).toHaveBeenCalled()
        expect(result).toEqual(admins)
    })

    it('deve retornar administrador por id', async () => {

        const admin = {
            idAdmin: 1,
            name: 'Admin'
        }

        mockAdminModel.findByPk.mockResolvedValue(admin)
        const result = await service.findById(1)

        expect(mockAdminModel.findByPk).toHaveBeenCalledWith(1)
        expect(result).toEqual(admin)
    })

    it('deve lançar NotFoundException ao buscar administrador inexistente', async () => {

        mockAdminModel.findByPk.mockResolvedValue(null)

        await expect(
            service.findById(1)
        ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('deve retornar administrador pelo email', async () => {

        const admin = {
            idAdmin: 1,
            email: 'admin@email.com'
        }

        mockAdminModel.findOne.mockResolvedValue(admin)
        const result = await service.findByEmail('admin@email.com')

        expect(mockAdminModel.findOne).toHaveBeenCalledWith({
            where: { email: 'admin@email.com' },
            attributes: {
                include: ['password']
            }
        })
        expect(result).toEqual(admin)
    })

    it('deve lançar ForbiddenException se usuário tentar editar outro administrador', async () => {

        await expect(
            service.update(
                1,
                2,
                {
                    name: 'Novo Nome'
                }
            )
        ).rejects.toBeInstanceOf(ForbiddenException)
    })

    it('deve lançar NotFoundException ao atualizar administrador inexistente', async () => {

        mockAdminModel.findByPk.mockResolvedValue(null)

        await expect(
            service.update(
                1,
                1,
                {
                    name: 'Novo Nome'
                }
            )
        ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('deve lançar BadRequestException ao tentar alterar email', async () => {

        const mockAdmin = {
            idAdmin: 1,
            email: 'admin@email.com'
        }

        mockAdminModel.findByPk.mockResolvedValue(mockAdmin)

        await expect(
            service.update(
                1,
                1,
                {
                    email: 'novo@email.com'
                }
            )
        ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('deve atualizar administrador com sucesso', async () => {

        const mockAdmin = {
            idAdmin: 1,
            name: 'Admin',
            email: 'admin@email.com',
            phone: '41999999999',
            type: UserType.ADMIN,
            createdAt: new Date(),
            updatedAt: new Date(),
            save: jest.fn().mockResolvedValue(true)
        }

        mockAdminModel.findByPk.mockResolvedValue(mockAdmin)
        const result = await service.update(
            1,
            1,
            {
                name: 'Novo Nome',
                phone: '41888888888'
            }
        )

        expect(mockAdmin.save).toHaveBeenCalled()
        expect(result.name).toBe('Novo Nome')
        expect(result.phone).toBe('41888888888')
    })

    it('deve lançar InternalServerErrorException ao falhar atualização', async () => {

        const mockAdmin = {
            idAdmin: 1,
            name: 'Admin',
            email: 'admin@email.com',
            phone: '41999999999',
            type: UserType.ADMIN,
            save: jest.fn().mockRejectedValue(new Error())
        }

        mockAdminModel.findByPk.mockResolvedValue(mockAdmin)
        await expect(
            service.update(
                1,
                1,
                {
                    name: 'Novo Nome'
                }
            )
        ).rejects.toBeInstanceOf(InternalServerErrorException)
    })

    it('deve atualizar senha com sucesso', async () => {

        jest.spyOn(
            PasswordValidator,
            'validatePasswordLevel'
        ).mockReturnValue({
            validate: true,
            message: 'Senha válida',
            requirements: {
                hasUppercase: true,
                hasLowercase: true,
                hasNumber: true,
                hasSpecialChar: true,
                hasMinLength: true
            }
        })

        const mockAdmin = {
            idAdmin: 1,
            name: 'Admin',
            email: 'admin@email.com',
            phone: '41999999999',
            type: UserType.ADMIN,
            password: '123',
            comparePassword: jest.fn().mockResolvedValue(true),
            save: jest.fn().mockResolvedValue(true),
            createdAt: new Date(),
            updatedAt: new Date()
        }

        mockAdminModel.findByPk.mockResolvedValue(mockAdmin)
        await service.update(
            1,
            1,
            {
                currentPassword: '123',
                newPassword: 'NovaSenha123@'
            }
        )

        expect(mockAdmin.comparePassword).toHaveBeenCalledWith('123')
        expect(mockAdmin.password).toBe('NovaSenha123@')
    })

    it('deve lançar BadRequestException se senha atual estiver incorreta', async () => {

        const mockAdmin = {
            idAdmin: 1,
            email: 'admin@email.com',
            comparePassword: jest.fn().mockResolvedValue(false)
        }

        mockAdminModel.findByPk.mockResolvedValue(mockAdmin)

        await expect(
            service.update(
                1,
                1,
                {
                    currentPassword: '123',
                    newPassword: 'NovaSenha123@'
                }
            )
        ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('deve lançar BadRequestException ao falhar criação do administrador', async () => {

        jest.spyOn(service, 'findByEmail')
            .mockResolvedValue(null)

        mockValidatorService.validatePassword
            .mockImplementation(() => undefined)

        mockAdminModel.create
            .mockRejectedValue(new Error('Erro banco'))

        await expect(
            service.create({
                name: 'Admin',
                email: 'admin@email.com',
                password: 'Senha123@',
                phone: '41999999999'
            })
        ).rejects.toThrow(
            new BadRequestException(
                'Erro ao criar administrador'
            )
        )

        expect(mockAdminModel.create)
            .toHaveBeenCalled()
    })

    it('deve lançar BadRequestException quando faltar senha atual ou nova senha', async () => {

        const mockAdmin = {
            idAdmin: 1,
            email: 'admin@email.com'
        }

        mockAdminModel.findByPk.mockResolvedValue(mockAdmin)

        await expect(
            service.update(
                1,
                1,
                {
                    currentPassword: '123'
                }
            )
        ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('deve lançar BadRequestException para nova senha fraca', async () => {

        jest.spyOn(
            PasswordValidator,
            'validatePasswordLevel'
        ).mockReturnValue({
            validate: false,
            message: 'Senha fraca',
            requirements: {
                hasUppercase: false,
                hasLowercase: true,
                hasNumber: false,
                hasSpecialChar: false,
                hasMinLength: false
            }
        })

        const mockAdmin = {
            idAdmin: 1,
            email: 'admin@email.com',
            password: '123',
            comparePassword: jest.fn().mockResolvedValue(true)
        }

        mockAdminModel.findByPk.mockResolvedValue(mockAdmin)

        await expect(
            service.update(
                1,
                1,
                {
                    currentPassword: '123',
                    newPassword: '123'
                }
            )
        ).rejects.toBeInstanceOf(BadRequestException)
    })
})