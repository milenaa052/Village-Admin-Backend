import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Admin } from '../admin/admin.model';
import { AdminService } from '../admin/admin.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, AuthenticatedUser } from './types/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private adminService: AdminService,
        private configService: ConfigService
    ) {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret
        });
    }

    async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
        let user: Admin | null = null; 

        if (payload.userType === 'ADMIN') {
            user = await this.adminService.findById(payload.idUser);
        }
        
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        let idUser: number;

        if (payload.userType === 'ADMIN') {
            idUser = (user as Admin).idAdmin;
        } else {
            throw new UnauthorizedException('Tipo de usuário inválido!');
        }

        return {
            idUser: idUser,
            name: user.name,
            email: user.email,
            userType: payload.userType
        };
    }
}