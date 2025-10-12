import Contact from '../models/Contact.js';

// إنشاء رسالة تواصل جديدة
export const createContact = async (req, res) => {
  try {
    const contactData = {
      ...req.body,
      status: 'new'
    };
    
    const contact = new Contact(contactData);
    await contact.save();
    
    res.status(201).json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح',
      data: contact
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في إرسال الرسالة',
      error: error.message
    });
  }
};

// الحصول على جميع رسائل التواصل
export const getAllContacts = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }
    if (priority) {
      query.priority = priority;
    }
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Contact.countDocuments(query);
    
    res.json({
      success: true,
      data: contacts,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب الرسائل',
      error: error.message
    });
  }
};

// الحصول على رسالة تواصل واحدة
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'الرسالة غير موجودة'
      });
    }
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب الرسالة',
      error: error.message
    });
  }
};

// تحديث رسالة تواصل
export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'الرسالة غير موجودة'
      });
    }
    
    res.json({
      success: true,
      message: 'تم تحديث الرسالة بنجاح',
      data: contact
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في تحديث الرسالة',
      error: error.message
    });
  }
};

// حذف رسالة تواصل
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'الرسالة غير موجودة'
      });
    }
    
    res.json({
      success: true,
      message: 'تم حذف الرسالة بنجاح'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في حذف الرسالة',
      error: error.message
    });
  }
};

// تحديث حالة الرسالة
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reply, assignedTo, priority } = req.body;
    
    const updateData = { status };
    if (reply) updateData.reply = reply;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (priority) updateData.priority = priority;
    
    if (status === 'replied') {
      updateData.repliedAt = new Date();
    }
    if (status === 'closed') {
      updateData.closedAt = new Date();
    }
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'الرسالة غير موجودة'
      });
    }
    
    res.json({
      success: true,
      message: 'تم تحديث حالة الرسالة بنجاح',
      data: contact
    });
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في تحديث حالة الرسالة',
      error: error.message
    });
  }
};

// الحصول على إحصائيات الرسائل
export const getContactStats = async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const newContacts = await Contact.countDocuments({ status: 'new' });
    const readContacts = await Contact.countDocuments({ status: 'read' });
    const repliedContacts = await Contact.countDocuments({ status: 'replied' });
    const closedContacts = await Contact.countDocuments({ status: 'closed' });
    
    // الرسائل حسب الأولوية
    const priorityStats = await Contact.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // الرسائل حسب الموضوع
    const subjectStats = await Contact.aggregate([
      { $group: { _id: '$subject', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    res.json({
      success: true,
      data: {
        total: totalContacts,
        new: newContacts,
        read: readContacts,
        replied: repliedContacts,
        closed: closedContacts,
        priorityStats,
        subjectStats
      }
    });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب إحصائيات الرسائل',
      error: error.message
    });
  }
};
