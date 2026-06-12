import { logger } from '../config/logger'

export function logProductCreated(
    productId: number,
    name: string,
    categoryId?: number
) {
    logger.info('Product created', {
        type: 'product',
        action: 'CREATE',
        productId,
        name,
        categoryId
    })
}