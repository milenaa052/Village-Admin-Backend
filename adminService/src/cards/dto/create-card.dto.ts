import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateCardDto {
    @IsString()
    @IsNotEmpty({ message: 'Título é obrigatório' })
    title!: string

    @IsString()
    @IsNotEmpty({ message: 'Descrição é obrigatória' })
    description!: string

    @IsString()
    @IsNotEmpty({ message: 'Ícone é obrigatório' })
    icon!: string

    @Type(() => Number)
    @IsNumber()
    sectionId!: number
}
