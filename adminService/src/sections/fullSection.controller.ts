import { Controller, Post, Get, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { FullSectionService } from './fullSection.service';
import { CreateFullSectionDto } from './dto/create-full-section.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('full/section')
export class FullSectionController {
    constructor(private readonly fullSectionService: FullSectionService) {}

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(@Body() createFullSectionDto: CreateFullSectionDto) {
        return this.fullSectionService.createFullSection(createFullSectionDto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findAll() {
        return this.fullSectionService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.fullSectionService.findById(id);
    }
}