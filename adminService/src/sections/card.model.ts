import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Section } from './section.model';

export interface CardCreationAttributes {
    title: string;
    description: string;
    icon: string;
    sectionId: number;
}

@Table({ tableName: 'Cards', timestamps: true, modelName: 'Cards' })
export class Card extends Model<Card, CardCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare idCard: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare title: string;

    @Column({ 
        type: DataType.STRING,
        allowNull: false 
    })
    declare description: string;

    @Column({ 
        type: DataType.STRING,
        allowNull: true 
    })
    declare icon: string;

    @ForeignKey(() => Section)
    @Column({ 
        type: DataType.INTEGER,
        allowNull: false 
    })
    declare sectionId: number;

    @BelongsTo(() => Section)
    declare section: Section;
}