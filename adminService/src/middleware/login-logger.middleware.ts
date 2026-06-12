import { logger } from '../config/logger'

export function logLoginSuccess(
    userId: number,
    email: string
) {
    logger.info('Login successful', {
        type: 'login',
        userId,
        email,
        action: 'LOGIN_SUCCESS'
    })
}

export function logLoginFailed(
    email: string
) {
    logger.warn('Login failed', {
        type: 'login',
        email,
        action: 'LOGIN_FAILED'
    })
}