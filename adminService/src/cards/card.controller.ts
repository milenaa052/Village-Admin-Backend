import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common'
import { CardService } from './card.service'
import { CardDto } from './dto/card.dto'
import { CreateCardDto } from './dto/create-card.dto'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard('jwt'))
@Controller('card')
export class CardController {
    constructor(private readonly cardService: CardService) {}

    @Post()
    async create(@Body() createCardDto: CreateCardDto) {
        return this.cardService.create(createCardDto)
    }

    @Get()
    async findAll() {
        return this.cardService.findAll()
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.cardService.findById(id)
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCardDto: CardDto,
    ) {
        return this.cardService.update(id, updateCardDto)
    }

    @Delete(':id')
    async deleteById(@Param('id', ParseIntPipe) id: number) {
        return this.cardService.deleteById(id)
    }
}
