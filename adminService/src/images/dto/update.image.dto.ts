import { IsOptional, IsString } from 'class-validator';

export class UpdateImageDto {
    @IsOptional()
    @IsString()
    altText?: string;
}