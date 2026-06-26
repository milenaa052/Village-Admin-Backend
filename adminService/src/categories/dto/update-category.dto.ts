import { IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    @MinLength(3, {
        message: 'Nome deve possuir no mínimo 3 caracteres'
    })
    name?: string
}