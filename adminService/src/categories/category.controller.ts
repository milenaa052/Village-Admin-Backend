import { Controller, Post, Get, Put, Delete, Req, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { AuthGuard } from '@nestjs/passport'
import { AuthRequest } from '../auth/interface/auth-request.interface'

@UseGuards(AuthGuard('jwt'))
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto)
    }

    @Get()
    async findAll() {
        return this.categoryService.findAll()
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.findById(id)
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCategoryDto: UpdateCategoryDto,
        @Req() req: AuthRequest,
    ) {
        return this.categoryService.update(id, updateCategoryDto)
    }

    @Delete(':id')
    async deleteById(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.deleteById(id)
    }
}