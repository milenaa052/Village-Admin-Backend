import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Card } from './card.model'
import { CardDto } from './dto/card.dto'
import { CreateCardDto } from './dto/create-card.dto'
import { SectionValidatorService } from '../sections/rules/section-validator.service'

@Injectable()
export class CardService {
    constructor(
        @InjectModel(Card) private readonly cardModel: typeof Card,
        private readonly sectionValidator: SectionValidatorService,
    ) {}

    async create(dto: CreateCardDto): Promise<Card> {
        await this.sectionValidator.validateCardCreate(dto.sectionId)
        try {
            return await this.cardModel.create({
                title: dto.title,
                description: dto.description,
                icon: dto.icon,
                sectionId: dto.sectionId
            })
        } catch {
            throw new BadRequestException('Erro ao criar card')
        }
    }

    async findAll() {
        return this.cardModel.findAll()
    }

    async findById(id: number) {
        const card = await this.cardModel.findByPk(id)
        if (!card) throw new NotFoundException('Card não encontrado')
        return card
    }

    async update(idCard: number, dto: CardDto) {
        const card = await this.cardModel.findByPk(idCard)
        if (!card) throw new NotFoundException('Card não encontrado')
        card.title       = dto.title       ?? card.title
        card.description = dto.description ?? card.description
        card.icon        = dto.icon        ?? card.icon
        try {
            await card.save()
            return card
        } catch {
            throw new BadRequestException('Erro ao atualizar o card')
        }
    }

    async deleteById(id: number): Promise<{ message: string }> {
        const card = await this.cardModel.findByPk(id)
        if (!card) throw new NotFoundException('Card não encontrado')
        await this.sectionValidator.validateCardDelete(card.sectionId)
        await card.destroy()
        return { message: 'Card deletado com sucesso' }
    }
}
