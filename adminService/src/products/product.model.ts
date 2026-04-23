import { Table, Column, Model, DataType } from 'sequelize-typescript';

export interface ProductCreationAttributes {
    name: string;
    description: string;
    price: number;
    size: string;
    imageUrl: string;
    categoryId: number;
}

@Table({ tableName: 'Products', timestamps: true, modelName: 'Products' })
export class Product extends Model<Product, ProductCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare idProduct: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare name: string;

    @Column({ 
        type: DataType.STRING,
        allowNull: false 
    })
    declare description: string;
    
    @Column({ 
        type: DataType.NUMBER,
        allowNull: false 
    })
    declare price: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare size: string;

    @Column({ 
        type: DataType.STRING,
        allowNull: false 
    })
    declare imageUrl: string;

    @Column({ 
        type: DataType.NUMBER,
        allowNull: false 
    })
    declare categoryId: number;
}