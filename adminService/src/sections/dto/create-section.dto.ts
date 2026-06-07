import { IsString, IsNotEmpty } from 'class-validator'
import { SectionName } from '../interface/section.interface'

export class CreateSectionDto {
    @IsString()
    @IsNotEmpty({ 
        message: 'Nome da seção é obrigatório' 
    })
    name!: SectionName

    @IsString()
    @IsNotEmpty({ 
        message: 'Título é obrigatório' 
    })
    title!: string

    @IsString()
    @IsNotEmpty({ 
        message: 'Subtítulo é obrigatório' 
    })
    subtitle!: string
}