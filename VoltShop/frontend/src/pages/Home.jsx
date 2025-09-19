import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Categories from "../components/Categories";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import API from "../api/api";
import "../styles/home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cat, setCat] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setProducts([]);
    }
  };

  const addToCart = (product, quantity=1) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find(c => c.id === (product._id || product.id));
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        warranty: product.warranty,
        quantity
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("تمت الإضافة للسلة");
  };

  const filtered = cat ? products.filter(p => p.category === cat) : products;

  return (
    <>
      <Navbar />
      <Banner />
      <Categories onSelect={setCat} />
      <main className="home-main">
        <h2>المنتجات المميزة</h2>
        <div className="products-grid">
          {filtered.length === 0 && <p className="info">لا توجد منتجات لعرضها</p>}
          {filtered.map(p => <ProductCard key={p._id || p.id} product={p} onAdd={addToCart} />)}
        </div>
      </main>
      <Footer />
    </>
  );
}
