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

  // Subcategories state
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryForm, setSubcategoryForm] = useState({ name: "", category: "", description: "", image: "" });
  const [editingSubcategoryId, setEditingSubcategoryId] = useState(null);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [savingSubcategory, setSavingSubcategory] = useState(false);
  const [activeTab, setActiveTab] = useState("categories"); // "categories" or "subcategories"

  useEffect(() => {
    loadCategories();
    loadSubcategories();
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

  // Subcategories functions
  const loadSubcategories = async () => {
    try {
      setLoadingSubcategories(true);
      const res = await API.get("/subcategories");
      setSubcategories(res.data);
    } catch (err) {
      console.error(err);
      setSubcategories([]);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  const saveSubcategory = async (e) => {
    e.preventDefault();
    setSavingSubcategory(true);
    
    try {
      if (editingSubcategoryId) {
        await API.put(`/subcategories/${editingSubcategoryId}`, subcategoryForm);
        setEditingSubcategoryId(null);
      } else {
        await API.post("/subcategories", subcategoryForm);
      }

      setSubcategoryForm({ name: "", category: "", description: "", image: "" });
      loadSubcategories();
      
      // Show success message
      const message = document.createElement('div');
      message.className = 'success-message';
      message.textContent = editingSubcategoryId ? 'تم تحديث الماركة بنجاح!' : 'تم إضافة الماركة بنجاح!';
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
      console.error("Error saving subcategory:", err);
      if (err.response) {
        alert("خطأ: " + (err.response.data.message || "تعذر الحفظ"));
      } else {
        alert("خطأ بالاتصال بالسيرفر");
      }
    } finally {
      setSavingSubcategory(false);
    }
  };

  const editSubcategory = (sub) => {
    setEditingSubcategoryId(sub._id || sub.id);
    setSubcategoryForm({ 
      name: sub.name, 
      category: sub.category, 
      description: sub.description || "",
      image: sub.image || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeSubcategory = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه الماركة؟")) return;
    try {
      await API.delete(`/subcategories/${id}`);
      loadSubcategories();
      
      // Show success message
      const message = document.createElement('div');
      message.className = 'success-message';
      message.textContent = 'تم حذف الماركة بنجاح!';
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

  const cancelEditSubcategory = () => {
    setEditingSubcategoryId(null);
    setSubcategoryForm({ name: "", category: "", description: "", image: "" });
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
            <h1>إدارة الفئات والماركات</h1>
            <p>إضافة وتعديل وحذف فئات المنتجات والماركات</p>
          </div>
          <div className="header-actions">
            <button 
              onClick={() => {
                loadCategories();
                loadSubcategories();
              }} 
              className="refresh-btn" 
              disabled={loading || loadingSubcategories}
            >
              <i className={`fas fa-sync-alt ${(loading || loadingSubcategories) ? 'fa-spin' : ''}`}></i>
              تحديث القائمة
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "2px solid #e5e7eb" }}>
          <button
            onClick={() => setActiveTab("categories")}
            style={{
              padding: "0.75rem 1.5rem",
              background: activeTab === "categories" ? "#2563eb" : "transparent",
              color: activeTab === "categories" ? "white" : "#6b7280",
              border: "none",
              borderBottom: activeTab === "categories" ? "2px solid #2563eb" : "2px solid transparent",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.3s ease"
            }}
          >
            <i className="fas fa-tags"></i> الفئات
          </button>
          <button
            onClick={() => setActiveTab("subcategories")}
            style={{
              padding: "0.75rem 1.5rem",
              background: activeTab === "subcategories" ? "#2563eb" : "transparent",
              color: activeTab === "subcategories" ? "white" : "#6b7280",
              border: "none",
              borderBottom: activeTab === "subcategories" ? "2px solid #2563eb" : "2px solid transparent",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.3s ease"
            }}
          >
            <i className="fas fa-tag"></i> الماركات
          </button>
        </div>

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <>
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
          </>
        )}

        {/* Subcategories Tab */}
        {activeTab === "subcategories" && (
          <>
            {/* نموذج إضافة/تعديل الماركة */}
            <div className="form-section">
              <h2>{editingSubcategoryId ? "تعديل الماركة" : "إضافة ماركة جديدة"}</h2>
              
              <form className="category-form" onSubmit={saveSubcategory}>
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-tag"></i>
                      اسم الماركة *
                    </label>
                    <input
                      placeholder="أدخل اسم الماركة"
                      value={subcategoryForm.name}
                      onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
                      required
                      disabled={savingSubcategory}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <i className="fas fa-tags"></i>
                      الفئة الرئيسية *
                    </label>
                    <select
                      value={subcategoryForm.category}
                      onChange={(e) => setSubcategoryForm({ ...subcategoryForm, category: e.target.value })}
                      required
                      disabled={savingSubcategory}
                    >
                      <option value="">اختر الفئة</option>
                      {categories.map(c => (
                        <option key={c._id || c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-align-right"></i>
                      الوصف
                    </label>
                    <textarea
                      placeholder="وصف الماركة (اختياري)"
                      value={subcategoryForm.description}
                      onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
                      rows="2"
                      disabled={savingSubcategory}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <i className="fas fa-image"></i>
                      رابط صورة الماركة
                    </label>
                    <input
                      placeholder="أدخل رابط الصورة"
                      value={subcategoryForm.image}
                      onChange={(e) => setSubcategoryForm({ ...subcategoryForm, image: e.target.value })}
                      disabled={savingSubcategory}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" disabled={savingSubcategory}>
                    {savingSubcategory ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save"></i>
                        {editingSubcategoryId ? "تحديث الماركة" : "إضافة الماركة"}
                      </>
                    )}
                  </button>
                  
                  {editingSubcategoryId && (
                    <button
                      type="button"
                      onClick={cancelEditSubcategory}
                      className="cancel-btn"
                      disabled={savingSubcategory}
                    >
                      <i className="fas fa-times"></i>
                      إلغاء التعديل
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* جدول الماركات */}
            <div className="table-section">
              <h2>قائمة الماركات ({subcategories.length})</h2>
              
              {loadingSubcategories ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>جاري تحميل الماركات...</p>
                </div>
              ) : subcategories.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-tag"></i>
                  <p>لا توجد ماركات لعرضها</p>
                  <p>ابدأ بإضافة ماركة جديدة</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="categories-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>الاسم</th>
                        <th>الفئة</th>
                        <th>الوصف</th>
                        <th>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subcategories.map((sub, i) => (
                        <tr key={sub._id || sub.id}>
                          <td>{i + 1}</td>
                          <td>
                            <div className="category-name">
                              <strong>{sub.name}</strong>
                            </div>
                          </td>
                          <td>
                            <span className="category-badge">{sub.category}</span>
                          </td>
                          <td>
                            <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                              {sub.description || "-"}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                onClick={() => editSubcategory(sub)}
                                className="edit-btn"
                                title="تعديل الماركة"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                onClick={() => removeSubcategory(sub._id || sub.id)}
                                className="delete-btn"
                                title="حذف الماركة"
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
          </>
        )}
      </main>
    </div>
  );
}
