import { Controller, Get, Put, Delete, Req, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common'
import { ContentService } from './content.service'
import { ContentDto } from './dto/content.dto'
import { AuthGuard } from '@nestjs/passport'
import { AuthRequest } from '../auth/interface/auth-request.interface'

@UseGuards(AuthGuard('jwt'))
@Controller('content')
export class ContentController {
    constructor(private readonly contentService: ContentService) {}

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
        @Req() req: AuthRequest,
    ) {
        return this.contentService.update(id, updateContentDto)
    }

    @Delete(':id')
    async deleteById(@Param('id', ParseIntPipe) id: number) {
        return this.contentService.deleteById(id)
    }
}