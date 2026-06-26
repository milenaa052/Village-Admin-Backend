import { IsOptional, IsArray } from 'class-validator'
import { ContentType } from '../../contents/interface/content.interface'
import { SectionName } from '../interface/section.interface'

export class UpdateFullSectionDto {
    @IsOptional()
    section?: {
        name: SectionName
        title: string
        subtitle: string
    }

    @IsOptional()
    @IsArray()
    contents?: {
        type: ContentType
        content: string
    }[]

    @IsOptional()
    @IsArray()
    cards?: {
        title: string
        description: string
        icon: string
    }[]

    @IsOptional()
    @IsArray()
    stats?: {
        title: string
        value: string
    }[]

    @IsOptional()
    @IsArray()
    buttons?: {
        label: string
        link: string
    }[]
}