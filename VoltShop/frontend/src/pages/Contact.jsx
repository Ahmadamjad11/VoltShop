import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/contact.css";
import API from "../api/api";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sentData, setSentData] = useState(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    phone: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Validate name (must be two words)
    if (!form.name.trim() || form.name.trim().split(' ').length < 2) {
      errors.name = 'الرجاء إدخال الاسم الكامل (الاسم الأول واسم العائلة)';
      isValid = false;
    } else {
      errors.name = '';
    }

    // Validate phone number (10 digits starting with 07)
    const phoneRegex = /^07\d{8}$/;
    if (!form.phone) {
      errors.phone = 'يرجى إدخال رقم الهاتف';
      isValid = false;
    } else if (!phoneRegex.test(form.phone)) {
      errors.phone = 'رقم الهاتف يجب أن يبدأ بـ 07 ويكون 10 أرقام';
      isValid = false;
    } else {
      errors.phone = '';
    }

    setFieldErrors(errors);
    return isValid;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // stop submission if validation fails
    }

    setLoading(true);
    setError("");

    try {
      const contactData = { ...form };
      const response = await API.post("/contacts", contactData);

      setSentData(response.data.data || contactData);
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });

      // success popup
      const message = document.createElement("div");
      message.className = "success-message";
      message.textContent = "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.";
      message.style.cssText = `
        position: fixed; top: 100px; right: 20px; z-index: 9999;
        background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a;
        padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      `;
      document.body.appendChild(message);

      setTimeout(() => {
        if (document.body.contains(message)) {
          document.body.removeChild(message);
        }
      }, 3000);
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message ||
        "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <div className="contact-page">
          <div className="contact-hero">
            <div className="hero-content">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h1>شكراً لتواصلك معنا!</h1>
              <p>تم استلام رسالتك بنجاح، وسنتواصل معك في أقرب وقت ممكن.</p>
              <div className="success-details">
                <p>
                  <strong>رقم الرسالة:</strong> #
                  {sentData?._id || Date.now().toString().slice(-6)}
                </p>
                <p>
                  <strong>المرسل:</strong> {sentData?.name}
                </p>
                <p>
                  <strong>الموضوع:</strong> {sentData?.subject}
                </p>
                <p>
                  <strong>وقت الإرسال:</strong>{" "}
                  {new Date().toLocaleString("ar-EG")}
                </p>
              </div>
              <div className="success-actions">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setSentData(null);
                  }}
                  className="btn-primary"
                >
                  <i className="fas fa-plus"></i>
                  إرسال رسالة أخرى
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="btn-outline"
                >
                  <i className="fas fa-home"></i>
                  العودة للرئيسية
                </button>
              </div>
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
      <div className="contact-page">
        <div className="contact-hero">
          <div className="hero-content">
            <h1>تواصل معنا</h1>
            <p>نحن هنا لمساعدتك في جميع احتياجاتك الكهربائية</p>
            <div className="hero-features">
              <div className="hero-feature">
                <i className="fas fa-headset"></i>
                <span>دعم فني 24/7</span>
              </div>
              <div className="hero-feature">
                <i className="fas fa-clock"></i>
                <span>رد سريع خلال ساعة</span>
              </div>
              <div className="hero-feature">
                <i className="fas fa-shield-alt"></i>
                <span>معلوماتك آمنة</span>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-container">
          <div className="contact-content">
            {/* معلومات التواصل */}
            <div className="contact-info">
              <h2>معلومات التواصل</h2>
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon"><i className="fas fa-phone"></i></div>
                  <div className="method-content">
                    <h3>اتصل بنا</h3>
                    <p>+962797812733</p>
                    <p>+962791021454</p>
                    <small>متاح من 8 صباحاً إلى 8 مساءً</small>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="method-icon"><i className="fas fa-envelope"></i></div>
                  <div className="method-content">
                    <h3>راسلنا</h3>
                    <p>vvoltshop2025@gmail.com</p>
                    <p>ahmadtoubeh45@gmail.com</p>
                    <small>نرد خلال أقل من ساعة</small>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="method-icon"><i className="fas fa-map-marker-alt"></i></div>
                  <div className="method-content">
                    <h3>زيارتنا</h3>
                    <p>حي نزال</p>
                    <small>من السبت إلى الخميس</small>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="method-icon"><i className="fas fa-clock"></i></div>
                  <div className="method-content">
                    <h3>ساعات العمل</h3>
                    <p>السبت - الخميس: 8:00 ص - 8:00 م</p>
                    <small>خدمة العملاء متاحة دائماً</small>
                  </div>
                </div>
              </div>

              {/* الأسئلة الشائعة */}
              <div className="faq-section">
                <h3>الأسئلة الشائعة</h3>
                <div className="faq-list">
                  <div className="faq-item">
                    <h4>كم يستغرق التسليم؟</h4>
                    <p>التسليم خلال أقل من ساعة خلال أيام العمل.</p>
                  </div>
                  <div className="faq-item">
                    <h4>هل تقدمون خدمة التركيب؟</h4>
                    <p>نعم، نقدم خدمة التركيب والصيانة بفنيين متخصصين.</p>
                  </div>
                  <div className="faq-item">
                    <h4>ما هي سياسة الاسترداد؟</h4>
                    <p>يمكن استرداد المنتجات خلال 14 يوماً من الشراء بشرط عدم الاستخدام.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* الفورم */}
            <div className="contact-form-container">
              <div className="form-header">
                <h2>أرسل لنا رسالة</h2>
                <p>املأ النموذج وسنتواصل معك خلال 24 ساعة</p>
              </div>

              {error && (
                <div className="error-message">
                  <i className="fas fa-exclamation-triangle"></i>
                  {error}
                </div>
              )}

              <form className="contact-form" onSubmit={submit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-user"></i>
                      الاسم بالكامل *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className={fieldErrors.name ? 'error-input' : ''}
                      placeholder="الاسم الأول واسم العائلة"
                      required
                      disabled={loading}
                    />
                    {fieldErrors.name && <div className="error-message">{fieldErrors.name}</div>}
                  </div>
                  <div className="form-group">
                    <label>
                      <i className="fas fa-envelope"></i>
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="أدخل بريدك الإلكتروني"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-phone"></i>
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className={fieldErrors.phone ? 'error-input' : ''}
                      placeholder="أدخل رقم هاتفك"
                      disabled={loading}
                    />
                    {fieldErrors.phone && <div className="error-message">{fieldErrors.phone}</div>}
                  </div>
                  <div className="form-group">
                    <label>
                      <i className="fas fa-tag"></i>
                      موضوع الرسالة *
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="">اختر موضوع الرسالة</option>
                      <option value="استفسار عام">استفسار عام</option>
                      <option value="مشكلة في الطلب">مشكلة في الطلب</option>
                      <option value="طلب خدمة">طلب خدمة تركيب/صيانة</option>
                      <option value="شكوى">شكوى</option>
                      <option value="اقتراح">اقتراح</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-comment"></i>
                    الرسالة *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows="6"
                    placeholder="اكتب رسالتك هنا..."
                    required
                    disabled={loading}
                  ></textarea>
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> إرسال الرسالة
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
