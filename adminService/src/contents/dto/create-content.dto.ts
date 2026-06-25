import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { Type } from 'class-transformer'
import { ContentType } from '../interface/content.interface'

export class CreateContentDto {
    @IsEnum(ContentType, { message: 'Tipo de conteúdo inválido' })
    type!: ContentType

    @IsString()
    @IsNotEmpty({ message: 'Conteúdo é obrigatório' })
    content!: string

    @Type(() => Number)
    @IsNumber()
    sectionId!: number
}
