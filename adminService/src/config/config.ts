import { Sequelize } from "sequelize"
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.DB_NAME || !process.env.DB_USER) {
  throw new Error('Variáveis de ambiente DB_NAME e DB_USER são obrigatórias')
}

const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT.toString()) : undefined,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        timezone: '+00:00',
    }
)

export default sequelize