import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import API from "../api/api";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import "../styles/products.css";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { cat, sub } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showToast } = useToast();

  // URL params
  const category = cat || "";
  const subcategory = sub || "";
  const typeParam = searchParams.get("type") || "";
  const searchQuery = searchParams.get("search") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const limitParam = parseInt(searchParams.get("limit") || "12", 10);
  const sortParam = searchParams.get("sort") || "recent";

  // State
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  });

  // Local filters
  const [selectedType, setSelectedType] = useState(typeParam);
  const [search, setSearch] = useState(searchQuery);
  const [sort, setSort] = useState(sortParam);
  const [limit, setLimit] = useState(limitParam);

  useEffect(() => {
    // جلب المنتجات دائماً إذا كان هناك category
    if (category) {
      fetchProducts();
      // جلب Types فقط إذا كان هناك subcategory
      if (subcategory) {
        fetchTypes();
      }
    } else {
      // إذا لم يكن هناك category، إيقاف loading
      setLoading(false);
    }
  }, [category, subcategory, selectedType, search, pageParam, limit, sort]);

  // Sync URL params with state
  useEffect(() => {
    setSelectedType(typeParam);
    setSearch(searchQuery);
    setSort(sortParam);
    setLimit(limitParam);
  }, [typeParam, searchQuery, sortParam, limitParam]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (subcategory) params.append("subcategory", subcategory);
      if (selectedType) params.append("type", selectedType);
      if (search) params.append("search", search);
      params.append("page", pageParam.toString());
      params.append("limit", limit.toString());
      params.append("sort", sort);

      const res = await API.get(`/products?${params.toString()}`);
      
      // Handle both old format (array) and new format (object with products and pagination)
      if (Array.isArray(res.data)) {
        setProducts(res.data);
        setPagination({
          page: 1,
          limit: res.data.length,
          total: res.data.length,
          totalPages: 1
        });
      } else if (res.data && res.data.products) {
        setProducts(res.data.products || []);
        setPagination(res.data.pagination || {
          page: pageParam,
          limit: limitParam,
          total: res.data.products.length,
          totalPages: 1
        });
      } else {
        setProducts([]);
        setPagination({
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 1
        });
      }
    } catch (err) {
      console.error(err);
      setError("فشل في تحميل المنتجات");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTypes = async () => {
    try {
      const params = new URLSearchParams();
      params.append("category", category);
      params.append("subcategory", subcategory);
      const res = await API.get(`/products/types?${params.toString()}`);
      setTypes(res.data);
    } catch (err) {
      console.error(err);
      setTypes([]);
    }
  };

  const updateURL = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    // Reset to page 1 when filters change
    if (updates.type !== undefined || updates.search !== undefined || updates.sort !== undefined || updates.limit !== undefined) {
      newParams.set("page", "1");
    }
    setSearchParams(newParams);
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setSelectedType(newType);
    updateURL({ type: newType });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateURL({ search: search });
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSort(newSort);
    updateURL({ sort: newSort });
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    updateURL({ limit: newLimit.toString() });
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product, quantity = 1) => {
    addItem(product, quantity);
    showToast('تمت الإضافة للسلة بنجاح!');
  };

  const handleBack = () => {
    if (subcategory && category) {
      navigate(`/subcategories/${encodeURIComponent(category)}`);
    } else {
      navigate("/");
    }
  };

  // لا نعيد التوجيه تلقائياً - نعرض رسالة بدلاً من ذلك

  return (
    <>
      <Navbar />
      <main className="products-main">
        <div className="container">
          {/* Header */}
          <div className="products-header">
            <button onClick={handleBack} className="back-btn">
              <i className="fas fa-arrow-right"></i>
              رجوع
            </button>
            <div className="header-content">
              <h1>
                {category || "المنتجات"}
                {subcategory && ` - ${subcategory}`}
              </h1>
              <p>عرض جميع المنتجات</p>
            </div>
          </div>

          {/* Filters Section */}
          <div className="filters-section">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={search}
                onChange={handleSearchChange}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <i className="fas fa-search"></i>
              </button>
            </form>

            {/* Type Filter */}
            {types.length > 0 && (
              <div className="filter-group">
                <label>
                  <i className="fas fa-filter"></i>
                  نوع المنتج:
                </label>
                <select value={selectedType} onChange={handleTypeChange} className="filter-select">
                  <option value="">الكل</option>
                  {types.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort */}
            <div className="filter-group">
              <label>
                <i className="fas fa-sort"></i>
                الترتيب:
              </label>
              <select value={sort} onChange={handleSortChange} className="filter-select">
                <option value="recent">الأحدث</option>
                <option value="price_asc">السعر: من الأقل</option>
                <option value="price_desc">السعر: من الأعلى</option>
              </select>
            </div>

            {/* Limit */}
            <div className="filter-group">
              <label>
                <i className="fas fa-list"></i>
                عدد العناصر:
              </label>
              <select value={limit} onChange={handleLimitChange} className="filter-select">
                <option value="6">6</option>
                <option value="12">12</option>
                <option value="18">18</option>
                <option value="24">24</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="products-grid">
              {Array.from({ length: limit }).map((_, i) => (
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
          ) : !category ? (
            <div className="empty-state">
              <i className="fas fa-exclamation-circle"></i>
              <p>يرجى اختيار فئة وماركة لعرض المنتجات</p>
              <button onClick={() => navigate("/")} className="btn-primary" style={{ marginTop: '1rem' }}>
                <i className="fas fa-home"></i>
                العودة للصفحة الرئيسية
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-box-open"></i>
              <p>
                {search
                  ? `لا توجد نتائج للبحث عن "${search}"`
                  : selectedType
                  ? `لا توجد منتجات من نوع "${selectedType}"`
                  : "لا توجد منتجات لعرضها"}
              </p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map((p) => (
                  <ProductCard key={p._id || p.id} product={p} onAdd={addToCart} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination-container">
                  <nav className="pagination" aria-label="Pagination">
                    <button
                      className="page-btn"
                      disabled={pagination.page <= 1}
                      onClick={() => handlePageChange(pagination.page - 1)}
                    >
                      <i className="fas fa-chevron-right"></i>
                      السابق
                    </button>
                    <span className="page-status">
                      صفحة {pagination.page} من {pagination.totalPages}
                      <span className="total-items"> ({pagination.total} منتج)</span>
                    </span>
                    <button
                      className="page-btn"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => handlePageChange(pagination.page + 1)}
                    >
                      التالي
                      <i className="fas fa-chevron-left"></i>
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

