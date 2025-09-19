import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../api/api";
import "../styles/checkout.css";

export default function Checkout() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = cart.length ? 2 : 0;
  const total = subtotal + delivery;

  const [form, setForm] = useState({ name: "", phone: "", address: "", payment: "cod" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) return alert("اكمل البيانات");
    
    // تحقق من بيانات السلة بشكل مفصل
    console.log("=== تحليل بيانات السلة ===");
    console.log("عدد المنتجات:", cart.length);
    
    cart.forEach((item, index) => {
      console.log(`--- المنتج ${index + 1} ---`);
      console.log("البيانات الكاملة:", item);
      console.log("هل يحتوي على _id:", item._id ? `نعم: ${item._id}` : "لا");
      console.log("هل يحتوي على productId:", item.productId ? `نعم: ${item.productId}` : "لا");
      console.log("الاسم:", item.name || "غير معروف");
      console.log("السعر:", item.price);
      console.log("الكمية:", item.quantity);
    });
    
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
      console.log("Sending order:", order);
      await API.post("/orders", order);
      localStorage.removeItem("cart");
      alert("تم إرسال الطلب، سيتواصل معك الفريق");
      window.location.href = "/";
    } catch (err) {
      console.error("Order error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "حدث خطأ أثناء إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="checkout-page">
        <h2>إتمام الطلب</h2>
        <div className="order-summary">
          <p>مجموع المنتجات: {subtotal} د.أ</p>
          <p>التوصيل: {delivery} د.أ</p>
          <h3>المجموع النهائي: {total} د.أ</h3>
        </div>

        <form className="checkout-form" onSubmit={submit}>
          <input placeholder="الاسم الكامل" value={form.name} onChange={(e)=> setForm({...form, name: e.target.value})} />
          <input placeholder="الهاتف" value={form.phone} onChange={(e)=> setForm({...form, phone: e.target.value})} />
          <textarea placeholder="العنوان" value={form.address} onChange={(e)=> setForm({...form, address: e.target.value})} />
          <select value={form.payment} onChange={(e)=> setForm({...form, payment: e.target.value})}>
            <option value="cod">الدفع عند الاستلام</option>
            <option value="bank">التحويل البنكي</option>
          </select>
          <button type="submit" disabled={loading}>{loading ? "جارٍ الإرسال..." : "تأكيد الطلب"}</button>
        </form>
      </div>
      <Footer />
    </>
  );
}