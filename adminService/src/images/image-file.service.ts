import { Injectable } from "@nestjs/common"
import { imageUrlFromFilename, removeFileByUrl } from "./config/upload.utils"

@Injectable()
export class ImageFileService {

    async remove(path: string): Promise<void> {
        await removeFileByUrl(path)
    }

    generateUrl(filename: string): string {
        return imageUrlFromFilename(filename)
    }
}