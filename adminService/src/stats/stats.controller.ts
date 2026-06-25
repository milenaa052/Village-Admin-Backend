import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common'
import { StatsService } from './stats.service'
import { StatsDto } from './dto/stats.dto'
import { CreateStatsDto } from './dto/create-stats.dto'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard('jwt'))
@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) {}

    @Post()
    async create(@Body() createStatsDto: CreateStatsDto) {
        return this.statsService.create(createStatsDto)
    }

    @Get()
    async findAll() {
        return this.statsService.findAll()
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.statsService.findById(id)
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateStatsDto: StatsDto,
    ) {
        return this.statsService.update(id, updateStatsDto)
    }

    @Delete(':id')
    async deleteById(@Param('id', ParseIntPipe) id: number) {
        return this.statsService.deleteById(id)
    }
}
