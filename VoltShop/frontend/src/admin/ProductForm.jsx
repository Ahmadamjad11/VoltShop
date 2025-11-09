import React, { useState, useEffect } from "react";
import API from "../api/api";

export default function ProductForm({ onAdded, product = null }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState("");
  const [warranty, setWarranty] = useState("");
  const [stock, setStock] = useState("");

  // Dropdowns data
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [types, setTypes] = useState([]);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load subcategories when category changes
  useEffect(() => {
    if (category) {
      loadSubcategories();
    } else {
      setSubcategories([]);
      setSubcategory("");
    }
  }, [category]);

  // Load types when subcategory changes
  useEffect(() => {
    if (category && subcategory) {
      loadTypes();
    } else {
      setTypes([]);
      setType("");
    }
  }, [category, subcategory]);

  // Load product data if editing
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setPrice(product.price || "");
      setDescription(product.description || "");
      setCategory(product.category || "");
      setSubcategory(product.subcategory || "");
      setType(product.type || "");
      setImage(product.image || "");
      setRating(product.rating || "");
      setWarranty(product.warranty || "");
      setStock(product.stock || "");
    }
  }, [product]);

  const loadCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSubcategories = async () => {
    try {
      const res = await API.get(`/products/subcategories?category=${encodeURIComponent(category)}`);
      setSubcategories(res.data);
      // Reset subcategory if current one is not in the list
      if (subcategory && !res.data.includes(subcategory)) {
        setSubcategory("");
      }
    } catch (err) {
      console.error(err);
      setSubcategories([]);
    }
  };

  const loadTypes = async () => {
    try {
      const res = await API.get(`/products/types?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`);
      setTypes(res.data);
      // Reset type if current one is not in the list
      if (type && !res.data.includes(type)) {
        setType("");
      }
    } catch (err) {
      console.error(err);
      setTypes([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name,
        price: Number(price),
        description,
        category,
        subcategory,
        type: type || "",
        image,
        rating: rating ? Number(rating) : 0,
        warranty: warranty || "",
        stock: stock ? Number(stock) : 0
      };

      let res;
      if (product && product._id) {
        res = await API.put(`/products/${product._id}`, productData);
      } else {
        res = await API.post("/products", productData);
      }

      alert(product ? "تم تحديث المنتج بنجاح" : "تم إضافة المنتج بنجاح");
      if (onAdded) onAdded(res.data);
      
      // Reset form
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setSubcategory("");
      setType("");
      setImage("");
      setRating("");
      setWarranty("");
      setStock("");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ المنتج");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="اسم المنتج"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="السعر (د.أ)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          step="0.01"
          required
        />
      </div>

      <textarea
        placeholder="وصف المنتج (اختياري)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="3"
        style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #ddd" }}
      />

      {/* Dropdowns متتالية */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
            الفئة الرئيسية *
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubcategory("");
              setType("");
            }}
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #ddd" }}
          >
            <option value="">اختر الفئة</option>
            {categories.map((cat) => (
              <option key={cat._id || cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
            الماركة / النوع *
          </label>
          <select
            value={subcategory}
            onChange={(e) => {
              setSubcategory(e.target.value);
              setType("");
            }}
            required
            disabled={!category}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #ddd" }}
          >
            <option value="">اختر الماركة</option>
            {subcategories.map((sub, index) => (
              <option key={index} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
            نوع المنتج الدقيق
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={!subcategory}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #ddd" }}
          >
            <option value="">اختر النوع (اختياري)</option>
            {types.map((t, index) => (
              <option key={index} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="رابط الصورة"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="التقييم (0-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="0"
          max="5"
          step="0.1"
        />
        <input
          type="text"
          placeholder="الكفالة"
          value={warranty}
          onChange={(e) => setWarranty(e.target.value)}
        />
      </div>

      <input
        type="number"
        placeholder="المخزون"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        min="0"
        style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #ddd" }}
      />

      <button type="submit" style={{ width: "100%", padding: "0.75rem", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "0.25rem", cursor: "pointer", fontWeight: "600" }}>
        {product ? "تحديث المنتج" : "أضف المنتج"}
      </button>
    </form>
  );
}
