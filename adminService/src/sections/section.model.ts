import { Table, Column, Model, DataType } from 'sequelize-typescript';

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
}