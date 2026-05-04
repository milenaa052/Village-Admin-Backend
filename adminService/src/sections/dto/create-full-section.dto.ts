import { ContentType } from "../content.model";
import { SectionName } from "../section.model";

export class CreateFullSectionDto {
    section?: {
        name: SectionName;
        title: string;
        subtitle: string;
    };

    contents?: {
        type: ContentType;
        content: string;
    }[];

    cards?: {
        title: string;
        description: string;
        icon: string;
    }[];

    stats?: {
        title: string;
        value: string;
    }[];

    buttons?: {
        label: string;
        link: string;
    }[];

    image?: {
        imageUrl: string;
        altText: string;
    }[];
}