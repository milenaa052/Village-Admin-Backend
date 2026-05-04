import { Controller, Post, Get, Put, Delete, Req, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { FullSectionService } from './fullSection.service';
import { CreateFullSectionDto } from './dto/create-full-section.dto';
import { UpdateFullSectionDto } from './dto/update-full-section.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from '../auth/types/auth-request.interface';

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

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateFullSectionDto: UpdateFullSectionDto,
        @Req() req: AuthRequest,
    ) {
        return this.fullSectionService.updateFullSection(id, updateFullSectionDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async deleteById(@Param('id', ParseIntPipe) id: number) {
        return this.fullSectionService.deleteById(id);
    }
}