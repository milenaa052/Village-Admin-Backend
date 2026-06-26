import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateImageDto {
    @IsString()
    @IsNotEmpty({
        message: 'Texto alternativo é obrigatório'
    })
    altText!: string

    @Type(() => Number)
    @IsNumber()
    sectionId!: number
}