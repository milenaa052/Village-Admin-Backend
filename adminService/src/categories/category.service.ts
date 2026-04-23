import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './category.model';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category)
        private readonly categoryModel: typeof Category
    ) {}

    async checkCategoryExists(email: string) {
        const category = await this.findByCategory(email);

        if (category) {
            return true;
        }
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const requiredFields: (keyof CreateCategoryDto)[] = ['name'];
        for (const field of requiredFields) {
            if (!createCategoryDto[field]) {
                throw new BadRequestException('Todos os campos são obrigatórios!');
            }
        }

        const categoryExists = await this.checkCategoryExists(createCategoryDto.name);
        if (categoryExists) {
            throw new ConflictException('Esta categoria já está cadastrada!');
        }

        try {
            const categoryData = {
                name: createCategoryDto.name,
            };

            const category = await this.categoryModel.create(categoryData);
            return category
        } catch (error) {
            throw new BadRequestException('Erro ao criar categoria!');
        }
    }

    async findAll() {
        return await this.categoryModel.findAll();
    }

    async findById(id: number) {
        const category = await this.categoryModel.findByPk(id);

        if (!category) throw new NotFoundException('Categoria não encontrada!');
        return category;
    }

    async findByCategory(name: string): Promise<Category | null> {
        return this.categoryModel.findOne({
            where: { name }
        });
    }

    async update(idCategory: number, updateCategoryDto: UpdateCategoryDto) {
        const category = await this.categoryModel.findByPk(idCategory);
        if (!category) {
            throw new NotFoundException('Categoria não encontrada!');
        }

        try {
            Object.assign(category, updateCategoryDto);
            await category.save();
            return category;
        } catch (error) {
            throw new BadRequestException('Erro ao atualizar a categoria!');
        }
    }

    async deleteById(id: number): Promise<{ message: string }> {
        const category = await this.categoryModel.findByPk(id);
        
        if (!category) {
            throw new NotFoundException('Categoria não encontrada!');
        }

        await category.destroy();
        return { message: 'Categoria deletada com sucesso!' };
    }
}