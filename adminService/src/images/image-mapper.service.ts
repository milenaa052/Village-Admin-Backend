import { Injectable } from "@nestjs/common"
import { Image } from "./images.model"
import { ImageResponseDto } from "./dto/image-response.dto"

@Injectable()
export class ImageMapperService {

    toResponse(image: Image): ImageResponseDto {

        return {
            idImage: image.idImage,
            imageUrl: image.imageUrl,
            altText: image.altText,
            sectionId: image.sectionId,
            createdAt: image.createdAt,
            updatedAt: image.updatedAt
        }
    }
}
