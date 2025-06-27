import { v2 as cloudinary } from 'cloudinary';
import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

const storage = multer.memoryStorage();

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// eslint-disable-next-line no-undef
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    if(file.mimetype.startsWith('image/')){
        cb(null, true)
    }else{
        cb(new Error('Only image files are allowed') as any, false)
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    }
})

export {cloudinary}
