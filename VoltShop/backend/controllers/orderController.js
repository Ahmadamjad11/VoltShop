import Order from "../models/Order.js";
import { sendOrderNotification, sendStatusUpdateNotification } from '../utils/emailService.js';

// إنشاء طلب جديد
export const createOrder = async (req, res) => {
  try {
    const { customer, items, total, delivery } = req.body;

    console.log("=== بيانات الطلب المستلمة ===");
    console.log("العميل:", customer);
    console.log("عدد المنتجات:", items.length);
    console.log("المجموع:", total);
    console.log("التوصيل:", delivery);

    if (!customer || !items || items.length === 0) {
      return res.status(400).json({ message: "بيانات الطلب غير مكتملة" });
    }

    if (!customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({ message: "بيانات العميل غير مكتملة" });
    }

    const orderProducts = items.map((item, index) => {
      const productId = item._id || item.productId || `temp_${Date.now()}_${index}`;
      
      return {
        productId: productId,
        quantity: item.quantity,
        price: item.price,
        name: item.name || `منتج ${index + 1}`,
        image: item.image || null
      };
    });

    console.log("=== المنتجات بعد المعالجة ===");
    console.log(orderProducts);

    const newOrder = new Order({
      customerInfo: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address
      },
      products: orderProducts,
      paymentMethod: customer.payment || "cash",
      total,
      delivery,
      status: "pending"
    });

    const saved = await newOrder.save();
    console.log("✅ تم حفظ الطلب بنجاح:", saved._id);
    
    // إرسال إشعار البريد الإلكتروني (غير متزامن)
    setTimeout(() => {
      sendOrderNotification(saved).then(success => {
        if (success) {
          console.log('🎉 تم إرسال الإيميل للإدارة بنجاح');
        } else {
          console.log('⚠️ لم يتم إرسال الإيميل، ولكن الطلب تم حفظه');
        }
      });
    }, 1000);
    
    res.status(201).json({
      success: true,
      message: "تم إنشاء الطلب بنجاح",
      order: saved
    });
    
  } catch (err) {
    console.error("❌ خطأ في إنشاء الطلب:", err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        message: "معرف المنتج غير صحيح",
        error: err.message 
      });
    }
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        message: "بيانات غير صالحة",
        error: err.message 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "خطأ داخلي في الخادم", 
      error: err.message 
    });
  }
};

// جلب كل الطلبات
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("products.productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// جلب طلب واحد حسب ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("products.productId");
    if (!order) return res.status(404).json({ message: "الطلب غير موجود" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// تحديث حالة الطلب
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("🔧 Received update request for order:", id);
    console.log("🎯 Requested status:", status);
    console.log("📦 Request body:", req.body);

    // تحقق من أن ID صالح
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({ 
        message: "معرف الطلب غير صالح" 
      });
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "حالة غير صالحة",
        validStatuses 
      });
    }

    // تحقق من وجود الطلب أولاً
    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      console.log("❌ Order not found:", id);
      return res.status(404).json({ message: "الطلب غير موجود" });
    }

    console.log("📋 Existing order status:", existingOrder.status);

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "الطلب غير موجود" });
    }

    console.log("✅ Order updated successfully:", updatedOrder._id);
    console.log("🔄 New status:", updatedOrder.status);

    // إرسال إشعار تحديث الحالة
    setTimeout(() => {
      sendStatusUpdateNotification(updatedOrder, existingOrder.status, status).then(success => {
        if (success) {
          console.log('🎉 تم إرسال إشعار التحديث بنجاح');
        } else {
          console.log('⚠️ لم يتم إرسال إشعار التحديث');
        }
      });
    }, 1000);
    
    res.json({
      success: true,
      message: "تم تحديث حالة الطلب",
      order: updatedOrder
    });

  } catch (err) {
    console.error("❌ Error updating order status:", err);
    console.error("📝 Error details:", err);
    
    res.status(500).json({ 
      message: "خطأ في تحديث حالة الطلب", 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};