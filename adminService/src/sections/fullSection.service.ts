import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Section } from './section.model';
import { CreateFullSectionDto } from './dto/create-full-section.dto';
import { Sequelize } from 'sequelize-typescript';
import { Content } from '../contents/content.model';
import { Card } from '../cards/card.model';
import { Stats } from '../stats/stats.model';
import { Button } from '../buttons/buttons.model';

@Injectable()
export class FullSectionService {
    constructor(
        @InjectModel(Section) private readonly sectionModel: typeof Section,
        @InjectModel(Content) private readonly contentModel: typeof Content,
        @InjectModel(Card) private readonly cardModel: typeof Card,
        @InjectModel(Stats) private readonly statsModel: typeof Stats,
        @InjectModel(Button) private readonly buttonsModel: typeof Button,
        private readonly sequelize: Sequelize,
    ) {}

    async createFullSection(dto: CreateFullSectionDto) {
        const transaction = await this.sequelize.transaction();

        try {
            const { section, contents, cards, stats, buttons } = dto;
            const newSection = await this.sectionModel.create(section, { transaction });
            const sectionId = newSection.idSection;

            if (contents?.length) {
            const contentData = contents.map(item => ({
                sectionId: sectionId,
                type: item.type,
                content: item.content
            }));
                await this.contentModel.bulkCreate(contentData, {
                    transaction,
                    fields: ['sectionId', 'type', 'content']
                });
            }

            if (cards?.length) {
            const cardData = cards.map(card => ({
                sectionId: sectionId,
                ...card
            }));
                await this.cardModel.bulkCreate(cardData, {
                    transaction,
                    fields: ['sectionId', 'title', 'description', 'icon']
                });
            }

            if (stats?.length) {
            const statData = stats.map(stat => ({
                sectionId: sectionId,
                ...stat
            }));
                await this.statsModel.bulkCreate(statData, {
                    transaction,
                    fields: ['sectionId', 'title', 'value']
                });
            }

            if (buttons?.length) {
            const buttonsData = buttons.map(buttons => ({
                sectionId: sectionId,
                ...buttons
            }));
                await this.buttonsModel.bulkCreate(buttonsData, {
                    transaction,
                    fields: ['sectionId', 'label', 'link']
                });
            }

            await transaction.commit();

            return {
                message: 'Seção completa criada com sucesso!',
                section: newSection
            };

        } catch (error) {
            await transaction.rollback();
            console.error(error);
            throw new BadRequestException('Erro ao criar seção completa');
        }
    }

    async findAll() {
        return await this.sectionModel.findAll({
            include: [
                { model: Content },
                { model: Card },
                { model: Stats },
                { model: Button }
            ]
        });
    }

    async findById(id: number) {
        const section = await this.sectionModel.findByPk(id, {
            include: [
                { model: Content },
                { model: Card },
                { model: Stats },
                { model: Button }
            ]
        });

        if (!section) throw new NotFoundException('Seção não encontrada!');
        return section;
    }
}