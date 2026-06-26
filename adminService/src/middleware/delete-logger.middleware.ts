import { logger } from '../config/logger'

export function logDelete(
    productId: number,
    name: string,
    categoryId?: number
) {
    logger.warn('Entity deleted', {
        type: 'delete',
        action: 'DELETE',
        productId,
        name,
        categoryId
    })
}