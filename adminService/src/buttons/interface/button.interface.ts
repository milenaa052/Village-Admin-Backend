export class ButtonResponseDto {
    idButton!: number
    label!: string
    link!: string
    sectionId!: number
    createdAt!: Date
    updatedAt!: Date
}

export interface ButtonCreationAttributes {
    label: string
    link: string
    sectionId: number
}