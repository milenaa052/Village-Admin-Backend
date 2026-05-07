import { IsString } from 'class-validator';

export class ButtonDto {
    @IsString()
    label!: string;

    @IsString()
    link!: string;
}