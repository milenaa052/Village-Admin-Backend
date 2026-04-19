import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from '../admin/admin.model';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UserType } from '../admin/admin.model';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Admin)
        private readonly adminModel: typeof Admin
    ) {}

    async checkEmailExists(email: string) {
        const admin = await this.findByEmail(email);

        if (admin) {
            return true;
        }
    }

    async create(createAdminDto: CreateAdminDto): Promise<Admin> {
        const requiredFields: (keyof CreateAdminDto)[] = ['name', 'email', 'password'];
        for (const field of requiredFields) {
            if (!createAdminDto[field]) {
                throw new BadRequestException('Todos os campos são obrigatórios!');
            }
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(createAdminDto.email)) {
            throw new BadRequestException('Formato de email inválido!');
        }

        const emailExists = await this.checkEmailExists(createAdminDto.email);
        if (emailExists) {
            throw new ConflictException('Este email já está cadastrado!');
        }

        const passwordValidation = Admin.validatePasswordLevel(createAdminDto.password);
        if (!passwordValidation.validate) {
            throw new BadRequestException({
                message: 'Senha muito fraca',
                details: passwordValidation.requirements,
            });
        }

        try {
            const adminData = {
                name: createAdminDto.name,
                email: createAdminDto.email,
                password: createAdminDto.password,
                type: UserType.ADMIN
            };

            const admin = await this.adminModel.create(adminData);
            return admin
        } catch (error) {
            throw new BadRequestException('Erro ao criar usuário!');
        }
    }

    async findAll() {
        return await this.adminModel.findAll();
    }

    async findById(id: number) {
        const admin = await this.adminModel.findByPk(id);

        if (!admin) throw new NotFoundException('Admin não encontrado!');
        return admin;
    }

    async findByEmail(email: string): Promise<Admin | null> {
        return this.adminModel.findOne({
            where: { email }
        });
    }
}