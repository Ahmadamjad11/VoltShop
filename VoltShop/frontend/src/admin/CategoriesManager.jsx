import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import "../styles/admin.css";

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", image: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (editingId) {
        await API.put(`/categories/${editingId}`, form);
        setEditingId(null);
      } else {
        await API.post("/categories", form);
      }

      setForm({ name: "", image: "" });
      loadCategories();
      
      // Show success message
      const message = document.createElement('div');
      message.className = 'success-message';
      message.textContent = editingId ? 'تم تحديث الفئة بنجاح!' : 'تم إضافة الفئة بنجاح!';
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
      console.error("Error saving category:", err);
      if (err.response) {
        alert("خطأ: " + (err.response.data.message || "تعذر الحفظ"));
      } else {
        alert("خطأ بالاتصال بالسيرفر");
      }
    } finally {
      setSaving(false);
    }
  };

  const edit = (c) => {
    setEditingId(c._id || c.id);
    setForm({ name: c.name, image: c.image || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفئة؟")) return;
    try {
      await API.delete(`/categories/${id}`);
      loadCategories();
      
      // Show success message
      const message = document.createElement('div');
      message.className = 'success-message';
      message.textContent = 'تم حذف الفئة بنجاح!';
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
    setForm({ name: "", image: "" });
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
          <Link to="/admin/products" className="nav-link">
            <i className="fas fa-box"></i>
            إدارة المنتجات
          </Link>
          <Link to="/admin/orders" className="nav-link">
            <i className="fas fa-shopping-cart"></i>
            إدارة الطلبات
          </Link>
          <Link to="/admin/categories" className="nav-link active">
            <i className="fas fa-tags"></i>
            إدارة الفئات
          </Link>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <div className="header-content">
            <h1>إدارة الفئات</h1>
            <p>إضافة وتعديل وحذف فئات المنتجات</p>
          </div>
          <div className="header-actions">
            <button onClick={loadCategories} className="refresh-btn" disabled={loading}>
              <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
              تحديث القائمة
            </button>
          </div>
        </div>

        {/* نموذج إضافة/تعديل الفئة */}
        <div className="form-section">
          <h2>{editingId ? "تعديل الفئة" : "إضافة فئة جديدة"}</h2>
          
          <form className="category-form" onSubmit={save}>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <i className="fas fa-tag"></i>
                  اسم الفئة
                </label>
                <input
                  placeholder="أدخل اسم الفئة"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>
              
              <div className="form-group">
                <label>
                  <i className="fas fa-image"></i>
                  رابط صورة الفئة
                </label>
                <input
                  placeholder="أدخل رابط الصورة"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
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
                    {editingId ? "تحديث الفئة" : "إضافة الفئة"}
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

        {/* جدول الفئات */}
        <div className="table-section">
          <h2>قائمة الفئات ({categories.length})</h2>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>جاري تحميل الفئات...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-tags"></i>
              <p>لا توجد فئات لعرضها</p>
              <p>ابدأ بإضافة فئة جديدة</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="categories-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>الصورة</th>
                    <th>الاسم</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c, i) => (
                    <tr key={c._id || c.id}>
                      <td>{i + 1}</td>
                      <td>
                        <img
                          src={c.image || "/placeholder.png"}
                          alt={c.name}
                          className="category-thumb"
                        />
                      </td>
                      <td>
                        <div className="category-name">
                          <strong>{c.name}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => edit(c)}
                            className="edit-btn"
                            title="تعديل الفئة"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => remove(c._id || c.id)}
                            className="delete-btn"
                            title="حذف الفئة"
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
