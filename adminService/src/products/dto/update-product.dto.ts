import { IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsNumber()
    @Min(0.01)
    price?: number

    @IsOptional()
    @IsString()
    size?: string

    @IsOptional()
    @IsString()
    imageUrl?: string

    @IsOptional()
    @IsNumber()
    categoryId?: number
}