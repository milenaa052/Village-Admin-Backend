import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty({ message: 'Nome é obrigatório' })
    @IsString()
    name!: string;
}