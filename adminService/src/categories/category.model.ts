import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Product } from '../products/product.model';

export interface CategoryCreationAttributes {
    name: string;
}

@Table({ tableName: 'Categories', timestamps: true, modelName: 'Categories' })
export class Category extends Model<Category, CategoryCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare idCategory: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare name: string;

    @HasMany(() => Product)
    declare products: Product[];
}