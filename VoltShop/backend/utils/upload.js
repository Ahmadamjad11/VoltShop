import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// التأكد من وجود مجلد uploads
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

// إعداد التخزين
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // إنشاء اسم فريد للملف: timestamp + random number + extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// فلترة الملفات - قبول الصور فقط
const fileFilter = (req, file, cb) => {
  // إذا لم يكن هناك ملف، السماح بذلك (optional file)
  if (!file) {
    return cb(null, true);
  }
  
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('يجب أن يكون الملف صورة (jpeg, jpg, png, gif, webp)'));
  }
};

// إعداد multer - السماح بعدم وجود ملف (optional)
// ملاحظة: multer يملأ req.body تلقائياً عند معالجة multipart/form-data
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Export both single (required) and optional single (for when file might not exist)
export const uploadSingle = upload.single('image');
export const uploadOptional = upload.single('image'); // Same, but we'll handle it in controller

export default upload;

