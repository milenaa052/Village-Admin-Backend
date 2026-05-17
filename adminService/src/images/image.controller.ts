import { Controller, Get, Post, Put, Delete, Param, Body, UploadedFile, UseGuards, ParseIntPipe, UploadedFiles, UseInterceptors, HttpCode } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multerOptions from './config/multer.config';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update.image.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from './guards/admin.guard';

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

    @Post()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @UseInterceptors(
        FileInterceptor('file', multerOptions),
    )
    async create(
        @Body() createImageDto: CreateImageDto,

        @UploadedFile()
        file: Express.Multer.File,
    ) {
        return this.imageService.create(
            createImageDto,
            file,
        );
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    async update(
        @Param('id', ParseIntPipe) id: number,

        @Body()
        updateImageDto: UpdateImageDto,
    ) {
        return this.imageService.update(
            id,
            updateImageDto,
        );
    }

    @Put(':id/upload')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @UseInterceptors(
        FileInterceptor('file', multerOptions),
    )
    async updateImage(
        @Param('id', ParseIntPipe) id: number,

        @UploadedFile()
        file: Express.Multer.File,
    ) {
        return this.imageService.updateImage(
            id,
            file,
        );
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    async deleteById(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.imageService.deleteById(id);
    }
}