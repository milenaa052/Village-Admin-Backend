import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CreateAdminDto {
    @IsNotEmpty({ message: 'Nome é obrigatório' })
    @IsString()
    name!: string;

    @IsNotEmpty({ message: 'Email é obrigatório' })
    @IsEmail({}, { message: 'Email inválido' })
    email!: string;

    @IsNotEmpty({ message: 'Senha é obrigatória' })
    @IsString()
    password!: string;
}