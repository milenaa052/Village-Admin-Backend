import { IsNumber, IsString } from 'class-validator';
import { ContentType } from '../../contents/content.model';

export class ContentDto {
    @IsString()
    type!: ContentType;

    @IsString()
    content!: string;
}