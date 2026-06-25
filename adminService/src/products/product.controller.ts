import { Controller, Post, Get, Put, Delete, Req, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common'
import { ProductService } from './product.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { AuthGuard } from '@nestjs/passport'
import { AuthRequest } from '../auth/interface/auth-request.interface'

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto)
    }

    @Get()
    async findAll() {
        return this.productService.findAll()
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.productService.findById(id)
    }

    @Get('search/:name')
    async findByProduct(@Param('name') name: string) {
        return this.productService.findByProduct(name)
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
        @Req() req: AuthRequest
    ) {
        return this.productService.update(id, updateProductDto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async deleteById(@Param('id', ParseIntPipe) id: number) {
        return this.productService.deleteById(id)
    }
}