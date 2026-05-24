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