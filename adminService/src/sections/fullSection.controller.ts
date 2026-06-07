import { Controller, Post, Get, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common'
import { FullSectionService } from './fullSection.service'
import { CreateFullSectionDto } from './dto/create-full-section.dto'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard('jwt'))
@Controller('full/section')
export class FullSectionController {
    constructor(private readonly fullSectionService: FullSectionService) {}

    @Post()
    async create(@Body() createFullSectionDto: CreateFullSectionDto) {
        return this.fullSectionService.createFullSection(createFullSectionDto)
    }

    @Get()
    async findAll() {
        return this.fullSectionService.findAll()
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.fullSectionService.findById(id)
    }
}