import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AdminService } from '../admin/admin.service'
import { ConfigService } from '@nestjs/config'
import { JwtPayload, AuthenticatedUser } from './types/jwt-payload.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private adminService: AdminService,
        private configService: ConfigService
    ) {
        const jwtSecret = configService.get<string>('JWT_SECRET')
        if (!jwtSecret) {
            throw new Error('JWT_SECRET não configurado no ambiente')
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret
        })
    }

    async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
        if (payload.userType !== 'ADMIN') {
            throw new UnauthorizedException('Tipo de usuário inválido')
        }

        const admin = await this.adminService.findById(payload.idUser)
        if (!admin) {
            throw new UnauthorizedException('Usuário não encontrado')
        }

        return {
            idUser: admin.idAdmin,
            name: admin.name,
            email: admin.email,
            userType: payload.userType
        }
    }
}