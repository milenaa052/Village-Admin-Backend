import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Section } from '../sections/section.model';

export interface ButtonCreationAttributes {
    label: string;
    link: string;
    sectionId: number;
}

@Table({ tableName: 'Buttons', timestamps: true, modelName: 'Buttons' })
export class Button extends Model<Button, ButtonCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare idButton: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare label: string;

    @Column({ 
        type: DataType.STRING,
        allowNull: false 
    })
    declare link: string;

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