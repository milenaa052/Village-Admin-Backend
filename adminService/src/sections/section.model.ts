import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript'
import { Content } from '../contents/content.model'
import { Card } from '../cards/card.model'
import { Image } from '../images/images.model'
import { Stats } from '../stats/stats.model'
import { Button } from '../buttons/buttons.model'
import { SectionName, SectionCreationAttributes } from './interface/section.interface'

const cascade = {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
}

@Table({ tableName: 'Sections', timestamps: true, modelName: 'Sections' })
export class Section extends Model<Section, SectionCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare idSection: number

    @Column({
        type: DataType.ENUM(...Object.values(SectionName)),
        allowNull: false,
        unique: true
    })
    declare name: SectionName

    @Column({ 
        type: DataType.STRING,
        allowNull: false 
    })
    declare title: string

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare subtitle: string

    @HasMany(() => Content, cascade)
    declare contents: Content[]

    @HasMany(() => Card, cascade)
    declare cards: Card[]

    @HasMany(() => Image, cascade)
    declare images: Image[]

    @HasMany(() => Stats, cascade)
    declare stats: Stats[]

    @HasMany(() => Button, cascade)
    declare buttons: Button[]
}