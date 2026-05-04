import { IsString, IsNotEmpty } from 'class-validator';
import { SectionName } from '../section.model';

export class CreateSectionDto {
    @IsNotEmpty({ message: 'Nome da seção é obrigatório' })
    @IsString()
    name!: SectionName;

    @IsNotEmpty({ message: 'Título é obrigatório' })
    @IsString()
    title!: string;

    @IsNotEmpty({ message: 'Subtítulo é obrigatório' })
    @IsString()
    subtitle!: string;
}