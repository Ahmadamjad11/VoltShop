import nodemailer from 'nodemailer';

// إنشاء وسيط إرسال البريد
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// دالة إرسال إشعار طلب جديد
export const sendOrderNotification = async (order) => {
  try {
    const transporter = createTransporter();

    // محتوى البريد الإلكتروني
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `🛒 طلب جديد - رقم #${order._id.toString().slice(-6)}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; text-align: center; }
            .content { padding: 25px; }
            .order-info { background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-right: 4px solid #667eea; }
            .product-card { border: 1px solid #e0e0e0; padding: 15px; margin: 10px 0; border-radius: 8px; background: #fffaf0; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin-top: 20px; font-weight: bold; }
            .footer { text-align: center; padding: 20px; background: #f8f9fa; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚡ طلب جديد في متجر Volt</h1>
              <p>تم استلام طلب جديد يحتاج إلى مراجعتك</p>
            </div>

            <div class="content">
              <div class="order-info">
                <h2>📋 معلومات الطلب</h2>
                <p><strong>رقم الطلب:</strong> #${order._id.toString().slice(-6)}</p>
                <p><strong>👤 اسم العميل:</strong> ${order.customerInfo.name}</p>
                <p><strong>📞 الهاتف:</strong> ${order.customerInfo.phone}</p>
                <p><strong>📍 العنوان:</strong> ${order.customerInfo.address}</p>
                <p><strong>💳 المجموع:</strong> ${order.total} د.أ</p>
              </div>

              <h2>📦 المنتجات المطلوبة</h2>
              ${order.products.map((product, index) => `
                <div class="product-card">
                  <h3>${product.name}</h3>
                  <p><strong>الكمية:</strong> ${product.quantity}</p>
                  <p><strong>السعر:</strong> ${product.price} د.أ</p>
                  <p><strong>المجموع:</strong> ${product.price * product.quantity} د.أ</p>
                </div>
              `).join('')}

              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.ADMIN_URL}/orders" class="button">
                  🚀 الانتقال إلى لوحة التحكم
                </a>
              </div>
            </div>

            <div class="footer">
              <p>⏰ تم استلام هذا الطلب في: ${new Date(order.createdAt).toLocaleString('ar-SA')}</p>
              <p>⚡ Volt Shop - جميع الحقوق محفوظة © 2025</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // إرسال البريد
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ تم إرسال الإيميل بنجاح:', info.messageId);
    
    return true;

  } catch (error) {
    console.error('❌ خطأ في إرسال الإيميل:', error.message);
    return false;
  }
};

// دالة إرسال إشعار تحديث حالة الطلب
export const sendStatusUpdateNotification = async (order, oldStatus, newStatus) => {
  try {
    const transporter = createTransporter();

    const statusMessages = {
      pending: 'قيد الانتظار',
      processing: 'قيد التحضير',
      shipped: 'تم الشحن',
      delivered: 'تم التسليم',
      completed: 'مكتمل',
      cancelled: 'ملغي'
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `🔄 تحديث حالة الطلب - #${order._id.toString().slice(-6)}`,
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; max-width: 600px;">
          <h2 style="color: #3498db;">🔄 تحديث حالة الطلب</h2>
          <p>تم تغيير حالة الطلب <strong>#${order._id.toString().slice(-6)}</strong></p>
          <p>من: <span style="color: #e74c3c;">${statusMessages[oldStatus]}</span></p>
          <p>إلى: <span style="color: #27ae60;">${statusMessages[newStatus]}</span></p>
          <p>العميل: ${order.customerInfo.name}</p>
          <p>التاريخ: ${new Date().toLocaleString('ar-SA')}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ تم إرسال إشعار التحديث بنجاح');
    return true;

  } catch (error) {
    console.error('❌ خطأ في إرسال إشعار التحديث:', error);
    return false;
  }
};