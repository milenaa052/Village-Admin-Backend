import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty({ message: 'Nome é obrigatório' })
    @IsString()
    name!: string;

    @IsNotEmpty({ message: 'Descrição é obrigatório' })
    @IsString()
    description!: string;

    @IsNotEmpty({ message: 'Preço é obrigatório' })
    @IsNumber()
    price!: number;

    @IsString()
    size!: string;

    @IsNotEmpty({ message: 'Imagem é obrigatório' })
    @IsString()
    imageUrl!: string;

    @IsNotEmpty({ message: 'Preço é obrigatório' })
    @IsNumber()
    categoryId!: number;
}