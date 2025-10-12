import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../api/api";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // إرسال طلب الخدمة إلى الباك إند
      const serviceRequest = {
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      await API.post("/services", serviceRequest);
      
      // Show success message
      const message = document.createElement('div');
      message.className = 'success-message';
      message.textContent = 'تم إرسال طلب الخدمة بنجاح!';
      message.style.position = 'fixed';
      message.style.top = '100px';
      message.style.right = '20px';
      message.style.zIndex = '9999';
      message.style.background = '#f0fdf4';
      message.style.border = '1px solid #bbf7d0';
      message.style.color = '#16a34a';
      message.style.padding = '1rem';
      message.style.borderRadius = '0.5rem';
      message.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
      document.body.appendChild(message);
      
      setTimeout(() => {
        if (document.body.contains(message)) {
          document.body.removeChild(message);
        }
      }, 3000);

      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting service request:", err);
      setError("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <div className="services-page">
          <div className="success-message">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>شكراً لتواصلك معنا!</h2>
            <p>تم استلام طلب الخدمة بنجاح، وسنتواصل معك في أقرب وقت لتأكيد الموعد.</p>
            <div className="success-details">
              <p><strong>رقم الطلب:</strong> #{Date.now().toString().slice(-6)}</p>
              <p><strong>نوع الخدمة:</strong> {formData.serviceType}</p>
              <p><strong>التاريخ المفضل:</strong> {formData.preferredDate || "سيتم الاتفاق عليه"}</p>
            </div>
            <div className="success-actions">
              <button onClick={() => setSubmitted(false)} className="btn-primary">
                <i className="fas fa-plus"></i>
                طلب خدمة أخرى
              </button>
              <button onClick={() => window.location.href = "/"} className="btn-outline">
                <i className="fas fa-home"></i>
                العودة للرئيسية
              </button>
            </div>
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
          <div className="hero-content">
            <h1>خدمات الصيانة والتركيب</h1>
            <p>نقدم خدمات الصيانة والتركيب الاحترافية للأنظمة الكهربائية والمنزلية</p>
            <div className="hero-features">
              <div className="hero-feature">
                <i className="fas fa-tools"></i>
                <span>فنيون متخصصون</span>
              </div>
              <div className="hero-feature">
                <i className="fas fa-clock"></i>
                <span>خدمة 24/7</span>
              </div>
              <div className="hero-feature">
                <i className="fas fa-shield-alt"></i>
                <span>ضمان على العمل</span>
              </div>
            </div>
          </div>
        </div>

        <div className="services-container">
          <div className="services-content">
            <div className="services-info">
              <h2>لماذا تختار خدمتنا؟</h2>
              <div className="features-grid">
                <div className="feature">
                  <div className="feature-icon">
                    <i className="fas fa-user-tie"></i>
                  </div>
                  <h3>فنيون متخصصون</h3>
                  <p>فنيون مؤهلون وذوو خبرة في جميع أنواع التركيبات الكهربائية</p>
                </div>
                <div className="feature">
                  <div className="feature-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <h3>خدمة سريعة</h3>
                  <p>خدمة متاحة على مدار الأسبوع وحلول سريعة لأعطال الكهرباء</p>
                </div>
                <div className="feature">
                  <div className="feature-icon">
                    <i className="fas fa-cogs"></i>
                  </div>
                  <h3>قطع غيار أصلية</h3>
                  <p>نستخدم قطع غيار أصلية متوفرة في متجرنا لضمان الجودة</p>
                </div>
                <div className="feature">
                  <div className="feature-icon">
                    <i className="fas fa-award"></i>
                  </div>
                  <h3>ضمان على العمل</h3>
                  <p>نوفر ضماناً على خدمات الصيانة والتركيب لمدة 6 أشهر</p>
                </div>
              </div>

              <div className="services-types">
                <h3>أنواع الخدمات التي نقدمها:</h3>
                <div className="services-list">
                  <div className="service-item">
                    <i className="fas fa-lightbulb"></i>
                    <div>
                      <h4>تركيب الإضاءة</h4>
                      <p>تركيب لمبات LED، أنظمة إضاءة ذكية، وإضاءة خارجية</p>
                    </div>
                  </div>
                  <div className="service-item">
                    <i className="fas fa-plug"></i>
                    <div>
                      <h4>تركيب المفاتيح والأفياش</h4>
                      <p>تركيب مفاتيح كهربائية، أفياش، ومفاتيح ذكية</p>
                    </div>
                  </div>
                  <div className="service-item">
                    <i className="fas fa-tools"></i>
                    <div>
                      <h4>صيانة وإصلاح</h4>
                      <p>إصلاح الأعطال الكهربائية وصيانة الأنظمة الموجودة</p>
                    </div>
                  </div>
                  <div className="service-item">
                    <i className="fas fa-home"></i>
                    <div>
                      <h4>تركيبات منزلية</h4>
                      <p>تركيب أنظمة كهربائية كاملة للمنازل الجديدة</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="maintenance-form-container">
              <div className="form-header">
                <h2>طلب خدمة صيانة أو تركيب</h2>
                <p>املأ النموذج وسنتواصل معك خلال 24 ساعة</p>
              </div>
              
              {error && (
                <div className="error-message">
                  <i className="fas fa-exclamation-triangle"></i>
                  {error}
                </div>
              )}
              
              <form className="maintenance-form" onSubmit={handleSubmit}>
                <div className="form-section">
                  <h3>
                    <i className="fas fa-user"></i>
                    المعلومات الشخصية
                  </h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <i className="fas fa-user"></i>
                        الاسم بالكامل *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="أدخل اسمك الكامل"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <i className="fas fa-phone"></i>
                        رقم الهاتف *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="أدخل رقم هاتفك"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <i className="fas fa-envelope"></i>
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="أدخل بريدك الإلكتروني"
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <i className="fas fa-map-marker-alt"></i>
                        العنوان *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="أدخل عنوانك بالتفصيل"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-section">
                  <h3>
                    <i className="fas fa-tools"></i>
                    تفاصيل الخدمة المطلوبة
                  </h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <i className="fas fa-list"></i>
                        نوع الخدمة *
                      </label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        required
                        disabled={loading}
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
                      <label>
                        <i className="fas fa-exclamation-triangle"></i>
                        نوع المشكلة
                      </label>
                      <select
                        name="issueType"
                        value={formData.issueType}
                        onChange={handleChange}
                        disabled={loading}
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
                    <label>
                      <i className="fas fa-comment"></i>
                      وصف المشكلة أو الخدمة المطلوبة *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="صف لنا المشكلة أو الخدمة التي تحتاجها بالتفصيل"
                      required
                      disabled={loading}
                    ></textarea>
                  </div>
                </div>
                
                <div className="form-section">
                  <h3>
                    <i className="fas fa-calendar"></i>
                    موعد الخدمة
                  </h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <i className="fas fa-calendar-day"></i>
                        التاريخ المفضل
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <i className="fas fa-clock"></i>
                        الوقت المفضل
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        disabled={loading}
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
                
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      إرسال طلب الخدمة
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}