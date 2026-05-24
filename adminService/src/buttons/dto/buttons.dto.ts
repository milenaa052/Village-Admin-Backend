import { IsNotEmpty, IsString, IsUrl } from 'class-validator'

export class ButtonDto {
    @IsString()
    @IsNotEmpty({
        message: 'Label é obrigatória'
    })
    label!: string

    @IsString()
    @IsNotEmpty({
        message: 'Link é obrigatório'
    })
    @IsUrl({}, {
        message: 'Link inválido'
    })
    link!: string
}

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