import { IsOptional, IsArray, ValidateNested } from 'class-validator';
import { ContentType } from '../content.model';
import { SectionName } from '../section.model';

export class UpdateFullSectionDto {
    @IsOptional()
    section?: {
        name: SectionName;
        title: string;
        subtitle: string;
    };

    @IsOptional()
    @IsArray()
    contents?: {
        type: ContentType;
        content: string;
    }[];

    @IsOptional()
    @IsArray()
    cards?: {
        title: string;
        description: string;
        icon: string;
    }[];

    @IsOptional()
    @IsArray()
    stats?: {
        title: string;
        value: string;
    }[];

    @IsOptional()
    @IsArray()
    buttons?: {
        label: string;
        link: string;
    }[];

    @IsOptional()
    @IsArray()
    image?: {
        imageUrl: string;
        altText: string;
    }[];
}