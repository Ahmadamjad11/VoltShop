// src/components/Categories.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/categories.css";

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

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

  const goToCategory = (cat) => {
    navigate(`/category/${cat}`);
  };

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
