import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Op } from 'sequelize';
import { Category } from '../categories/category.model';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product) private readonly productModel: typeof Product,
        @InjectModel(Category) private readonly categoryModel: typeof Category
    ) {}

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const requiredFields: (keyof CreateProductDto)[] = ['name', 'description', 'price', 'imageUrl', 'categoryId'];
        for (const field of requiredFields) {
            if (!createProductDto[field]) {
                throw new BadRequestException(`O campo ${field} é obrigatório!`);
            }
        }

        const category = await this.categoryModel.findByPk(createProductDto.categoryId);
        if(!category) {
            throw new NotFoundException('Categoria não encontrada!');
        }

        try {
            const productData = {
                name: createProductDto.name,
                description: createProductDto.description,
                price: createProductDto.price,
                size: createProductDto.size,
                imageUrl: createProductDto.imageUrl,
                categoryId: createProductDto.categoryId
            };

            const product = await this.productModel.create(productData);
            return product
        } catch (error) {
            throw new BadRequestException('Erro ao criar produto!');
        }
    }

    async findAll() {
        return await this.productModel.findAll();
    }

    async findById(id: number) {
        const product = await this.productModel.findByPk(id);

        if (!product) throw new NotFoundException('Produto não encontrado!');
        return product;
    }

    async findByProduct(name: string) {
        return this.productModel.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`,
                },
            },
        });
    }

    async update(idProduct: number, updateProductDto: UpdateProductDto) {
        const product = await this.productModel.findByPk(idProduct);
        if (!product) {
            throw new NotFoundException('Produto não encontrado!');
        }

        try {
            Object.assign(product, updateProductDto);
            await product.save();
            return product;
        } catch (error) {
            throw new BadRequestException('Erro ao atualizar o produto!');
        }
    }

    async deleteById(id: number): Promise<{ message: string }> {
        const product = await this.productModel.findByPk(id);
        
        if (!product) {
            throw new NotFoundException('Produto não encontrado!');
        }

        await product.destroy();
        return { message: 'Produto deletado com sucesso!' };
    }
}