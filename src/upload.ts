import multer, { StorageEngine } from 'multer';
import path from 'path';
import { Request } from 'express';

interface MulterFile extends Express.Multer.File {
    destination: string;
    filename: string;
}

const multerStorage: StorageEngine = multer.diskStorage({
    destination: (req: Request, file: MulterFile, cb: (error: Error | null, destination: string) => void) => {
        cb(null, './images');
    },
    filename: (req: Request, file: MulterFile, cb: (error: Error | null, filename: string) => void) => {
        cb(null, `image-${Date.now()}` + path.extname(file.originalname))
    }
});

const multerFilter = (req: Request, file: MulterFile, cb: (error: Error | null, acceptFile: boolean) => void) => {
    if (!file.originalname.match(/\.(png|jpeg)$/)) {
        cb(new Error('Please upload an image'), false);
    } else {
        cb(null, true);
    }
};

export const upload = multer({
    storage: multerStorage,
    fileFilter: (req, file, callback) => multerFilter(req, file, (error, acceptFile) => callback(null, acceptFile))
});