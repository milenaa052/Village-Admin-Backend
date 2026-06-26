import { IsString, IsNotEmpty } from 'class-validator'

export class StatsDto {
    @IsString()
    @IsNotEmpty({
        message: 'Título é obrigatório'
    })
    title!: string

    @IsString()
    @IsNotEmpty({
        message: 'Valor é obrigatório'
    })
    value!: string
}