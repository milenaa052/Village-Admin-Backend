import { Controller, Get, Put, Delete, Req, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CardService } from './card.service';
import { CardDto } from './dto/card.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from '../auth/types/auth-request.interface';

@Controller('card')
export class CardController {
    constructor(private readonly cardService: CardService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findAll() {
        return this.cardService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.cardService.findById(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCardDto: CardDto,
        @Req() req: AuthRequest,
    ) {
        return this.cardService.update(id, updateCardDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async deleteById(@Param('id', ParseIntPipe) id: number) {
        return this.cardService.deleteById(id);
    }
}