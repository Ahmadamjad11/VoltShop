import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Categories from "../components/Categories";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import API from "../api/api";
import "../styles/home.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cat, setCat] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(12);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("recent"); // recent | price_asc | price_desc
  const { addItem } = useCart();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  // Sync query and limit/page from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    const lim = parseInt(params.get("per") || params.get("limit") || "12", 10);
    const pg = parseInt(params.get("page") || "1", 10);
    const c = params.get("cat") || "";
    const s = params.get("sort") || "recent";
    setQuery(q);
    setLimit(Number.isNaN(lim) ? 12 : Math.max(1, lim));
    setPage(Number.isNaN(pg) ? 1 : Math.max(1, pg));
    setCat(c);
    setSort(["recent", "price_asc", "price_desc"].includes(s) ? s : "recent");
  }, [location.search]);

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
    addItem(product, quantity);
    showToast('تمت الإضافة للسلة بنجاح!');
  };

  const baseFiltered = cat ? products.filter(p => p.category === cat) : products;
  const queryFiltered = query
    ? baseFiltered.filter(p =>
        (p.name || "").toLowerCase().includes(query.toLowerCase())
      )
    : baseFiltered;
  const sorted = (() => {
    if (sort === 'price_asc') return [...queryFiltered].sort((a,b) => (a.price||0) - (b.price||0));
    if (sort === 'price_desc') return [...queryFiltered].sort((a,b) => (b.price||0) - (a.price||0));
    return queryFiltered; // recent/default
  })();
  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * limit;
  const limited = sorted.slice(startIdx, startIdx + limit);

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
      <Categories onSelect={(c) => {
        const params = new URLSearchParams(location.search);
        if (c) params.set('cat', c); else params.delete('cat');
        navigate({ pathname: '/', search: params.toString() });
      }} />
      
      <main className="home-main">
        <h2>المنتجات المميزة</h2>
        {/* Controls */}
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '0 1.5rem' }}>
          {query && (
            <div style={{ color: '#6b7280' }}>نتائج البحث عن: <strong style={{ color: '#111827' }}>{query}</strong></div>
          )}
          <div style={{ marginRight: 'auto' }}></div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span>عدد العناصر:</span>
            <select
              value={limit}
              onChange={(e) => {
                const newLimit = parseInt(e.target.value, 10);
                const params = new URLSearchParams(location.search);
                params.set('per', String(newLimit));
                params.delete('limit');
                params.set('page', '1');
                navigate({ pathname: '/', search: params.toString() });
              }}
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={18}>18</option>
              <option value={24}>24</option>
            </select>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span>ترتيب:</span>
            <select
              value={sort}
              onChange={(e) => {
                const params = new URLSearchParams(location.search);
                params.set('sort', e.target.value);
                navigate({ pathname: '/', search: params.toString() });
              }}
            >
              <option value="recent">الأحدث</option>
              <option value="price_asc">السعر: من الأقل</option>
              <option value="price_desc">السعر: من الأعلى</option>
            </select>
          </label>
        </div>
        
        {loading ? (
          <div className="products-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="sk-image"></div>
                <div className="sk-title"></div>
                <div className="sk-price"></div>
                <div className="sk-actions"></div>
              </div>
            ))}
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
            {limited.length === 0 ? (
              <div className="info">
                <i className="fas fa-box-open"></i>
                {query
                  ? `لا توجد نتائج للبحث عن "${query}"`
                  : cat
                  ? `لا توجد منتجات في فئة "${cat}"`
                  : "لا توجد منتجات لعرضها"}
              </div>
            ) : (
              limited.map(p => (
                <ProductCard key={p._id || p.id} product={p} onAdd={addToCart} />
              ))
            )}
          </div>
        )}
      </main>

      {/* Toasts handled globally by ToastProvider */}

      {/* Pagination */}
      <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '1rem 1.5rem 2rem' }}>
        <nav className="pagination" aria-label="Pagination">
          <button
            className="page-btn"
            disabled={currentPage <= 1}
            onClick={() => {
              const params = new URLSearchParams(location.search);
              params.set('page', String(Math.max(1, currentPage - 1)));
              navigate({ pathname: '/', search: params.toString() });
            }}
          >
            السابق
          </button>
          <span className="page-status">{currentPage} / {totalPages}</span>
          <button
            className="page-btn"
            disabled={currentPage >= totalPages}
            onClick={() => {
              const params = new URLSearchParams(location.search);
              params.set('page', String(Math.min(totalPages, currentPage + 1)));
              navigate({ pathname: '/', search: params.toString() });
            }}
          >
            التالي
          </button>
        </nav>
      </div>

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
