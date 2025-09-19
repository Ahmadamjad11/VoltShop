import "../styles/productCard.css";

export default function ProductCard({ product, onAdd }) {
  const img = product.image || "/placeholder.png";
  return (
    <div className="product-card">
      <img src={img} alt={product.name} />
      <h3>{product.name}</h3>
      <div className="product-info">
        <span className="price">{product.price} د.أ</span>
        {product.rating && <span className="rating">⭐ {product.rating}</span>}
      </div>
      {product.warranty && <div className="warranty">الكفالة: {product.warranty}</div>}
      <div className="card-actions">
        <input className="qty" type="number" min="1" defaultValue={1} id={`qty-${product._id || product.id}`}/>
        <button onClick={() => {
          const q = Number(document.getElementById(`qty-${product._id || product.id}`).value || 1);
          onAdd?.(product, q);
        }}>أضف للسلة</button>
      </div>
    </div>
  );
}
