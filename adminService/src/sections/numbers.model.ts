import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Section } from './section.model';

export interface NumberCreationAttributes {
    title: string;
    value: string;
    sectionId: number;
}

@Table({ tableName: 'Numbers', timestamps: true, modelName: 'Numbers' })
export class Number extends Model<Number, NumberCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare idNumber: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare title: string;

    @Column({ 
        type: DataType.STRING,
        allowNull: false 
    })
    declare value: string;

    @ForeignKey(() => Section)
    @Column({ 
        type: DataType.INTEGER,
        allowNull: false 
    })
    declare sectionId: number;

    @BelongsTo(() => Section)
    declare section: Section;
}