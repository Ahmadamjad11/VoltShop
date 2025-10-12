import Service from '../models/Service.js';

// إنشاء طلب خدمة جديد
export const createService = async (req, res) => {
  try {
    const serviceData = {
      ...req.body,
      status: 'pending'
    };
    
    const service = new Service(serviceData);
    await service.save();
    
    res.status(201).json({
      success: true,
      message: 'تم إنشاء طلب الخدمة بنجاح',
      data: service
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في إنشاء طلب الخدمة',
      error: error.message
    });
  }
};

// الحصول على جميع طلبات الخدمات
export const getAllServices = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }
    
    const services = await Service.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Service.countDocuments(query);
    
    res.json({
      success: true,
      data: services,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب طلبات الخدمات',
      error: error.message
    });
  }
};

// الحصول على طلب خدمة واحد
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'طلب الخدمة غير موجود'
      });
    }
    
    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب طلب الخدمة',
      error: error.message
    });
  }
};

// تحديث طلب خدمة
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const service = await Service.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'طلب الخدمة غير موجود'
      });
    }
    
    res.json({
      success: true,
      message: 'تم تحديث طلب الخدمة بنجاح',
      data: service
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في تحديث طلب الخدمة',
      error: error.message
    });
  }
};

// حذف طلب خدمة
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'طلب الخدمة غير موجود'
      });
    }
    
    res.json({
      success: true,
      message: 'تم حذف طلب الخدمة بنجاح'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في حذف طلب الخدمة',
      error: error.message
    });
  }
};

// تحديث حالة طلب الخدمة
export const updateServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, assignedTechnician, estimatedCost } = req.body;
    
    const updateData = { status };
    if (notes) updateData.notes = notes;
    if (assignedTechnician) updateData.assignedTechnician = assignedTechnician;
    if (estimatedCost) updateData.estimatedCost = estimatedCost;
    
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }
    
    const service = await Service.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'طلب الخدمة غير موجود'
      });
    }
    
    res.json({
      success: true,
      message: 'تم تحديث حالة طلب الخدمة بنجاح',
      data: service
    });
  } catch (error) {
    console.error('Error updating service status:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في تحديث حالة طلب الخدمة',
      error: error.message
    });
  }
};

// الحصول على إحصائيات الخدمات
export const getServiceStats = async (req, res) => {
  try {
    const totalServices = await Service.countDocuments();
    const pendingServices = await Service.countDocuments({ status: 'pending' });
    const confirmedServices = await Service.countDocuments({ status: 'confirmed' });
    const inProgressServices = await Service.countDocuments({ status: 'in_progress' });
    const completedServices = await Service.countDocuments({ status: 'completed' });
    const cancelledServices = await Service.countDocuments({ status: 'cancelled' });
    
    // الخدمات الأكثر طلباً
    const serviceTypes = await Service.aggregate([
      { $group: { _id: '$serviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    res.json({
      success: true,
      data: {
        total: totalServices,
        pending: pendingServices,
        confirmed: confirmedServices,
        inProgress: inProgressServices,
        completed: completedServices,
        cancelled: cancelledServices,
        serviceTypes
      }
    });
  } catch (error) {
    console.error('Error fetching service stats:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب إحصائيات الخدمات',
      error: error.message
    });
  }
};
