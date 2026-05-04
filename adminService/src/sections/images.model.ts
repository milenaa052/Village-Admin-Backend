import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Section } from './section.model';

export interface ImageCreationAttributes {
    imageUrl: string;
    altText: string;
    sectionId: number;
}

@Table({ tableName: 'Images', timestamps: true, modelName: 'Images' })
export class Image extends Model<Image, ImageCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare idImage: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare imageUrl: string;

    @Column({ 
        type: DataType.STRING,
        allowNull: false 
    })
    declare altText: string;

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