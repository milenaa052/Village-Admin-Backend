import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { Category } from '../categories/category.model'
import { ProductCreationAttributes } from './interface/product.interface'

@Table({ tableName: 'Products', timestamps: true, modelName: 'Products' })
export class Product extends Model<Product, ProductCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare idProduct: number

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare name: string

    @Column({ 
        type: DataType.STRING,
        allowNull: false 
    })
    declare description: string
    
    @Column({ 
        type: DataType.DECIMAL,
        allowNull: false 
    })
    declare price: number

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare size: string

    @Column({ 
        type: DataType.STRING,
        allowNull: false 
    })
    declare imageUrl: string

    @ForeignKey(() => Category)
    @Column({ 
        type: DataType.INTEGER,
        allowNull: false 
    })
    declare categoryId: number

    @BelongsTo(() => Category)
    declare category: Category
}