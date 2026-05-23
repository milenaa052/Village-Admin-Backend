import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Email inválido' })
    @IsNotEmpty({ message: 'Senha obrigatória'})
    email!: string;

    @IsNotEmpty({ message: 'Senha obrigatória'})
    password!: string;
}