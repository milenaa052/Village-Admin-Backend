import { IsString } from 'class-validator';
import { ContentType } from '../content.model';

export class ContentDto {
    @IsString()
    type!: ContentType;

    @IsString()
    content!: string;
}