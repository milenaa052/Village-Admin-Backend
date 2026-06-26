import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { SectionName } from '../interface/section.interface'
import { getRules } from '../rules/section.rules'

export class CreateSectionDto {
    @IsEnum(SectionName, { message: 'Nome de seção inválido' })
    name!: SectionName

    @IsString()
    @IsOptional()
    title?: string

    @IsString()
    @IsOptional()
    subtitle?: string
}
