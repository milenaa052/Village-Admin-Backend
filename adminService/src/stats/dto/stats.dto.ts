import { IsString } from 'class-validator';

export class StatsDto {
    @IsString()
    title!: string;

    @IsString()
    value!: string;
}