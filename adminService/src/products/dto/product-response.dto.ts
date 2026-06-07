export class ProductResponseDto {
    idProduct!: number
    name!: string
    description!: string
    price!: number
    size!: string | null
    imageUrl!: string
    categoryId!: number
    createdAt!: Date
    updatedAt!: Date
}