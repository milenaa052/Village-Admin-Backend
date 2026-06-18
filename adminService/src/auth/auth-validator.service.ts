import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AdminService } from '../admin/admin.service'
import { AuthenticatedUser } from './interface/jwt-payload.interface'
import { logLoginFailed, logLoginSuccess } from '../middleware/login-logger.middleware'

@Injectable()
export class AuthValidatorService {

    constructor(
        private readonly adminService: AdminService
    ) {}

    async validateUser(email: string, password: string): Promise<AuthenticatedUser> {

        const admin =
            await this.adminService.findByEmail(email)

        if (!admin) {
            logLoginFailed(email)

            throw new UnauthorizedException(
                'Credenciais inválidas'
            )
        }

        const validPassword =
            await admin.comparePassword(password)

        if (!validPassword) {
            logLoginFailed(email)

            throw new UnauthorizedException(
                'Credenciais inválidas'
            )
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
}