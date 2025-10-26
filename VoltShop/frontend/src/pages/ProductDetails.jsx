import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../api/api";
import "../styles/home.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (e) {
        setError("تعذر تحميل المنتج");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const pid = product._id || product.id;
    const existing = cart.find(c => c.id === pid);
    if (existing) existing.quantity += qty; else cart.push({
      id: pid,
      name: product.name,
      price: product.price,
      image: product.image,
      warranty: product.warranty,
      quantity: qty
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    setToast("تمت الإضافة للسلة بنجاح!");
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "2rem 1.5rem" }}>
        {loading ? (
          <div className="skeleton-card" style={{ maxWidth: 900, margin: "0 auto" }}>
            <div className="sk-image" style={{ height: 260 }}></div>
            <div className="sk-title"></div>
            <div className="sk-price"></div>
          </div>
        ) : error ? (
          <div className="error-message" style={{ textAlign: "center" }}>
            {error}
          </div>
        ) : (
          product && (
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem", alignItems: "start" }}>
              <div className="card" style={{ padding: "1rem" }}>
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  style={{ width: "100%", borderRadius: "0.5rem" }}
                  loading="lazy"
                />
              </div>
              <div>
                <h1 style={{ marginBottom: ".5rem" }}>{product.name}</h1>
                <p style={{ color: "#6b7280", marginBottom: "1rem" }}>{product.description || ""}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                  <span className="price" style={{ fontSize: "1.5rem", color: "#0E84FF", fontWeight: 700 }}>{product.price} د.أ</span>
                  {product.rating && <span className="rating">⭐ {product.rating}</span>}
                </div>
                {product.warranty && (
                  <div className="warranty" style={{ marginBottom: "1rem" }}>الكفالة: {product.warranty}</div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                    <span>الكمية:</span>
                    <input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value||"1",10)))} style={{ width: 90 }} />
                  </label>
                  <button className="btn-primary" onClick={addToCart}><i className="fas fa-cart-plus"></i> أضف للسلة</button>
                  <button className="btn-outline" onClick={() => navigate(-1)}><i className="fas fa-arrow-right"></i> رجوع</button>
                </div>
                {product.features && Array.isArray(product.features) && product.features.length > 0 && (
                  <div className="card" style={{ padding: "1rem", marginTop: "1rem" }}>
                    <h3 style={{ marginBottom: ".75rem" }}>المواصفات</h3>
                    <ul style={{ margin: 0, paddingInlineStart: "1.25rem" }}>
                      {product.features.map((f, idx) => (
                        <li key={idx} style={{ marginBottom: ".25rem" }}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </main>
      {toast && <div className="toast-success">{toast}</div>}
      <Footer />
    </>
  );
}
