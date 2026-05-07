import { Controller, Post, Get, Put, Delete, Req, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from '../auth/types/auth-request.interface';

@Controller('section')
export class SectionController {
    constructor(private readonly sectionService: SectionService) {}

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(@Body() createSectionDto: CreateSectionDto) {
        return this.sectionService.create(createSectionDto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findAll() {
        return this.sectionService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.sectionService.findById(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateSectionDto: UpdateSectionDto,
        @Req() req: AuthRequest,
    ) {
        return this.sectionService.update(id, updateSectionDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async deleteById(@Param('id', ParseIntPipe) id: number) {
        return this.sectionService.deleteById(id);
    }
}