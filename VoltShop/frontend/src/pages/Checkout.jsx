import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../api/api";
import "../styles/checkout.css";

export default function Checkout() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = cart.length ? 2 : 0;
  const total = subtotal + delivery;

  const [form, setForm] = useState({ 
    name: "", 
    phone: "", 
    address: "", 
    payment: "cod" 
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      alert("يرجى إكمال جميع البيانات المطلوبة");
      return;
    }
    
    const order = {
      items: cart,
      customer: {
        name: form.name,
        phone: form.phone,
        address: form.address,
        payment: form.payment
      },
      total,
      delivery
    };
    
    try {
      setLoading(true);
      await API.post("/orders", order);
      localStorage.removeItem("cart");
      alert("تم إرسال الطلب بنجاح! سيتواصل معك فريقنا قريباً");
      window.location.href = "/";
    } catch (err) {
      console.error("Order error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "حدث خطأ أثناء إرسال الطلب");
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
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">رقم الهاتف *</label>
              <input 
                id="phone"
                type="tel" 
                placeholder="أدخل رقم هاتفك" 
                value={form.phone} 
                onChange={(e) => setForm({...form, phone: e.target.value})}
                required
              />
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
                  <div className="order-item-price">{item.price * item.quantity} د.أ</div>
                </div>
              ))}
            </div>
            
            <div className="summary-item">
              <span className="summary-label">مجموع المنتجات:</span>
              <span className="summary-value">{subtotal} د.أ</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">رسوم التوصيل:</span>
              <span className="summary-value">{delivery} د.أ</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">المجموع النهائي:</span>
              <span className="summary-value">{total} د.أ</span>
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