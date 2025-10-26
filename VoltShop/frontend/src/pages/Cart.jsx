import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartItem from "../components/CartItem";
import "../styles/cart.css";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, updateQty, removeItem, subtotal, shipping, total, FREE_SHIPPING_THRESHOLD } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="cart-container-page">
          <h2>سلة المشتريات</h2>
          <div className="empty-cart">
            <i className="fas fa-shopping-cart"></i>
            <h3>سلة المشتريات فارغة</h3>
            <p>لم تقم بإضافة أي منتجات إلى السلة بعد</p>
            <Link to="/">
              <button>
                <i className="fas fa-shopping-bag"></i>
                ابدأ التسوق
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
      <div className="cart-container-page">
        <h2>سلة المشتريات</h2>
        
        <div className="cart-items">
          {items.map(it => (
            <CartItem key={it.id} item={it} onRemove={removeItem} onChangeQty={updateQty} />
          ))}
        </div>
        
        <div className="cart-summary">
          <h3>ملخص الطلب</h3>
          <div className="summary-row">
            <span className="summary-label">مجموع المنتجات:</span>
            <span className="summary-value">{subtotal.toFixed(2)} د.أ</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">رسوم التوصيل:</span>
            <span className="summary-value">{shipping === 0 ? `مجاني (فوق ${FREE_SHIPPING_THRESHOLD} د.أ)` : `${shipping.toFixed(2)} د.أ`}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">المجموع النهائي:</span>
            <span className="summary-value">{total.toFixed(2)} د.أ</span>
          </div>
          {subtotal < FREE_SHIPPING_THRESHOLD && (
            <div className="info" style={{ marginTop: '.5rem' }}>
              أضف { (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2) } د.أ لتحصل على الشحن المجاني
            </div>
          )}
          <Link to="/checkout">
            <button className="checkout-btn">
              <i className="fas fa-credit-card"></i>
              متابعة الدفع
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
