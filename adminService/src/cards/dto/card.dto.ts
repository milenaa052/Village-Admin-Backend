import { IsString } from 'class-validator';

export class CardDto {
    @IsString()
    title!: string;

    @IsString()
    description!: string;

    @IsString()
    icon!: string;
}