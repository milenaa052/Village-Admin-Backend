import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty({
        message: 'Nome é obrigatório'
    })
    @MinLength(3, {
        message: 'Nome deve possuir no mínimo 3 caracteres'
    })
    name!: string
}