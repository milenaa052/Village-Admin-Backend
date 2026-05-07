import { IsString } from 'class-validator';

export class ImageDto {
    @IsString()
    imageUrl!: string;

    @IsString()
    altText!: string;
}