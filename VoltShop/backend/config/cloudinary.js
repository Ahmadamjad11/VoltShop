import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

// التحقق من وجود متغيرات البيئة الأساسية لـ Cloudinary
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("CRITICAL ERROR: Cloudinary environment variables are not set. Please check your .env file.");
  process.exit(1); 
}

// ضبط إعدادات Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// إعداد مساحة التخزين على Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'voltshop-products',
    allowed_formats: ['jpeg', 'png', 'jpg'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  },
});

// إعداد Multer
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('File is not an image! Please upload only images.'), false);
    }
  }
});

// تصدير باستخدام export default
export default upload;
