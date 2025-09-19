import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartItem from "../components/CartItem";
import "../styles/cart.css";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(()=> {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const remove = (id) => {
    const updated = cart.filter(i=> i.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const changeQty = (id, qty) => {
    const updated = cart.map(i=> i.id === id ? {...i, quantity: qty} : i);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = cart.length ? 2 : 0;
  const total = subtotal + delivery;

  return (
    <>
      <Navbar />
      <div className="cart-container-page">
        <h2>سلة المشتريات</h2>
        {cart.length === 0 ? <p>السلة فارغة</p> : cart.map(it => (
          <CartItem key={it.id} item={it} onRemove={remove} onChangeQty={changeQty} />
        ))}
        <div className="cart-summary">
          <p>مجموع المنتجات: {subtotal} د.أ</p>
          <p>التوصيل: {delivery} د.أ</p>
          <h3>المجموع النهائي: {total} د.أ</h3>
          <button onClick={() => window.location.href = "/checkout"}>متابعة الدفع</button>
        </div>
      </div>
      <Footer />
    </>
  );
}
