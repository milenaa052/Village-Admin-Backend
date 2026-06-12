import { logger } from '../config/logger'

export function logUpload(
    filename: string,
    path: string,
    adminId?: number
) {
    logger.info('File uploaded', {
        type: 'upload',
        action: 'UPLOAD',
        filename,
        path,
        adminId
    })
}