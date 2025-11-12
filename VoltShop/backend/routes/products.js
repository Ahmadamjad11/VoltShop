import express from 'express';
import multer from 'multer';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSubcategories,
  getTypes
} from '../controllers/productController.js';
// استيراد إعدادات الرفع الجديدة التي تعتمد على Cloudinary
import upload from '../utils/upload.js'; 

const router = express.Router();

// Routes للحصول على Subcategories و Types
router.get('/subcategories', getSubcategories);
router.get('/types', getTypes);

// Routes الأساسية للمنتجات
router.get('/', getProducts);
router.get('/:id', getProductById);

// Middleware بسيط لمعالجة أخطاء الرفع من multer أو Cloudinary
const uploadMiddleware = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      // معالجة الأخطاء الشائعة
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'حجم الملف كبير جداً (الحد الأقصى 5MB)' });
        }
        return res.status(400).json({ message: `خطأ في الرفع: ${err.message}` });
      } else if (err) {
        // أخطاء أخرى (مثل نوع ملف غير مدعوم من الفلتر)
        return res.status(400).json({ message: err.message });
      }
    }
    // إذا لم يكن هناك خطأ، انتقل إلى الـ controller التالي
    next();
  });
};

// استخدام الـ middleware في مسارات الإنشاء والتحديث
router.post('/', uploadMiddleware, createProduct);
router.put('/:id', uploadMiddleware, updateProduct);
router.delete('/:id', deleteProduct);

export default router;
