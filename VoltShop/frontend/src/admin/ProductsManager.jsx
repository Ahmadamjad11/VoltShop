import React, { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/admin.css";

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", image: "", category: "", rating:"", warranty:"" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { 
    loadProducts(); 
    loadCategories(); 
  }, []);

  const loadProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setProducts([]);
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
    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, form);
        setEditingId(null);
      } else {
        await API.post("/products", form);
      }
      setForm({ name: "", price: "", image: "", category: "", rating:"", warranty:"" });
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("خطأ بحفظ المنتج");
    }
  };

  const edit = (p) => {
    setEditingId(p._id || p.id);
    setForm({ 
      name: p.name, 
      price: p.price, 
      image: p.image, 
      category: p.category, 
      rating: p.rating, 
      warranty: p.warranty 
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("حذف المنتج؟")) return;
    try {
      await API.delete(`/products/${id}`);
      loadProducts();
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
          <a href="/admin/orders">الطلبات</a>
          <a href="/admin/categories">الأقسام</a>
        </nav>
      </aside>

      <main className="admin-main">
        <h2>إدارة المنتجات</h2>

        <form className="product-form" onSubmit={save}>
          <input 
            placeholder="اسم المنتج" 
            value={form.name} 
            onChange={e=>setForm({...form, name: e.target.value})} 
            required 
          />
          <input 
            placeholder="السعر" 
            type="number" 
            value={form.price} 
            onChange={e=>setForm({...form, price: e.target.value})} 
            required 
          />
          <input 
            placeholder="رابط الصورة" 
            value={form.image} 
            onChange={e=>setForm({...form, image: e.target.value})} 
          />

          {/* Dropdown من الأقسام المحفوظة في الداتا */}
          <select 
            value={form.category} 
            onChange={e=>setForm({...form, category: e.target.value})}
            required
          >
            <option value="">اختر القسم</option>
            {categories.map(c => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <input 
            placeholder="التقييم" 
            value={form.rating} 
            onChange={e=>setForm({...form, rating: e.target.value})} 
          />
          <input 
            placeholder="الكفالة" 
            value={form.warranty} 
            onChange={e=>setForm({...form, warranty: e.target.value})} 
          />
          <div>
            <button type="submit">
              {editingId ? "تعديل المنتج" : "إضافة منتج"}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={()=>{ 
                  setEditingId(null); 
                  setForm({name:"",price:"",image:"",category:"",rating:"",warranty:""}); 
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
                <th>اسم</th>
                <th>سعر</th>
                <th>القسم</th>
                <th>صورة</th>
                <th>إجراء</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p,i)=>( 
                <tr key={p._id || p.id}>
                  <td>{i+1}</td>
                  <td>{p.name}</td>
                  <td>{p.price}</td>
                  <td>{p.category || "-"}</td>
                  <td>
                    <img 
                      src={p.image || "/placeholder.png"} 
                      alt={p.name} 
                      style={{width:60}}
                    />
                  </td>
                  <td>
                    <button onClick={()=>edit(p)}>تعديل</button>
                    <button 
                      onClick={()=>remove(p._id || p.id)} 
                      style={{background:"#ef4444"}}
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
