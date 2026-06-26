import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Admin } from './admin.model'
import { CacheService } from '../utils/cache.service'
import { sendEmail } from '../utils/smtp'
import { logger } from '../config/logger'
import { randomUUID } from 'crypto'

const INVITE_NAMESPACE = 'invite'
const INVITE_TTL_SECONDS = 60 * 60 * 24 // 24 horas

@Injectable()
export class AdminInviteService {
    constructor(
        @InjectModel(Admin)
        private readonly adminModel: typeof Admin,
        private readonly cacheService: CacheService
    ) {}

    async sendInvite(inviterName: string, email: string): Promise<void> {
        const existing = await this.adminModel.findOne({ where: { email } })
        if (existing) {
            throw new ConflictException('Este email já possui uma conta cadastrada')
        }

        const token = randomUUID()
        const cacheKey = `token:${token}`

        // Salva o e-mail vinculado ao token no Redis por 24h
        await this.cacheService.store(cacheKey, email, {
            ttl: INVITE_TTL_SECONDS,
            namespace: INVITE_NAMESPACE
        })

        const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173'
        const inviteLink = `${frontendUrl}/admin/cadastro?token=${token}`

        await sendEmail(
            email,
            'Convite para Área Administrativa — Aldeia Cultura Viva',
            `Olá!\n\n${inviterName} convidou você para acessar a área administrativa da Aldeia Cultura Viva.\n\nClique no link abaixo para criar sua conta:\n${inviteLink}\n\nEste link é válido por 24 horas e pode ser usado apenas uma vez.\n\nSe você não esperava este convite, ignore este e-mail.`
        ).catch((error) => logger.error('Erro ao enviar e-mail de convite:', error))

        logger.info(`Convite enviado para ${email} por ${inviterName}`)
    }

    async validateToken(token: string): Promise<string> {
        const cacheKey = `token:${token}`
        const email = await this.cacheService.search(cacheKey, INVITE_NAMESPACE)

        if (!email) {
            throw new BadRequestException('Token de convite inválido ou expirado')
        }

        return email
    }

    async consumeToken(token: string): Promise<void> {
        const cacheKey = `token:${token}`
        await this.cacheService.invalidate(cacheKey, INVITE_NAMESPACE)
    }
}
