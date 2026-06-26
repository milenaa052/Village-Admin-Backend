import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { ContentType } from '../interface/content.interface'

export class ContentDto {
    @IsEnum(ContentType, {
        message: 'Tipo de conteúdo inválido'
    })
    type!: ContentType

    @IsString()
    @IsNotEmpty({
        message: 'Conteúdo é obrigatório'
    })
    content!: string
}