import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Admin } from '../admin/admin.model'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'
import { PasswordValidator } from './password.validator'
import { AdminResponseDto } from './interface/admin-response.dto'
import { UserType } from './interface/admin.interface'

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Admin)
        private readonly adminModel: typeof Admin
    ) {}

    async create(createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
        const emailAlreadyExists = await this.findByEmail(
            createAdminDto.email
        )

        if (emailAlreadyExists) {
            throw new ConflictException('Este email já está cadastrado')
        }

        const passwordValidation = PasswordValidator.validatePasswordLevel(
            createAdminDto.password
        )

        if (!passwordValidation.validate) {
            throw new BadRequestException({
                message: 'Senha muito fraca',
                requirements: passwordValidation.requirements
            })
        }

        try {
            const admin = await this.adminModel.create({
                ...createAdminDto,
                type: UserType.ADMIN
            })

            return this.formatResponse(admin);
        } catch (error) {
            throw new BadRequestException('Erro ao criar administrador')
        }
    }

    async findAll() {
        return await this.adminModel.findAll()
    }

    async findById(id: number) {
        const admin = await this.adminModel.findByPk(id)

        if (!admin) throw new NotFoundException('Administrador não encontrado')
        return admin;
    }

    async findByEmail(email: string): Promise<Admin | null> {
        return this.adminModel.findOne({
            where: { email },
            attributes: { 
                include: ['password'] 
            }
        })
    }

    async update(id: number, loggedAdminId: number, updateAdminDto: UpdateAdminDto) {
        if (id !== loggedAdminId) {
            throw new ForbiddenException(
                'Você não tem permissão para editar este usuário'
            )
        }

        const admin = await this.adminModel.findByPk(id);
        if (!admin) {
            throw new NotFoundException('Administrador não encontrado!')
        }

        if (updateAdminDto.email && updateAdminDto.email !== admin.email) {
            throw new BadRequestException('O email não pode ser alterado')
        }

        if (updateAdminDto.currentPassword || updateAdminDto.newPassword) {
            await this.handlePasswordUpdate(
                admin,
                updateAdminDto
            )
        }

        admin.name = updateAdminDto.name ?? admin.name
        admin.phone = updateAdminDto.phone ?? admin.phone

        try {
            await admin.save()
            return this.formatResponse(admin)
        } catch (error) {
            throw new InternalServerErrorException(
                'Erro ao atualizar administrador'
            )
        }
    }

    private async handlePasswordUpdate(admin: Admin, updateAdminDto: UpdateAdminDto): Promise<void> {
        if (!updateAdminDto.currentPassword || !updateAdminDto.newPassword) {
            throw new BadRequestException(
                'Senha atual e nova senha são obrigatórias'
            )
        }

        const correctPassword = await admin.comparePassword(
            updateAdminDto.currentPassword
        )

        if (!correctPassword) {
            throw new BadRequestException('Senha atual incorreta')
        }

        const passwordValidation = PasswordValidator.validatePasswordLevel(
            updateAdminDto.newPassword
        )

        if (!passwordValidation.validate) {
            throw new BadRequestException({
                message: 'Senha muito fraca',
                requirements: passwordValidation.requirements
            })
        }

        admin.password = updateAdminDto.newPassword;
    }

    private formatResponse(admin: Admin): AdminResponseDto {
        return {
            idAdmin: admin.idAdmin,
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            type: admin.type,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt
        }
    }
}