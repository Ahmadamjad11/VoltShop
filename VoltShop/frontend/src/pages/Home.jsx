import React from "react";
import Navbar from "../components/Navbar";
import Categories from "../components/Categories";
import Footer from "../components/Footer";
import "../styles/home.css";

export default function Home() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>مرحباً بك في فولت شوب</h1>
          <p>متجرك الأول للأجهزة الكهربائية والإلكترونية عالية الجودة</p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => document.querySelector('.categories-grid')?.scrollIntoView({ behavior: 'smooth' })}>
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

      {/* Categories Section */}
      <main className="home-main">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem', fontWeight: '700', color: '#111827' }}>
            اختر الفئة التي تريدها
          </h2>
          <Categories />
        </div>
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
