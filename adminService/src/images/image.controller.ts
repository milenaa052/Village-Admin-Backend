import { Controller, Get, Post, Patch, Delete, Param, Body, UploadedFile, UseGuards, ParseIntPipe, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import multerOptions from './config/multer.config'
import { ImageService } from './image.service'
import { CreateImageDto } from './dto/create-image.dto'
import { UpdateImageDto } from './dto/update.image.dto'
import { AuthGuard } from '@nestjs/passport'
import { AdminGuard } from './guards/admin.guard'

@UseGuards(AuthGuard('jwt'))
@Controller('images')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Get()
    async findAll() {
        return this.imageService.findAll()
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.imageService.findById(id)
    }

    @Post()
    @UseGuards(AdminGuard)
    @UseInterceptors(
        FileInterceptor('file', multerOptions)
    )
    async create(
        @Body() createImageDto: CreateImageDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.imageService.create(
            createImageDto,
            file
        )
    }

    @Patch(':id')
    @UseGuards(AdminGuard)
    @UseInterceptors(
        FileInterceptor('file', multerOptions)
    )
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateImageDto: UpdateImageDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.imageService.update(
            id,
            updateImageDto,
            file
        )
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    async deleteById(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.imageService.deleteById(id)
    }
}