import { IsNotEmpty, IsString } from 'class-validator'

export class CardDto {
    @IsString()
    @IsNotEmpty({
        message: 'Título é obrigatório'
    })
    title!: string

    @IsString()
    @IsNotEmpty({
        message: 'Descrição é obrigatória'
    })
    description!: string

    @IsString()
    @IsNotEmpty({
        message: 'Ícone é obrigatório'
    })
    icon!: string
}