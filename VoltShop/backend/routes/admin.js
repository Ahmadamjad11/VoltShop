import express from 'express';
import {
  adminLogin,
  registerAdmin,       // أضفنا هذا
  addProduct,
  editProduct,
  deleteProductAdmin,
  getAllOrders,
  updateOrderStatusAdmin
} from '../controllers/adminController.js';

const router = express.Router();

// تسجيل أدمن جديد (مؤقت للاختبار أو إنشاء أول حساب)
router.post('/register', registerAdmin);

// تسجيل دخول الأدمن
router.post('/login', adminLogin);

// إدارة المنتجات
router.post('/products', addProduct);
router.put('/products/:id', editProduct);
router.delete('/products/:id', deleteProductAdmin);

// إدارة الطلبات
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatusAdmin);

export default router;
