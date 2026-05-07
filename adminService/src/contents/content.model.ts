import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Section } from '../sections/section.model';

export enum ContentType {
    P1 = 'P1',
    P2 = 'P2',
    P3 = 'P3',
    P4 = 'P4',
    P5 = 'P5'
}

export interface ContentCreationAttributes {
    type: ContentType;
    content: string;
    sectionId: number;
}

@Table({ tableName: 'Contents', timestamps: true, modelName: 'Contents' })
export class Content extends Model<Content, ContentCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare idContent: number;

    @Column({
        type: DataType.ENUM(...Object.values(ContentType)),
        allowNull: false,
        defaultValue: ContentType.P1
    })
    declare type: ContentType;

    @Column({ 
        type: DataType.STRING,
        allowNull: false 
    })
    declare content: string;

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