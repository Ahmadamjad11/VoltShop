import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// التحقق من أن متغيرات البيئة الخاصة بـ Cloudinary موجودة
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("CRITICAL ERROR: Cloudinary environment variables are not set. Please check your .env file.");
  // إيقاف التطبيق إذا كانت الإعدادات الأساسية مفقودة لمنع أخطاء غير متوقعة
  process.exit(1); 
}

// ضبط إعدادات Cloudinary باستخدام متغيرات البيئة التي أضفتها في ملف .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// إعداد مساحة التخزين على Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'voltshop-products', // اسم المجلد الذي سيتم إنشاؤه في حسابك على Cloudinary لتنظيم الصور
    allowed_formats: ['jpeg', 'png', 'jpg'], // الصيغ المسموح بها للصور فقط
    transformation: [{ width: 800, height: 800, crop: 'limit' }] // لتحديد حجم أقصى للصور وتوفير المساحة
  },
});

// إعداد Multer لاستخدام تخزين Cloudinary بدلاً من التخزين المحلي
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB حد أقصى لحجم الملف
  fileFilter: (req, file, cb) => {
    // فلتر للتأكد من أن الملف المرفوع هو صورة
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('الملف ليس صورة! يرجى رفع صورة فقط.'), false);
    }
  }
});

export default upload;
