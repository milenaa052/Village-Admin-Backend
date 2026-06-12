import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'
import { AdminService } from '../admin/admin.service'
import { LoginDto } from './dto/login.dto'
import { JwtPayload, AuthenticatedUser, UserType } from './interface/jwt-payload.interface'
import { LoginResponse, ProfileResponse } from './interface/auth-response.interface'
import { ConfigService } from '@nestjs/config'
import { StringValue } from 'ms'
import { logLoginFailed, logLoginSuccess } from '../middleware/login-logger.middleware'

@Injectable()
export class AuthService {
    constructor(
        private adminService: AdminService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async validateUser(email: string, password: string): Promise<AuthenticatedUser> {
        const admin = await this.adminService.findByEmail(email)
        if (!admin) {
            logLoginFailed(email)
            throw new UnauthorizedException('Credenciais inválidas')
        }

        const isPasswordValid = await admin.comparePassword(password)
        if (!isPasswordValid) {
            logLoginFailed(password)
            throw new UnauthorizedException('Credenciais inválidas')
        }

        logLoginSuccess(
            admin.idAdmin,
            admin.email
        )

        return {
            idUser: admin.idAdmin,
            name: admin.name,
            email: admin.email,
            userType: 'ADMIN'
        }
    }

    async login(loginDto: LoginDto): Promise<LoginResponse> {
        const { email, password } = loginDto

        const user = await this.validateUser(email, password)

        const payload: JwtPayload = {
            idUser: user.idUser,
            name: user.name,
            email: user.email,
            userType: user.userType
        }

        const expiration = this.configService.get<string>('JWT_EXPIRATION')
        const signOptions: JwtSignOptions = {
            expiresIn: expiration as StringValue
        } 

        const token = this.jwtService.sign(payload, signOptions)

        return {
            message: 'Login realizado com sucesso',
            token,
            user
        }
    }

    async getProfile(userId: number, userType: UserType): Promise<ProfileResponse> {
        if (userType !== 'ADMIN') {
            throw new UnauthorizedException('Tipo de usuário inválido')
        }

        const admin = await this.adminService.findById(userId)
        if (!admin) {
            throw new UnauthorizedException('Usuário não encontrado')
        }

        return {
            message: 'Usuário autenticado com sucesso',
            user: {
                idUser: admin.idAdmin,
                name: admin.name,
                email: admin.email,
                userType
            }
        }
    }

    async checkEmailExists(email: string): Promise<{ exists: boolean; userType?: UserType }> {
        const admin = await this.adminService.findByEmail(email)
        if (admin) {
            return { exists: true, userType: 'ADMIN' }
        }

        return { exists: false }
    }
}