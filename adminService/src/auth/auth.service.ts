import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Admin } from '../admin/admin.model';
import { AdminService } from '../admin/admin.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/jwt-payload.interface';
import { LoginResponse, ProfileResponse } from './types/auth-response.interface';

export type UserType = 'ADMIN';

export interface AuthenticatedUser {
    idUser: number;
    name: string;
    email: string;
    userType: UserType;
}

@Injectable()
export class AuthService {
    constructor(
        private adminService: AdminService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<AuthenticatedUser> {
        let user: Admin | null = await this.adminService.findByEmail(email);
        let userType: UserType = 'ADMIN';

        if (!user) {
            user = await this.adminService.findByEmail(email);
            userType = 'ADMIN';
        }
        
        if (!user) {
        throw new UnauthorizedException('Credenciais Inválidas!');
        }

        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciais Inválidas!');
        }
        
        let idUser: number;

        if (userType === 'ADMIN') {
            idUser = (user as Admin).idAdmin;
        } else {
            throw new UnauthorizedException('Tipo de usuário inválido!');
        }

        return {
            idUser: idUser,
            name: user.name,
            email: user.email,
            userType: userType
        };
    }

    async login(loginDto: LoginDto): Promise<LoginResponse> {
        const { email, password } = loginDto;

        if (!email || !password) {
            throw new BadRequestException('Email e senha são obrigatórios!');
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            throw new BadRequestException('Formato de email inválido!');
        }

        const user = await this.validateUser(email, password);

        const payload: JwtPayload = {
            idUser: user.idUser,
            name: user.name,
            email: user.email,
            userType: user.userType
        };

        let signOptions: JwtSignOptions = {}; 

        if (user.userType !== 'ADMIN') {
            signOptions.expiresIn = '7d';
        }

        return {
            message: 'Login realizado com sucesso!',
            token: this.jwtService.sign(payload, signOptions), 
            user: user
        };
    }

    async getProfile(userId: number, userType: UserType): Promise<ProfileResponse> {
        let user: Admin | null = null;

        if (userType === 'ADMIN') {
            user = await this.adminService.findById(userId);
        }
        
        if (!user) {
            throw new UnauthorizedException('Usuário não encontrado!');
        }

        let idUser: number;

        if (userType === 'ADMIN') {
            idUser = (user as Admin).idAdmin;
        } else {
            throw new UnauthorizedException('Tipo de usuário inválido!');
        }

        return {
            message: 'Usuário autenticado com sucesso!',
            user: {
                idUser: idUser,
                name: user.name,
                email: user.email,
                userType: userType
            }
        };
    }

    async checkEmailExists(email: string): Promise<{ exists: boolean; userType?: UserType }> {
        const admin = await this.adminService.findByEmail(email);
        if (admin) {
            return { exists: true, userType: 'ADMIN' };
        }

        return { exists: false };
    }
}