// src/components/Categories.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/categories.css";

export default function Categories({ onSelect }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      setError("فشل في تحميل الفئات");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const goToCategory = (cat) => {
    if (onSelect) {
      onSelect(cat);
    } else {
      navigate(`/category/${cat}`);
    }
  };

  if (loading) {
    return (
      <div className="categories-grid">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل الفئات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-grid">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
          <button onClick={loadCategories} className="btn-primary" style={{ marginTop: '1rem' }}>
            <i className="fas fa-refresh"></i>
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-grid">
      {categories.map((c) => (
        <div
          key={c._id || c.id}
          className="category-card"
          onClick={() => goToCategory(c.name)}
        >
          <img src={c.image || "/placeholder.png"} alt={c.name} />
          <h3>{c.name}</h3>
        </div>
      ))}
    </div>
  );
}
