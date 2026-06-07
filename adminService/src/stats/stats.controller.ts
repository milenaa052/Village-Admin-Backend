import { Controller, Get, Put, Delete, Req, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common'
import { StatsService } from './stats.service'
import { StatsDto } from './dto/stats.dto'
import { AuthGuard } from '@nestjs/passport'
import { AuthRequest } from '../auth/interface/auth-request.interface'

@UseGuards(AuthGuard('jwt'))
@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) {}

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
        @Req() req: AuthRequest
    ) {
        return this.statsService.update(id, updateStatsDto)
    }

    @Delete(':id')
    async deleteById(@Param('id', ParseIntPipe) id: number) {
        return this.statsService.deleteById(id)
    }
}