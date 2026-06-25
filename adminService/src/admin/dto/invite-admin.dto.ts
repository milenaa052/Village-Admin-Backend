import { IsEmail, IsNotEmpty } from 'class-validator'

export class InviteAdminDto {
    @IsNotEmpty({ message: 'Email é obrigatório' })
    @IsEmail({}, { message: 'Email inválido' })
    email!: string
}
