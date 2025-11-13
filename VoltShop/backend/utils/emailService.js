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

// دالة إرسال إشعار رسالة تواصل جديدة
export const sendContactNotification = async (contact) => {
  try {
    const transporter = createTransporter();

    const priorityColors = {
      low: '#95a5a6',
      medium: '#f39c12',
      high: '#e74c3c'
    };

    const priorityLabels = {
      low: 'منخفضة',
      medium: 'متوسطة',
      high: 'عالية'
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `📧 رسالة تواصل جديدة - ${contact.subject}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white; padding: 25px; text-align: center; }
            .content { padding: 25px; }
            .contact-info { background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-right: 4px solid #3498db; }
            .message-box { border: 1px solid #e0e0e0; padding: 20px; margin: 15px 0; border-radius: 8px; background: #fffaf0; line-height: 1.8; }
            .priority-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; color: white; font-weight: bold; margin: 5px 0; }
            .button { display: inline-block; background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin-top: 20px; font-weight: bold; }
            .footer { text-align: center; padding: 20px; background: #f8f9fa; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 رسالة تواصل جديدة</h1>
              <p>تم استلام رسالة جديدة تحتاج إلى مراجعتك</p>
            </div>

            <div class="content">
              <div class="contact-info">
                <h2>👤 معلومات المرسل</h2>
                <p><strong>الاسم:</strong> ${contact.name}</p>
                <p><strong>📧 البريد الإلكتروني:</strong> ${contact.email}</p>
                ${contact.phone ? `<p><strong>📞 الهاتف:</strong> ${contact.phone}</p>` : ''}
                <p><strong>📌 الموضوع:</strong> ${contact.subject}</p>
                <p>
                  <strong>🎯 الأولوية:</strong> 
                  <span class="priority-badge" style="background-color: ${priorityColors[contact.priority || 'medium']}">
                    ${priorityLabels[contact.priority || 'medium']}
                  </span>
                </p>
              </div>

              <h2>💬 محتوى الرسالة</h2>
              <div class="message-box">
                ${contact.message.replace(/\n/g, '<br/>')}
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.ADMIN_URL || 'http://localhost:5173'}/admin/contacts" class="button">
                  🚀 الانتقال إلى لوحة التحكم
                </a>
              </div>
            </div>

            <div class="footer">
              <p>⏰ تم استلام هذه الرسالة في: ${new Date(contact.createdAt).toLocaleString('ar-SA')}</p>
              <p>⚡ Volt Shop - جميع الحقوق محفوظة © 2025</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ تم إرسال إشعار الرسالة بنجاح:', info.messageId);
    
    return true;

  } catch (error) {
    console.error('❌ خطأ في إرسال إشعار الرسالة:', error.message);
    return false;
  }
};

// دالة إرسال إشعار طلب خدمة جديد
export const sendServiceNotification = async (service) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `🔧 طلب خدمة جديد - ${service.serviceType}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #e67e22 0%, #d35400 100%); color: white; padding: 25px; text-align: center; }
            .content { padding: 25px; }
            .service-info { background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-right: 4px solid #e67e22; }
            .description-box { border: 1px solid #e0e0e0; padding: 20px; margin: 15px 0; border-radius: 8px; background: #fffaf0; line-height: 1.8; }
            .button { display: inline-block; background: linear-gradient(135deg, #e67e22 0%, #d35400 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin-top: 20px; font-weight: bold; }
            .footer { text-align: center; padding: 20px; background: #f8f9fa; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔧 طلب خدمة جديد</h1>
              <p>تم استلام طلب خدمة جديد يحتاج إلى مراجعتك</p>
            </div>

            <div class="content">
              <div class="service-info">
                <h2>👤 معلومات العميل</h2>
                <p><strong>الاسم:</strong> ${service.name}</p>
                <p><strong>📞 الهاتف:</strong> ${service.phone}</p>
                ${service.email ? `<p><strong>📧 البريد الإلكتروني:</strong> ${service.email}</p>` : ''}
                <p><strong>📍 العنوان:</strong> ${service.address}</p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                <h2>🔧 معلومات الخدمة</h2>
                <p><strong>نوع الخدمة:</strong> ${service.serviceType}</p>
                ${service.issueType ? `<p><strong>نوع المشكلة:</strong> ${service.issueType}</p>` : ''}
                ${service.preferredDate ? `<p><strong>📅 التاريخ المفضل:</strong> ${service.preferredDate}</p>` : ''}
                ${service.preferredTime ? `<p><strong>⏰ الوقت المفضل:</strong> ${service.preferredTime}</p>` : ''}
              </div>

              <h2>📝 وصف المشكلة/الطلب</h2>
              <div class="description-box">
                ${service.description.replace(/\n/g, '<br/>')}
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.ADMIN_URL || 'http://localhost:5173'}/admin/services" class="button">
                  🚀 الانتقال إلى لوحة التحكم
                </a>
              </div>
            </div>

            <div class="footer">
              <p>⏰ تم استلام هذا الطلب في: ${new Date(service.createdAt).toLocaleString('ar-SA')}</p>
              <p>⚡ Volt Shop - جميع الحقوق محفوظة © 2025</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ تم إرسال إشعار طلب الخدمة بنجاح:', info.messageId);
    
    return true;

  } catch (error) {
    console.error('❌ خطأ في إرسال إشعار طلب الخدمة:', error.message);
    return false;
  }
};