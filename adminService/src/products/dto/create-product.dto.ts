import { IsNotEmpty, IsNumber, IsOptional, IsString, Min} from 'class-validator'

export class CreateProductDto {
    @IsString()
    @IsNotEmpty({
        message: 'Nome é obrigatório'
    })
    name!: string

    @IsString()
    @IsNotEmpty({
        message: 'Descrição é obrigatória'
    })
    description!: string

    @IsNumber()
    @Min(0.01, {
        message: 'Preço deve ser maior que zero'
    })
    price!: number

    @IsOptional()
    @IsString()
    size?: string

    @IsString()
    @IsNotEmpty({
        message: 'Imagem é obrigatória'
    })
    imageUrl!: string

    @IsNumber()
    categoryId!: number
}