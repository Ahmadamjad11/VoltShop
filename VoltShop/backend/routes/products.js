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
import upload from '../utils/upload.js';

const router = express.Router();

// Routes للحصول على Subcategories و Types (يجب أن تكون قبل /:id)
router.get('/subcategories', getSubcategories);
router.get('/types', getTypes);

router.get('/', getProducts);
router.get('/:id', getProductById);

// Middleware لمعالجة أخطاء multer (يجب أن يكون بعد upload)
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'حجم الملف كبير جداً (الحد الأقصى 5MB)' });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// استخدام upload.single مع معالجة الأخطاء
// ملاحظة مهمة: multer يملأ req.body تلقائياً عند معالجة multipart/form-data
const uploadMiddleware = (req, res, next) => {
  console.log('\n--- UPLOAD MIDDLEWARE START ---');
  console.log('Before multer - Content-Type:', req.get('content-type'));
  console.log('Before multer - req.body type:', typeof req.body);
  console.log('Before multer - req.body:', req.body);
  
  // multer.single() يعالج multipart/form-data ويملأ req.body تلقائياً
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('❌ Multer error:', err);
      console.error('Multer error type:', err.constructor.name);
      console.error('Multer error message:', err.message);
      console.error('Multer error stack:', err.stack);
      return handleMulterError(err, req, res, next);
    }
    
    console.log('After multer - req.body type:', typeof req.body);
    console.log('After multer - req.body:', req.body);
    console.log('After multer - req.body keys:', req.body ? Object.keys(req.body) : 'N/A');
    console.log('After multer - req.file:', req.file);
    
    // multer يجب أن يملأ req.body تلقائياً
    // إذا لم يحدث ذلك، نملؤه يدوياً (يجب ألا يحدث هذا في الوضع الطبيعي)
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      console.error('❌ CRITICAL: req.body is not properly set by multer!');
      console.error('req.body value:', req.body);
      console.error('req.body type:', typeof req.body);
      req.body = {};
    }
    
    console.log('--- UPLOAD MIDDLEWARE END ---\n');
    next();
  });
};

router.post('/', uploadMiddleware, createProduct);
router.put('/:id', uploadMiddleware, updateProduct);
router.delete('/:id', deleteProduct);

export default router;
