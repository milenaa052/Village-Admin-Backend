import { Controller, Get, Put, Delete, Req, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ButtonService } from './button.service';
import { ButtonDto } from './dto/buttons.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from '../auth/types/auth-request.interface';

@Controller('button')
export class ButtonController {
    constructor(private readonly buttonService: ButtonService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findAll() {
        return this.buttonService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.buttonService.findById(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateButtonDto: ButtonDto,
        @Req() req: AuthRequest,
    ) {
        return this.buttonService.update(id, updateButtonDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async deleteById(@Param('id', ParseIntPipe) id: number) {
        return this.buttonService.deleteById(id);
    }
}