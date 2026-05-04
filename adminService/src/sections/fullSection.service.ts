import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Section } from './section.model';
import { CreateFullSectionDto } from './dto/create-full-section.dto';
import { Sequelize } from 'sequelize-typescript';
import { Content } from './content.model';
import { Card } from './card.model';
import { Number } from './numbers.model';
import { Button } from './buttons.model';
import { Image } from './images.model';

@Injectable()
export class FullSectionService {
    constructor(
        @InjectModel(Section) private readonly sectionModel: typeof Section,
        @InjectModel(Content) private readonly contentModel: typeof Content,
        @InjectModel(Card) private readonly cardModel: typeof Card,
        @InjectModel(Number) private readonly numbersModel: typeof Number,
        @InjectModel(Button) private readonly buttonsModel: typeof Button,
        @InjectModel(Image) private readonly imageModel: typeof Image,
        private readonly sequelize: Sequelize,
    ) {}

    async createFullSection(dto: CreateFullSectionDto) {
        const transaction = await this.sequelize.transaction();

        try {
            const { section, contents, cards, numbers, buttons, image } = dto;
            const newSection = await this.sectionModel.create(section, { transaction });
            const sectionId = newSection.id;

            if (contents?.length) {
            const contentData = contents.map(item => ({
                sectionId: sectionId,
                type: item.type,
                content: item.content
            }));
                await this.contentModel.bulkCreate(contentData, { transaction });
            }

            if (cards?.length) {
            const cardData = cards.map(card => ({
                sectionId: sectionId,
                ...card
            }));
                await this.cardModel.bulkCreate(cardData, { transaction });
            }

            if (numbers?.length) {
            const statData = numbers.map(stat => ({
                sectionId: sectionId,
                ...stat
            }));
                await this.numbersModel.bulkCreate(statData, { transaction });
            }

            if (buttons?.length) {
            const buttonsData = buttons.map(buttons => ({
                sectionId: sectionId,
                ...buttons
            }));
                await this.buttonsModel.bulkCreate(buttonsData, { transaction });
            }

            if (image?.length) {
            const imageData = image.map(image => ({
                sectionId: sectionId,
                ...image
            }));
                await this.imageModel.bulkCreate(imageData, { transaction });
            }

            await transaction.commit();

            return {
                message: 'Seção completa criada com sucesso!',
                section: newSection
            };

        } catch (error) {
            await transaction.rollback();
            throw new BadRequestException('Erro ao criar seção completa');
        }
    }
}