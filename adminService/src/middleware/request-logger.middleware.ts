import { Request, Response, NextFunction } from 'express'
import { logger } from '../config/logger'

export function RequestLoggerMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const start = Date.now()

    res.on('finish', () => {
        logger.info('HTTP Request', {
            type: 'request',
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            ip: req.ip,
            userAgent: req.get('user-agent'),
            duration: `${Date.now() - start}ms`
        })
    })

    next()
}