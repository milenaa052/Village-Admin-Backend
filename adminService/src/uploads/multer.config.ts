import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, mkdirSync } from 'fs';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads/images';

if (!existsSync(UPLOAD_DIR)) {
    mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const multerOptions = {
    storage: diskStorage({
        destination: UPLOAD_DIR,

        filename: (
            req: any,
            file: Express.Multer.File,
            cb: (error: Error | null, filename: string) => void,
        ) => {
            const timestamp = Date.now();
            const unique = uuidv4();

            const fileExt = extname(file.originalname).toLowerCase();

            const filename = `${timestamp}-${unique}${fileExt}`;

            cb(null, filename);
        },
    }),

    limits: {
        fileSize: 5 * 1024 * 1024,
    },

    fileFilter: (
        req: any,
        file: Express.Multer.File,
        cb: Function,
    ) => {
        const allowed = /jpeg|jpg|png/;

        const mimetype = file.mimetype.toLowerCase();

        if (allowed.test(mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    'Invalid file type. Only jpg, jpeg and png are allowed.',
                ),
                false,
            );
        }
    },
};

export default multerOptions;