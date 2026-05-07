import { IsOptional, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ContentDto } from "../../contents/dto/content.dto";
import { CardDto } from "../../cards/dto/card.dto";
import { StatsDto } from "../../stats/dto/stats.dto";
import { ButtonDto } from "../../buttons/dto/buttons.dto";
import { ImageDto } from "../../images/dto/image.dto";
import { CreateSectionDto } from "./create-section.dto";

export class CreateFullSectionDto {
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateSectionDto)
    section?: CreateSectionDto;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ContentDto)
    contents?: ContentDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CardDto)
    cards?: CardDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StatsDto)
    stats?: StatsDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ButtonDto)
    buttons?: ButtonDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImageDto)
    image?: ImageDto[];
}