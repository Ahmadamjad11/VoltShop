import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import "../styles/admin.css";

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ 
    name: "", 
    price: "", 
    image: "", 
    category: "", 
    rating: "", 
    warranty: "",
    stock: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { 
    loadProducts(); 
    loadCategories(); 
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      setCategories([]);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const productData = {
        ...form,
        price: Number(form.price),
        rating: Number(form.rating) || 0,
        stock: Number(form.stock) || 0
      };

      if (editingId) {
        await API.put(`/products/${editingId}`, productData);
        setEditingId(null);
      } else {
        await API.post("/products", productData);
      }
      
      setForm({ 
        name: "", 
        price: "", 
        image: "", 
        category: "", 
        rating: "", 
        warranty: "",
        stock: ""
      });
      loadProducts();
      
      // Show success message
      const message = document.createElement('div');
      message.className = 'success-message';
      message.textContent = editingId ? 'تم تحديث المنتج بنجاح!' : 'تم إضافة المنتج بنجاح!';
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
      
    } catch (err) {
      console.error(err);
      alert("خطأ بحفظ المنتج");
    } finally {
      setSaving(false);
    }
  };

  const edit = (p) => {
    setEditingId(p._id || p.id);
    setForm({ 
      name: p.name, 
      price: p.price, 
      image: p.image, 
      category: p.category, 
      rating: p.rating || "", 
      warranty: p.warranty || "",
      stock: p.stock || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    try {
      await API.delete(`/products/${id}`);
      loadProducts();
      
      // Show success message
      const message = document.createElement('div');
      message.className = 'success-message';
      message.textContent = 'تم حذف المنتج بنجاح!';
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
      
    } catch (err) {
      console.error(err);
      alert("خطأ بالحذف");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ 
      name: "", 
      price: "", 
      image: "", 
      category: "", 
      rating: "", 
      warranty: "",
      stock: ""
    });
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h3>
            <i className="fas fa-bolt"></i>
            Volt Admin
          </h3>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin" className="nav-link">
            <i className="fas fa-tachometer-alt"></i>
            لوحة التحكم
          </Link>
          <Link to="/admin/products" className="nav-link active">
            <i className="fas fa-box"></i>
            إدارة المنتجات
          </Link>
          <Link to="/admin/orders" className="nav-link">
            <i className="fas fa-shopping-cart"></i>
            إدارة الطلبات
          </Link>
          <Link to="/admin/categories" className="nav-link">
            <i className="fas fa-tags"></i>
            إدارة الفئات
          </Link>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <div className="header-content">
            <h1>إدارة المنتجات</h1>
            <p>إضافة وتعديل وحذف منتجات المتجر</p>
          </div>
          <div className="header-actions">
            <button onClick={loadProducts} className="refresh-btn" disabled={loading}>
              <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
              تحديث القائمة
            </button>
          </div>
        </div>

        {/* نموذج إضافة/تعديل المنتج */}
        <div className="form-section">
          <h2>{editingId ? "تعديل المنتج" : "إضافة منتج جديد"}</h2>
          
          <form className="product-form" onSubmit={save}>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <i className="fas fa-tag"></i>
                  اسم المنتج
                </label>
                <input 
                  placeholder="أدخل اسم المنتج" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  required 
                  disabled={saving}
                />
              </div>
              
              <div className="form-group">
                <label>
                  <i className="fas fa-dollar-sign"></i>
                  السعر (د.أ)
                </label>
                <input 
                  placeholder="أدخل السعر" 
                  type="number" 
                  step="0.01"
                  value={form.price} 
                  onChange={e => setForm({...form, price: e.target.value})} 
                  required 
                  disabled={saving}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <i className="fas fa-image"></i>
                  رابط الصورة
                </label>
                <input 
                  placeholder="أدخل رابط الصورة" 
                  value={form.image} 
                  onChange={e => setForm({...form, image: e.target.value})} 
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label>
                  <i className="fas fa-tags"></i>
                  الفئة
                </label>
                <select 
                  value={form.category} 
                  onChange={e => setForm({...form, category: e.target.value})}
                  required
                  disabled={saving}
                >
                  <option value="">اختر الفئة</option>
                  {categories.map(c => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <i className="fas fa-star"></i>
                  التقييم (0-5)
                </label>
                <input 
                  placeholder="التقييم" 
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating} 
                  onChange={e => setForm({...form, rating: e.target.value})} 
                  disabled={saving}
                />
              </div>
              
              <div className="form-group">
                <label>
                  <i className="fas fa-shield-alt"></i>
                  الكفالة
                </label>
                <input 
                  placeholder="مدة الكفالة" 
                  value={form.warranty} 
                  onChange={e => setForm({...form, warranty: e.target.value})} 
                  disabled={saving}
                />
              </div>
              
              <div className="form-group">
                <label>
                  <i className="fas fa-boxes"></i>
                  المخزون
                </label>
                <input 
                  placeholder="كمية المخزون" 
                  type="number"
                  min="0"
                  value={form.stock} 
                  onChange={e => setForm({...form, stock: e.target.value})} 
                  disabled={saving}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    {editingId ? "تحديث المنتج" : "إضافة المنتج"}
                  </>
                )}
              </button>
              
              {editingId && (
                <button 
                  type="button" 
                  onClick={cancelEdit}
                  className="cancel-btn"
                  disabled={saving}
                >
                  <i className="fas fa-times"></i>
                  إلغاء التعديل
                </button>
              )}
            </div>
          </form>
        </div>

        {/* جدول المنتجات */}
        <div className="table-section">
          <h2>قائمة المنتجات ({products.length})</h2>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>جاري تحميل المنتجات...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-box-open"></i>
              <p>لا توجد منتجات لعرضها</p>
              <p>ابدأ بإضافة منتج جديد</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>الصورة</th>
                    <th>الاسم</th>
                    <th>السعر</th>
                    <th>الفئة</th>
                    <th>التقييم</th>
                    <th>المخزون</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => ( 
                    <tr key={p._id || p.id}>
                      <td>{i + 1}</td>
                      <td>
                        <img 
                          src={p.image || "/placeholder.png"} 
                          alt={p.name} 
                          className="product-thumb"
                        />
                      </td>
                      <td>
                        <div className="product-name">
                          <strong>{p.name}</strong>
                          {p.warranty && (
                            <small className="warranty">كفالة: {p.warranty}</small>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="price">{p.price} د.أ</span>
                      </td>
                      <td>
                        <span className="category-badge">{p.category || "-"}</span>
                      </td>
                      <td>
                        <div className="rating">
                          <i className="fas fa-star"></i>
                          <span>{p.rating || 0}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`stock ${(p.stock || 0) > 0 ? 'in-stock' : 'out-of-stock'}`}>
                          {p.stock || 0}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => edit(p)}
                            className="edit-btn"
                            title="تعديل المنتج"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            onClick={() => remove(p._id || p.id)} 
                            className="delete-btn"
                            title="حذف المنتج"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
