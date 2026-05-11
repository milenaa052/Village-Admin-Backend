import { IsOptional, IsString } from 'class-validator';

export class UpdateImageDto {
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsString()
    altText?: string;
}