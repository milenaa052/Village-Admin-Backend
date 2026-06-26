import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateStatsDto {
    @IsString()
    @IsNotEmpty({ message: 'Título é obrigatório' })
    title!: string

    @IsString()
    @IsNotEmpty({ message: 'Valor é obrigatório' })
    value!: string

    @Type(() => Number)
    @IsNumber()
    sectionId!: number
}
