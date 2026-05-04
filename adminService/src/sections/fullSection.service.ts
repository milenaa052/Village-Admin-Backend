import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Section } from './section.model';
import { CreateFullSectionDto } from './dto/create-full-section.dto';
import { Sequelize } from 'sequelize-typescript';
import { Content } from './content.model';
import { Card } from './card.model';
import { Stat } from './stats.model';
import { Button } from './buttons.model';
import { Image } from './images.model';

@Injectable()
export class FullSectionService {
    constructor(
        @InjectModel(Section) private readonly sectionModel: typeof Section,
        @InjectModel(Content) private readonly contentModel: typeof Content,
        @InjectModel(Card) private readonly cardModel: typeof Card,
        @InjectModel(Stat) private readonly statsModel: typeof Stat,
        @InjectModel(Button) private readonly buttonsModel: typeof Button,
        @InjectModel(Image) private readonly imageModel: typeof Image,
        private readonly sequelize: Sequelize,
    ) {}

    async createFullSection(dto: CreateFullSectionDto) {
        const transaction = await this.sequelize.transaction();

        try {
            const { section, contents, cards, stats, buttons, image } = dto;
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

            if (stats?.length) {
            const statData = stats.map(stat => ({
                sectionId: sectionId,
                ...stat
            }));
                await this.statsModel.bulkCreate(statData, { transaction });
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

    async findAll() {
        return await this.sectionModel.findAll();
    }

    async findById(id: number) {
        const section = await this.sectionModel.findByPk(id);

        if (!section) throw new NotFoundException('Seção não encontrado!');
        return section;
    }

    async updateFullSection(id: number, dto: CreateFullSectionDto) {
        const transaction = await this.sequelize.transaction();

        try {
            const section = await this.sectionModel.findByPk(id);

            if (!section) {
                throw new NotFoundException('Seção não encontrada!');
            }

            const { section: sectionData, contents, cards, stats, buttons, image } = dto;

            if (!sectionData) {
                throw new BadRequestException('Dados da seção são obrigatórios');
            }
            await section.update(sectionData, { transaction });

            await this.contentModel.destroy({ where: { sectionId: id }, transaction });
            await this.cardModel.destroy({ where: { sectionId: id }, transaction });
            await this.statsModel.destroy({ where: { sectionId: id }, transaction });
            await this.buttonsModel.destroy({ where: { sectionId: id }, transaction });
            await this.imageModel.destroy({ where: { sectionId: id }, transaction });

            if (contents?.length) {
                await this.contentModel.bulkCreate(
                    contents.map(item => ({
                        sectionId: id,
                        ...item
                    })),
                    { transaction }
                );
            }

            if (cards?.length) {
                await this.cardModel.bulkCreate(
                    cards.map(item => ({
                        sectionId: id,
                        ...item
                    })),
                    { transaction }
                );
            }

            if (stats?.length) {
                await this.statsModel.bulkCreate(
                    stats.map(item => ({
                        sectionId: id,
                        ...item
                    })),
                    { transaction }
                );
            }

            if (buttons?.length) {
                await this.buttonsModel.bulkCreate(
                    buttons.map(item => ({
                        sectionId: id,
                        ...item
                    })),
                    { transaction }
                );
            }

            if(image?.length) {
                await this.imageModel.bulkCreate(
                    image?.map(item => ({
                        sectionId: id,
                        ...item
                    })),
                    { transaction }
                )
            }

            await transaction.commit();

            return {
                message: 'Seção atualizada com sucesso!'
            };

        } catch (error) {
            await transaction.rollback();
            throw new BadRequestException('Erro ao atualizar seção completa');
        }
    }

    async deleteById(id: number): Promise<{ message: string }> {
        const section = await this.sectionModel.findByPk(id);
        
        if (!section) {
            throw new NotFoundException('Seção não encontrada!');
        }

        await section.destroy();
        return { message: 'Seção deletada com sucesso!' };
    }
}