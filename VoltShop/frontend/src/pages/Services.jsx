import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/services.css";

export default function Services() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    serviceType: "",
    issueType: "",
    description: "",
    preferredDate: "",
    preferredTime: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // هنا يمكنك إضافة منطق إرسال البيانات إلى الخادم
    console.log("تم إرسال طلب الصيانة:", formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <div className="services-page">
          <div className="success-message">
            <h2>شكراً لتواصلك معنا!</h2>
            <p>تم استلام طلب الصيانة بنجاح، وسنتواصل معك في أقرب وقت لتأكيد الموعد.</p>
            <button onClick={() => setSubmitted(false)}>طلب خدمة أخرى</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="services-page">
        <div className="services-hero">
          <h1>خدمات الصيانة والتركيب</h1>
          <p>نقدم خدمات الصيانة والتركيب الاحترافية للأنظمة الكهربائية والمنزلية</p>
        </div>

        <div className="services-container">
          <div className="services-content">
            <div className="services-info">
              <h2>لماذا تختار خدمتنا؟</h2>
              <div className="features-grid">
                <div className="feature">
                  <div className="feature-icon">⚡</div>
                  <h3>فنيون متخصصون</h3>
                  <p>فنيون مؤهلون وذوو خبرة في جميع أنواع التركيبات الكهربائية</p>
                </div>
                <div className="feature">
                  <div className="feature-icon">⏰</div>
                  <h3>خدمة سريعة</h3>
                  <p>خدمة متاحة على مدار الأسبوع وحلول سريعة لأعطال الكهرباء</p>
                </div>
                <div className="feature">
                  <div className="feature-icon">🔧</div>
                  <h3>قطع غيار أصلية</h3>
                  <p>نستخدم قطع غيار أصلية متوفرة في متجرنا لضمان الجودة</p>
                </div>
                <div className="feature">
                  <div className="feature-icon">💯</div>
                  <h3>ضمان على العمل</h3>
                  <p>نوفر ضماناً على خدمات الصيانة والتركيب لمدة 6 أشهر</p>
                </div>
              </div>
            </div>

            <div className="maintenance-form-container">
              <h2>طلب خدمة صيانة أو تركيب</h2>
              <p>املأ النموذج وسنتواصل معك خلال 24 ساعة</p>
              
              <form className="maintenance-form" onSubmit={handleSubmit}>
                <div className="form-section">
                  <h3>المعلومات الشخصية</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>الاسم بالكامل *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>رقم الهاتف *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>البريد الإلكتروني</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>العنوان *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-section">
                  <h3>تفاصيل الخدمة المطلوبة</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>نوع الخدمة *</label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">اختر نوع الخدمة</option>
                        <option value="تركيب">تركيب لمبات وأنظمة إضاءة</option>
                        <option value="صيانة">صيانة مفاتيح وكهرباء منزلية</option>
                        <option value="إصلاح">إصلاح أعطال كهربائية</option>
                        <option value="استشارة">استشارة فنية</option>
                        <option value="أخرى">خدمة أخرى</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>نوع المشكلة</label>
                      <select
                        name="issueType"
                        value={formData.issueType}
                        onChange={handleChange}
                      >
                        <option value="">اختر نوع المشكلة</option>
                        <option value="قص كهرباء">قص مفاجئ في الكهرباء</option>
                        <option value="أعطال مفاتيح">أعطال في المفاتيح</option>
                        <option value="أعطال إضاءة">أعطال في نظام الإضاءة</option>
                        <option value="تركيب جديد">تركيب جديد</option>
                        <option value="أخرى">مشكلة أخرى</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group full-width">
                    <label>وصف المشكلة أو الخدمة المطلوبة *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="صف لنا المشكلة أو الخدمة التي تحتاجها بالتفصيل"
                      required
                    ></textarea>
                  </div>
                </div>
                
                <div className="form-section">
                  <h3>موعد الخدمة</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>التاريخ المفضل</label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>الوقت المفضل</label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                      >
                        <option value="">أي وقت</option>
                        <option value="9:00-12:00">9:00 ص - 12:00 م</option>
                        <option value="12:00-15:00">12:00 م - 3:00 م</option>
                        <option value="15:00-18:00">3:00 م - 6:00 م</option>
                        <option value="18:00-21:00">6:00 م - 9:00 م</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <button type="submit" className="submit-button">إرسال طلب الصيانة</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}