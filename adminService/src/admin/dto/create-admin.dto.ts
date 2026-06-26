import { IsEmail, IsString, IsNotEmpty, MinLength, Matches } from 'class-validator'

export class CreateAdminDto {
    @IsNotEmpty({ message: 'Nome é obrigatório' })
    @IsString()
    name!: string

    @IsNotEmpty({ message: 'Email é obrigatório' })
    @IsEmail({}, { message: 'Email inválido' })
    email!: string

    @IsNotEmpty({ message: 'Senha é obrigatória' })
    @IsString()
    @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
    @Matches(/[A-Z]/, { message: 'A senha deve possuir letra maiúscula' })
    @Matches(/[a-z]/, { message: 'A senha deve possuir letra minúscula' })
    @Matches(/[0-9]/, { message: 'A senha deve possuir número' })
    password!: string

    @IsNotEmpty({ message: 'Telefone é obrigatório' })
    @IsString()
    phone!: string

    @IsNotEmpty({ message: 'Token de convite é obrigatório' })
    @IsString()
    inviteToken!: string
}
