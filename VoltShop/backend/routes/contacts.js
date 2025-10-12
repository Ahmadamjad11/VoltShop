import express from 'express';
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  updateContactStatus,
  getContactStats
} from '../controllers/contactController.js';

const router = express.Router();

// إنشاء رسالة تواصل جديدة
router.post('/', createContact);

// الحصول على جميع رسائل التواصل
router.get('/', getAllContacts);

// الحصول على إحصائيات الرسائل
router.get('/stats', getContactStats);

// الحصول على رسالة تواصل واحدة
router.get('/:id', getContactById);

// تحديث رسالة تواصل
router.put('/:id', updateContact);

// تحديث حالة الرسالة
router.patch('/:id/status', updateContactStatus);

// حذف رسالة تواصل
router.delete('/:id', deleteContact);

export default router;
