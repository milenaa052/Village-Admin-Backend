import { Controller, Get, Put, Delete, Req, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageDto } from './dto/image.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from '../auth/types/auth-request.interface';

@Controller('images')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findAll() {
        return this.imageService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.imageService.findById(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateImageDto: ImageDto,
        @Req() req: AuthRequest,
    ) {
        return this.imageService.update(id, updateImageDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async deleteById(@Param('id', ParseIntPipe) id: number) {
        return this.imageService.deleteById(id);
    }
}