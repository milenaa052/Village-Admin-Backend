import { IsEmail, IsOptional, IsString, MinLength, Matches } from 'class-validator'

export class UpdateAdminDto {
    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsString()
    phone?: string

    @IsOptional()
    @IsEmail({}, {
            message: 'Email inválido',
        }
    )
    email?: string

    @IsOptional()
    @IsString()
    currentPassword?: string

    @IsOptional()
    @IsString()
    @MinLength(8)
    @Matches(/[A-Z]/)
    @Matches(/[a-z]/)
    @Matches(/[0-9]/)
    newPassword?: string
}