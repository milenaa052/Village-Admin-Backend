import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Card } from './card.model';
import { CardDto } from './dto/card.dto';

@Injectable()
export class CardService {
    constructor(
        @InjectModel(Card) private readonly cardModel: typeof Card,
    ) {}

    async findAll() {
        return await this.cardModel.findAll();
    }

    async findById(id: number) {
        const card = await this.cardModel.findByPk(id);

        if (!card) throw new NotFoundException('Card não encontrado!');
        return card;
    }

    async update(idCard: number, cardDto: CardDto) {
        const card = await this.cardModel.findByPk(idCard);
        if (!card) {
            throw new NotFoundException('Card não encontrado!');
        }

        try {
            Object.assign(card, cardDto);
            await card.save();
            return card;
        } catch (error) {
            throw new BadRequestException('Erro ao atualizar o card!');
        }
    }

    async deleteById(id: number): Promise<{ message: string }> {
        const card = await this.cardModel.findByPk(id);
        
        if (!card) {
            throw new NotFoundException('Card não encontrado!');
        }

        await card.destroy();
        return { message: 'Card deletado com sucesso!' };
    }
}