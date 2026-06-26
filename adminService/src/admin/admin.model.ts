import { Table, Column, Model, DataType, BeforeCreate, BeforeUpdate } from 'sequelize-typescript'
import * as bcrypt from 'bcrypt'
import { AdminCreationAttributes, UserType } from './interface/admin.interface'

@Table({
  tableName: 'admins',
  timestamps: true,
  modelName: 'Admin',

  defaultScope: {
    attributes: {
      exclude: ['password']
    }
  }
})
export class Admin extends Model<Admin, AdminCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    declare idAdmin: number

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string

    @Column({ 
        type: DataType.STRING,
        allowNull: false,
        unique: true 
    })
    declare email: string
    
    @Column({ 
        type: DataType.STRING,
        allowNull: false 
    })
    declare password: string

    @Column({ 
        type: DataType.STRING,
        allowNull: false 
    })
    declare phone: string

    @Column({ 
        type: DataType.ENUM(...Object.values(UserType)),
        allowNull: false,
        defaultValue: UserType.ADMIN
    })
    declare type: UserType

    async comparePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password)
    }
    
    @BeforeCreate
    @BeforeUpdate
    static async hashPassword(admin: Admin) {
        if (admin.changed('password')) {
            admin.password = await bcrypt.hash(admin.password, Number(process.env.PASSWORD_SALT_ROUNDS))
        }
    }
}