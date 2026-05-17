import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateImageDto {
    @IsString()
    imageUrl!: string;

    @IsString()
    altText!: string;

    @IsNumber()
    @Type(() => Number)
    sectionId!: number;
}