
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

//Cloudinary
// console.log('CLOUDINARY CONFIG:', {
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'FOUND' : 'MISSING',
//     api_key: process.env.CLOUDINARY_API_KEY ? 'FOUND' : 'MISSING',
//     api_secret: process.env.CLOUDINARY_API_SECRET ? 'FOUND' : 'MISSING',
// });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setting storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        console.log('MULTER: Starting upload to Cloudinary...', file.originalname);
        return {
            folder: 'batchtask_uploads', //name of the folder in Cloudinary
            resource_type: 'auto', //for images and videos
            public_id: Date.now() + '-' + file.originalname.split('.')[0],
        };
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'video/mp4') {
            cb(null, true);
        } else {
            cb(new Error('Only images and MP4 videos are allowed.'));
        }
    },
});

export default upload;
