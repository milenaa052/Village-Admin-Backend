import { IsOptional, IsString } from 'class-validator';

export class UpdateSectionDto {
    @IsString() name?: string;
    @IsOptional() @IsString() title?: string;
    @IsOptional() @IsString() subtitle?: string;
}