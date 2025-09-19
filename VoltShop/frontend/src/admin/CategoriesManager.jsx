import React, { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/admin.css";

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", image: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

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
    try {
      console.log("📤 Sending form:", form);

      if (editingId) {
        await API.put(`/categories/${editingId}`, form);
        setEditingId(null);
      } else {
        await API.post("/categories", form);
      }

      setForm({ name: "", image: "" });
      loadCategories();
    } catch (err) {
      console.error("❌ Error saving category:", err);
      if (err.response) {
        alert("خطأ: " + (err.response.data.message || "تعذر الحفظ"));
      } else {
        alert("خطأ بالاتصال بالسيرفر");
      }
    }
  };

  const edit = (c) => {
    setEditingId(c._id || c.id);
    setForm({ name: c.name, image: c.image || "" });
  };

  const remove = async (id) => {
    if (!confirm("حذف القسم؟")) return;
    try {
      await API.delete(`/categories/${id}`);
      loadCategories();
    } catch (err) {
      console.error(err);
      alert("خطأ بالحذف");
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3>Volt Admin</h3>
        <nav>
          <a href="/admin">الرئيسية</a>
          <a href="/admin/products">المنتجات</a>
          <a href="/admin/orders">الطلبات</a>
        </nav>
      </aside>

      <main className="admin-main">
        <h2>إدارة الأقسام</h2>

        <form className="product-form" onSubmit={save}>
          <input
            placeholder="اسم القسم"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="رابط صورة القسم"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <div>
            <button type="submit">
              {editingId ? "تعديل القسم" : "إضافة قسم"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "", image: "" });
                }}
              >
                إلغاء
              </button>
            )}
          </div>
        </form>

        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>الاسم</th>
                <th>الصورة</th>
                <th>إجراء</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c, i) => (
                <tr key={c._id || c.id}>
                  <td>{i + 1}</td>
                  <td>{c.name}</td>
                  <td>
                    <img
                      src={c.image || "/placeholder.png"}
                      alt={c.name}
                      style={{ width: 50 }}
                    />
                  </td>
                  <td>
                    <button onClick={() => edit(c)}>تعديل</button>
                    <button
                      onClick={() => remove(c._id || c.id)}
                      style={{ background: "#ef4444" }}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
