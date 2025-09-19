import React, { useState } from "react";
import API from "../api/api";

export default function ProductForm({ onAdded }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");

  const categories = ["لمبات", "أسلاك", "قواطع", "معدات أخرى"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProduct = { name, price: Number(price), category, image };
      const res = await API.post("/products", newProduct);
      alert("تم إضافة المنتج بنجاح");
      onAdded(res.data);
      setName(""); setPrice(""); setCategory(""); setImage("");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء إضافة المنتج");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="اسم المنتج"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="السعر"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      
      {/* Dropdown للفئات */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="">اختر الفئة</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="رابط الصورة"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        required
      />
      <button type="submit">أضف المنتج</button>
    </form>
  );
}
