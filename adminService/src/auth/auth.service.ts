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
        let user = await this.adminService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        return {
            idUser: user.idAdmin,
            name: user.name,
            email: user.email,
            userType: 'ADMIN'
        };
    }

    async login(loginDto: LoginDto): Promise<LoginResponse> {
        const { email, password } = loginDto;

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
            message: 'Login realizado com sucesso',
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
            throw new UnauthorizedException('Usuário não encontrado');
        }

        let idUser: number;

        if (userType === 'ADMIN') {
            idUser = (user as Admin).idAdmin;
        } else {
            throw new UnauthorizedException('Tipo de usuário inválido');
        }

        return {
            message: 'Usuário autenticado com sucesso',
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