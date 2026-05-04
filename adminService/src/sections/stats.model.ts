import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Section } from './section.model';

export interface StatCreationAttributes {
    title: string;
    value: string;
    sectionId: number;
}

@Table({ tableName: 'Stats', timestamps: true, modelName: 'Stats' })
export class Stat extends Model<Stat, StatCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare idStat: number;

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

    @BelongsTo(() => Section, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    declare section: Section;
}