import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartItem from "../components/CartItem";
import "../styles/cart.css";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const remove = (id) => {
    const updated = cart.filter(i => i.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const changeQty = (id, qty) => {
    if (qty < 1) return;
    const updated = cart.map(i => i.id === id ? { ...i, quantity: qty } : i);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = cart.length ? 2 : 0;
  const total = subtotal + delivery;

  if (cart.length === 0) {
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
          {cart.map(it => (
            <CartItem key={it.id} item={it} onRemove={remove} onChangeQty={changeQty} />
          ))}
        </div>
        
        <div className="cart-summary">
          <h3>ملخص الطلب</h3>
          <div className="summary-row">
            <span className="summary-label">مجموع المنتجات:</span>
            <span className="summary-value">{subtotal} د.أ</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">رسوم التوصيل:</span>
            <span className="summary-value">{delivery} د.أ</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">المجموع النهائي:</span>
            <span className="summary-value">{total} د.أ</span>
          </div>
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
