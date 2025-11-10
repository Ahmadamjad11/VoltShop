import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../api/api";
import "../styles/subcategories.css";

export default function Subcategories() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (category) {
      fetchSubcategories();
    }
  }, [category]);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      setError(null);
      // استخدام /subcategories للحصول على بيانات كاملة مع الصور
      const res = await API.get(`/subcategories?category=${encodeURIComponent(category)}`);
      
      // إذا كانت البيانات من Subcategory Model (objects)
      if (res.data && res.data.length > 0 && typeof res.data[0] === 'object') {
        setSubcategories(res.data);
      } else {
        // إذا كانت strings فقط (من products/subcategories)
        setSubcategories(res.data.map(name => ({ name, image: "" })));
      }
    } catch (err) {
      console.error(err);
      // Fallback: جرب products/subcategories
      try {
        const fallbackRes = await API.get(`/products/subcategories?category=${encodeURIComponent(category)}`);
        setSubcategories(fallbackRes.data.map(name => ({ name, image: "" })));
      } catch (fallbackErr) {
        setError("فشل في تحميل الماركات");
        setSubcategories([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // العودة إلى الصفحة السابقة (CategoryPage)
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="subcategories-main">
          <div className="container">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>جاري تحميل الماركات...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="subcategories-main">
          <div className="container">
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
              <button onClick={fetchSubcategories} className="btn-primary" style={{ marginTop: '1rem' }}>
                <i className="fas fa-refresh"></i>
                إعادة المحاولة
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="subcategories-main">
        <div className="container">
          {/* Header with back button */}
          <div className="subcategories-header">
            <button onClick={handleBack} className="back-btn">
              <i className="fas fa-arrow-right"></i>
              رجوع
            </button>
            <h1>{category}</h1>
            <p>اختر الماركة التي تريدها</p>
          </div>

          {/* Subcategories Grid */}
          {subcategories.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-box-open"></i>
              <p>لا توجد ماركات متاحة في هذه الفئة</p>
            </div>
          ) : (
            <div className="subcategories-grid">
              {subcategories.map((sub, index) => {
                const subName = typeof sub === 'string' ? sub : sub.name;
                const subImage = typeof sub === 'object' && sub.image ? sub.image : null;
                const cleanCategory = category.trim();
                const cleanSubcategory = subName.trim();
                const productsUrl = `/products/${encodeURIComponent(cleanCategory)}/${encodeURIComponent(cleanSubcategory)}`;
                
                return (
                  <Link
                    key={index}
                    to={productsUrl}
                    className="subcategory-card"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {subImage ? (
                      <div className="subcategory-image">
                        <img src={subImage} alt={subName} />
                      </div>
                    ) : (
                      <div className="subcategory-icon">
                        <i className="fas fa-tag"></i>
                      </div>
                    )}
                    <h3>{subName}</h3>
                    <p>عرض المنتجات</p>
                    <i className="fas fa-arrow-left subcategory-arrow"></i>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

