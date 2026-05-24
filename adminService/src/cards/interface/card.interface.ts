export interface CardCreationAttributes {
    title: string
    description: string
    icon: string
    sectionId: number
}

export class CardResponseDto {
    idCard!: number
    title!: string
    description!: string
    icon!: string
    createdAt!: Date
    updatedAt!: Date
}