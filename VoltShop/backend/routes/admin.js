import express from 'express';
import {
  adminLogin,
  registerAdmin,
  addProduct,
  editProduct,
  deleteProductAdmin,
  getAllOrders,
  updateOrderStatusAdmin,
  getAdminStats
} from '../controllers/adminController.js';

const router = express.Router();

// تسجيل أدمن جديد
router.post('/register', registerAdmin);

// تسجيل دخول الأدمن
router.post('/login', adminLogin);

// إدارة المنتجات
router.post('/products', addProduct);
router.put('/products/:id', editProduct);
router.delete('/products/:id', deleteProductAdmin);

// الطلبات
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatusAdmin);

// الإحصائيات
router.get('/stats', getAdminStats);

export default router;
