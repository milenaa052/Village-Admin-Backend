import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { Admin } from "./admin.model"
import { logger } from "../config/logger"
import { sendEmail } from "../utils/smtp"
import { InjectModel } from "@nestjs/sequelize"
import { ResetPasswordDto } from "./dto/reset-pass.dto"
import { PasswordValidator } from "./password.validator"
import { CacheService } from "../utils/cache.service"

@Injectable()
export class AdminRecoverPassService {
    constructor(
        @InjectModel(Admin)
        private readonly adminModel: typeof Admin,
        private readonly cacheService: CacheService
    ) {}

    async recoverPassword(email: string): Promise<void> {
        const admin = await  this.adminModel.findOne({ where: { email } })

        if (!admin) {
            throw new NotFoundException('Administrador não encontrado')
        }

        const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString()
        await this.cacheService.store(`reset:${email}`, recoveryCode, { ttl: 900, namespace: "usuarios" })

        await sendEmail(
            email,
            "Recuperação de Senha - Aldeia Viva",
            `Olá ${admin.name},\n\nVocê solicitou a recuperação da sua senha.\n\nSeu código de verificação é: ${recoveryCode}\n\nEste código é válido por apenas 15 minutos.\n\nSe você não solicitou isso, ignore este e-mail.`
        ).catch((error) => logger.error("Error sending recovery email:", error))

        logger.info(`Código de recuperação gerado e enviado por e-mail: ${email}`)
    }

    async resetPassword(dto: ResetPasswordDto): Promise<void> {
        const { email, recoveryCode, newPassword } = dto

        const passwordValidation = PasswordValidator.validatePasswordLevel(
            newPassword
        )

        if (!passwordValidation.validate) {
            throw new BadRequestException({
                message: 'Senha muito fraca',
                requirements: passwordValidation.requirements
            })
        }

        const savedCode = await this.cacheService.search(`reset:${email}`, "usuarios")
        if (!savedCode || savedCode !== recoveryCode) {
            throw new BadRequestException("Código de recuperação inválido ou expirado")
        }

        const admin = await  this.adminModel.findOne({ where: { email } })
        if (!admin) {
            throw new NotFoundException("Administrador não encontrado")
        }

        await admin.update({ password: newPassword })

        await this.cacheService.invalidate(`reset:${email}`, "usuarios")
        await this.cacheService.invalidate("todos", "usuarios")
        await this.cacheService.invalidate(`id:${admin.id}`, "usuarios")

        sendEmail(
            email,
            "Senha Alterada com Sucesso - Aldeia Viva",
            `Olá ${admin.name},\n\nSua senha foi alterada com sucesso em nosso sistema.`
        ).catch((error) => logger.error("Erro ao enviar aviso de alteração de senha:", error))

        logger.info(`Senha redefinida com sucesso para: ${email}`)
    }
}