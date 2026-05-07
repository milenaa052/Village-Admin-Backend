import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { CategoryModule } from './categories/category.module';
import { ProductModule } from './products/product.module';
import { SectionModule } from './sections/section.module';
import { ContentModule } from './contents/content.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        SequelizeModule.forRoot({
        dialect: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port:  Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        autoLoadModels: true,
        synchronize: true,
        logging: false,
        }),
        AdminModule,
        CategoryModule,
        ProductModule,
        SectionModule,
        ContentModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}