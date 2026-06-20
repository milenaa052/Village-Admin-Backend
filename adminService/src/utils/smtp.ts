import nodemailer from 'nodemailer'
import { logger } from '../config/logger'

const EMAIL_SERVICE = process.env.EMAIL_SERVICE
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS

if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error(
        'EMAIL_USER ou EMAIL_PASS não configurados no .env'
    )
}

const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
})

transporter.verify((error, success) => {
    if (error) {
        logger.error('Erro ao conectar ao servidor SMTP:', error)
    } else {
        logger.info('Servidor SMTP conectado com sucesso')
    }
})

export const sendEmail = async (
    recipient: string,
    subject: string,
    message: string
): Promise<void> => {
    try {
        const info = await transporter.sendMail({
            from: `"Aldeia Viva" <${EMAIL_USER}>`,
            to: recipient,
            subject,
            text: message
        })

        logger.info(`Email enviado para ${recipient} - MessageId: ${info.messageId}`)
    } catch (error) {
        logger.error(`Erro ao enviar email para ${recipient}:`, error)
        throw error
    }
}