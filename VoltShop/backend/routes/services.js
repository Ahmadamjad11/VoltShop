import express from 'express';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  updateServiceStatus,
  getServiceStats
} from '../controllers/serviceController.js';

const router = express.Router();

// إنشاء طلب خدمة جديد
router.post('/', createService);

// الحصول على جميع طلبات الخدمات
router.get('/', getAllServices);

// الحصول على إحصائيات الخدمات
router.get('/stats', getServiceStats);

// الحصول على طلب خدمة واحد
router.get('/:id', getServiceById);

// تحديث طلب خدمة
router.put('/:id', updateService);

// تحديث حالة طلب الخدمة
router.patch('/:id/status', updateServiceStatus);

// حذف طلب خدمة
router.delete('/:id', deleteService);

export default router;
