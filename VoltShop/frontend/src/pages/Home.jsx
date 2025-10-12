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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError("فشل في تحميل المنتجات");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product, quantity = 1) => {
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
    
    // Show success message
    const message = document.createElement('div');
    message.className = 'success-message';
    message.textContent = 'تمت الإضافة للسلة بنجاح!';
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
  };

  const filtered = cat ? products.filter(p => p.category === cat) : products;

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>مرحباً بك في فولت شوب</h1>
          <p>متجرك الأول للأجهزة الكهربائية والإلكترونية عالية الجودة</p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => document.querySelector('.products-grid')?.scrollIntoView({ behavior: 'smooth' })}>
              <i className="fas fa-shopping-bag"></i>
              تسوق الآن
            </button>
            <button className="btn-outline" onClick={() => document.querySelector('.features-section')?.scrollIntoView({ behavior: 'smooth' })}>
              <i className="fas fa-info-circle"></i>
              اعرف المزيد
            </button>
          </div>
        </div>
      </section>

      <Banner />
      <Categories onSelect={setCat} />
      
      <main className="home-main">
        <h2>المنتجات المميزة</h2>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>جاري تحميل المنتجات...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
            <button onClick={fetchProducts} className="btn-primary" style={{ marginTop: '1rem' }}>
              <i className="fas fa-refresh"></i>
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.length === 0 ? (
              <div className="info">
                <i className="fas fa-box-open"></i>
                {cat ? `لا توجد منتجات في فئة "${cat}"` : "لا توجد منتجات لعرضها"}
              </div>
            ) : (
              filtered.map(p => (
                <ProductCard key={p._id || p.id} product={p} onAdd={addToCart} />
              ))
            )}
          </div>
        )}
      </main>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>لماذا تختار فولت شوب؟</h2>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-shipping-fast"></i>
              <h3>توصيل سريع</h3>
              <p>نوصل طلبك خلال 24 ساعة في جميع أنحاء المملكة</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-shield-alt"></i>
              <h3>ضمان شامل</h3>
              <p>جميع منتجاتنا مضمونة بضمان شامل من الشركة المصنعة</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-tools"></i>
              <h3>خدمة التركيب</h3>
              <p>نقدم خدمة التركيب والصيانة من قبل فنيين متخصصين</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-headset"></i>
              <h3>دعم فني</h3>
              <p>فريق دعم فني متاح على مدار الساعة لمساعدتك</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
