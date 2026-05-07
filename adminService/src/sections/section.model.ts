import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Content } from '../contents/content.model';
import { Card } from './card.model';
import { Image } from './images.model';
import { Stat } from './stats.model';
import { Button } from './buttons.model';

export enum SectionName {
    homePage = 'Página Inicial',
    aboutUs = 'Sobre Nós',
    socialImpact = 'Impacto Social',
    identity = 'Identidade',
    values = 'Valores',
    traditionalTechniques = 'Técnicas Tradicionais',
    preserve = 'Preserve',
    doubts = 'Dúvidas',
    aboutProducts = 'Sobre os Produtos',
    guarantee = 'Garantia',
}

export interface SectionCreationAttributes {
    name: SectionName;
    title: string;
    subtitle: string;
}

const cascade = {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
};

@Table({ tableName: 'Sections', timestamps: true, modelName: 'Sections' })
export class Section extends Model<Section, SectionCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare idSection: number;

    @Column({
        type: DataType.ENUM(...Object.values(SectionName)),
        allowNull: false,
        unique: true
    })
    declare name: SectionName;

    @Column({ 
        type: DataType.STRING,
        allowNull: false 
    })
    declare title: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare subtitle: string;

    @HasMany(() => Content, cascade)
    declare contents: Content[];

    @HasMany(() => Card, cascade)
    declare cards: Card[];

    @HasMany(() => Image, cascade)
    declare images: Image[];

    @HasMany(() => Stat, cascade)
    declare stats: Stat[];

    @HasMany(() => Button, cascade)
    declare buttons: Button[];
}