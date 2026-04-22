import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateAdminDto {
    @IsOptional() @IsString() name?: string;
    @IsOptional() @IsString() phone?: string;
    @IsOptional() @IsEmail({}, { message: 'Email inválido' }) email?: string;

    @IsOptional() @IsString() currentPassword?: string;
    @IsOptional() @IsString() newPassword?: string;
}