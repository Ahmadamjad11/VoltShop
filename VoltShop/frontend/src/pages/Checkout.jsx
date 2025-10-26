import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../api/api";
import "../styles/checkout.css";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Checkout() {
  const { items: cart, subtotal, shipping: delivery, total, clear } = useCart();
  const { showToast } = useToast();

  const [form, setForm] = useState({ 
    name: "", 
    phone: "", 
    address: "", 
    payment: "cod" 
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", phone: "" });
  const [locationState, setLocationState] = useState({ lat: null, lng: null, fetching: false, label: "" });

  // Use browser geolocation to capture user's current coordinates
  const useMyLocation = () => {
    if (!('geolocation' in navigator)) {
      showToast("المتصفح لا يدعم تحديد الموقع", "error");
      return;
    }
    setLocationState((s) => ({ ...s, fetching: true }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocationState({ lat: latitude, lng: longitude, fetching: false, label: "" });
        const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setForm((f) => ({ ...f, address: f.address ? `${f.address}\n${link}` : link }));
        // Reverse geocode to human-readable Arabic place name
        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=ar&lat=${latitude}&lon=${longitude}`;
          fetch(url)
            .then((r) => r.json())
            .then((data) => {
              const a = data.address || {};
              const parts = [a.suburb, a.neighbourhood, a.road, a.city || a.town || a.village, a.state, a.country]
                .filter(Boolean)
                .slice(0, 4);
              const label = parts.join("، ");
              if (label) {
                setLocationState((s) => ({ ...s, label }));
                setForm((f) => ({ ...f, address: f.address ? `${f.address}\n${label}` : label }));
              }
            })
            .catch(() => {});
        } catch {}
        showToast("تم تحديد موقعك بنجاح");
      },
      (err) => {
        setLocationState((s) => ({ ...s, fetching: false }));
        const msg = err.code === 1
          ? "تم رفض الإذن بالوصول للموقع"
          : err.code === 2
          ? "تعذر تحديد الموقع حالياً"
          : "حدث خطأ أثناء تحديد الموقع";
        showToast(msg, "error");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    // basic required
    if (!form.name || !form.phone || !form.address) {
      showToast("يرجى إكمال جميع البيانات المطلوبة", "error");
      return;
    }

    // field validations
    let nameErr = "";
    let phoneErr = "";
    const nameParts = form.name.trim().split(/\s+/);
    if (nameParts.length < 2) nameErr = "الاسم يجب أن يتكون من مقطعين على الأقل";
    const phoneOk = /^079\d{7}$/.test(form.phone.trim());
    if (!phoneOk) phoneErr = "رقم الهاتف يجب أن يكون 10 خانات ويبدأ بـ 079";
    if (nameErr || phoneErr) {
      setErrors({ name: nameErr, phone: phoneErr });
      showToast(phoneErr || nameErr, "error");
      // focus first invalid
      setTimeout(() => {
        if (nameErr) document.getElementById('name')?.focus();
        else if (phoneErr) document.getElementById('phone')?.focus();
      }, 0);
      return;
    }
    setErrors({ name: "", phone: "" });
    
    const order = {
      items: cart,
      customer: {
        name: form.name,
        phone: form.phone,
        address: form.address,
        payment: form.payment
      },
      location: locationState.lat && locationState.lng ? { lat: locationState.lat, lng: locationState.lng, label: locationState.label } : undefined,
      total,
      delivery
    };

    try {
      setLoading(true);
      await API.post("/orders", order);
      clear();
      showToast("تم إرسال الطلب بنجاح! سيتواصل معك فريقنا قريباً");
      setTimeout(() => { window.location.href = "/"; }, 1200);
    } catch (err) {
      console.error("Order error:", err.response?.data || err.message);
      showToast(err.response?.data?.message || "حدث خطأ أثناء إرسال الطلب", "error");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="checkout-page">
          <h2>إتمام الطلب</h2>
          <div className="empty-cart">
            <i className="fas fa-shopping-cart"></i>
            <h3>لا توجد منتجات في السلة</h3>
            <p>يرجى إضافة منتجات إلى السلة قبل المتابعة</p>
            <Link to="/">
              <button className="btn-primary">
                <i className="fas fa-shopping-bag"></i>
                العودة للتسوق
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="checkout-page">
        <h2>إتمام الطلب</h2>
        
        <div className="checkout-content">
          <form className="checkout-form" onSubmit={submit}>
            <h3>معلومات الطلب</h3>
            
            <div className="form-group">
              <label htmlFor="name">الاسم الكامل *</label>
              <input 
                id="name"
                type="text" 
                placeholder="أدخل اسمك الكامل" 
                value={form.name} 
                onChange={(e) => setForm({...form, name: e.target.value})}
                onBlur={() => {
                  const ok = form.name.trim().split(/\s+/).length >= 2;
                  setErrors((er) => ({ ...er, name: ok ? "" : "الاسم يجب أن يتكون من مقطعين على الأقل" }));
                }}
                required
              />
              {errors.name && <div className="field-error" id="name-error">{errors.name}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">رقم الهاتف *</label>
              <input 
                id="phone"
                type="tel" 
                placeholder="أدخل رقم هاتفك" 
                value={form.phone} 
                onChange={(e) => setForm({...form, phone: e.target.value})}
                pattern="079\d{7}"
                title="رقم الهاتف يجب أن يكون 10 خانات ويبدأ بـ 079"
                onBlur={() => {
                  const ok = /^079\d{7}$/.test(form.phone.trim());
                  setErrors((er) => ({ ...er, phone: ok ? "" : "رقم الهاتف يجب أن يكون 10 خانات ويبدأ بـ 079" }));
                }}
                required
              />
              {errors.phone && <div className="field-error" id="phone-error">{errors.phone}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="address">العنوان التفصيلي *</label>
              <textarea 
                id="address"
                placeholder="أدخل عنوانك التفصيلي مع رقم المبنى والشارع والحي" 
                value={form.address} 
                onChange={(e) => setForm({...form, address: e.target.value})}
                required
              />
              <div className="inline-actions">
                <button type="button" className="btn-outline" onClick={useMyLocation} disabled={locationState.fetching}>
                  <i className="fas fa-location-crosshairs"></i>
                  {locationState.fetching ? "جاري تحديد الموقع..." : "استخدم موقعي الآن"}
                </button>
                {locationState.lat && locationState.lng && (
                  <a
                    href={`https://www.google.com/maps?q=${locationState.lat},${locationState.lng}`}
                    target="_blank" rel="noreferrer"
                    className="map-link"
                    title="فتح الموقع على الخريطة"
                  >
                    تمت إضافة موقعك (فتح الخريطة)
                  </a>
                )}
                {locationState.label && (
                  <span style={{ color: '#6b7280', fontSize: '.9rem' }}> — {locationState.label}</span>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label>طريقة الدفع</label>
              <div className="payment-methods">
                <div className="payment-option">
                  <input 
                    type="radio" 
                    id="cod" 
                    name="payment" 
                    value="cod" 
                    checked={form.payment === "cod"}
                    onChange={(e) => setForm({...form, payment: e.target.value})}
                  />
                  <label htmlFor="cod">
                    <i className="fas fa-hand-holding-usd"></i>
                    الدفع عند الاستلام
                  </label>
                </div>
                <div className="payment-option">
                  <input 
                    type="radio" 
                    id="bank" 
                    name="payment" 
                    value="bank" 
                    checked={form.payment === "bank"}
                    onChange={(e) => setForm({...form, payment: e.target.value})}
                  />
                  <label htmlFor="bank">
                    <i className="fas fa-university"></i>
                    التحويل البنكي
                  </label>
                </div>
              </div>
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner loading"></i>
                  جارٍ الإرسال...
                </>
              ) : (
                <>
                  <i className="fas fa-check"></i>
                  تأكيد الطلب
                </>
              )}
            </button>
          </form>

          <div className="order-summary">
            <h3>ملخص الطلب</h3>
            
            <div className="order-items">
              {cart.map(item => (
                <div key={item.id} className="order-item">
                  <img src={item.image || "/placeholder.png"} alt={item.name} />
                  <div className="order-item-info">
                    <h4>{item.name}</h4>
                    <p>الكمية: {item.quantity}</p>
                  </div>
                  <div className="order-item-price">{(item.price * item.quantity).toFixed(2)} د.أ</div>
                </div>
              ))}
            </div>
            
            <div className="summary-item">
              <span className="summary-label">مجموع المنتجات:</span>
              <span className="summary-value">{subtotal.toFixed(2)} د.أ</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">رسوم التوصيل:</span>
              <span className="summary-value">{delivery === 0 ? `مجاني (فوق 50 د.أ)` : `${delivery.toFixed(2)} د.أ`}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">المجموع النهائي:</span>
              <span className="summary-value">{total.toFixed(2)} د.أ</span>
            </div>
            
            <div className="security-badges">
              <div className="security-badge">
                <i className="fas fa-shield-alt"></i>
                <span>آمن ومضمون</span>
              </div>
              <div className="security-badge">
                <i className="fas fa-truck"></i>
                <span>توصيل سريع</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}