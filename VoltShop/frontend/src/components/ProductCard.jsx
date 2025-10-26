import "../styles/productCard.css";
import { Link } from "react-router-dom";

export default function ProductCard({ product, onAdd }) {
  const img = product.image || "/placeholder.png";
  const id = product._id || product.id;
  return (
    <div className="product-card">
      <Link to={`/product/${id}`}>
        <img src={img} alt={product.name} loading="lazy" />
      </Link>
      <h3>
        <Link to={`/product/${id}`}>{product.name}</Link>
      </h3>
      <div className="product-info">
        <span className="price">{product.price} د.أ</span>
        {product.rating && <span className="rating">⭐ {product.rating}</span>}
      </div>
      {product.warranty && <div className="warranty">الكفالة: {product.warranty}</div>}
      <div className="card-actions">
        <input className="qty" type="number" min="1" defaultValue={1} id={`qty-${id}`}/>
        <button onClick={() => {
          const q = Number(document.getElementById(`qty-${id}`).value || 1);
          onAdd?.(product, q);
        }}>أضف للسلة</button>
      </div>
    </div>
  );
}
