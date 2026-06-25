import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateButtonDto {
    @IsString()
    @IsNotEmpty({ message: 'Label é obrigatória' })
    label!: string

    @IsString()
    @IsNotEmpty({ message: 'Link é obrigatório' })
    @IsUrl({}, { message: 'Link inválido' })
    link!: string

    @Type(() => Number)
    @IsNumber()
    sectionId!: number
}
