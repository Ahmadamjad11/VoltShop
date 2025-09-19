import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import API from "../api/api";
import "../styles/home.css";

export default function CategoryPage() {
  const { cat } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [cat]);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      const filtered = res.data.filter((p) => p.category === cat);
      setProducts(filtered);
    } catch (err) {
      console.error(err);
      setProducts([]);
    }
  };

  const addToCart = (product, quantity = 1) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((c) => c.id === (product._id || product.id));
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        warranty: product.warranty,
        quantity,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("تمت الإضافة للسلة");
  };

  return (
    <>
      <Navbar />
      <main className="home-main">
        <h2>{cat}</h2>
        <div className="products-grid">
          {products.length === 0 && (
            <p className="info">لا توجد منتجات في هذا القسم</p>
          )}
          {products.map((p) => (
            <ProductCard
              key={p._id || p.id}
              product={p}
              onAdd={addToCart}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
