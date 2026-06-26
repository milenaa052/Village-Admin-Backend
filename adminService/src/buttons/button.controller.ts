import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common'
import { ButtonService } from './button.service'
import { ButtonDto } from './dto/buttons.dto'
import { CreateButtonDto } from './dto/create-button.dto'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard('jwt'))
@Controller('button')
export class ButtonController {
    constructor(private readonly buttonService: ButtonService) {}

    @Post()
    async create(@Body() createButtonDto: CreateButtonDto) {
        return this.buttonService.create(createButtonDto)
    }

    @Get()
    async findAll() {
        return this.buttonService.findAll()
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.buttonService.findById(id)
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateButtonDto: ButtonDto,
    ) {
        return this.buttonService.update(id, updateButtonDto)
    }

    @Delete(':id')
    async deleteById(@Param('id', ParseIntPipe) id: number) {
        return this.buttonService.deleteById(id)
    }
}
