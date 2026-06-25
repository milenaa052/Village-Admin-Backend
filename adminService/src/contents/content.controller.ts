import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common'
import { ContentService } from './content.service'
import { ContentDto } from './dto/content.dto'
import { CreateContentDto } from './dto/create-content.dto'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard('jwt'))
@Controller('content')
export class ContentController {
    constructor(private readonly contentService: ContentService) {}

    @Post()
    async create(@Body() createContentDto: CreateContentDto) {
        return this.contentService.create(createContentDto)
    }

    @Get()
    async findAll() {
        return this.contentService.findAll()
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.contentService.findById(id)
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateContentDto: ContentDto,
    ) {
        return this.contentService.update(id, updateContentDto)
    }

    @Delete(':id')
    async deleteById(@Param('id', ParseIntPipe) id: number) {
        return this.contentService.deleteById(id)
    }
}
