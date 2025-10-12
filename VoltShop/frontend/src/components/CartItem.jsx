import "../styles/cart.css";

export default function CartItem({ item, onRemove, onChangeQty }) {
  const handleQuantityChange = (newQty) => {
    if (newQty >= 1) {
      onChangeQty(item.id, newQty);
    }
  };

  return (
    <div className="cart-item">
      <img src={item.image || "/placeholder.png"} alt={item.name} />
      <div className="cart-item-info">
        <h3>{item.name}</h3>
        <p>سعر الوحدة: {item.price} د.أ</p>
        {item.warranty && <p>الكفالة: {item.warranty}</p>}
      </div>
      <div className="cart-item-price">{item.price * item.quantity} د.أ</div>
      <div className="cart-item-controls">
        <div className="quantity-controls">
          <button 
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <input 
            type="number" 
            min="1" 
            value={item.quantity} 
            onChange={(e) => handleQuantityChange(Number(e.target.value))}
          />
          <button onClick={() => handleQuantityChange(item.quantity + 1)}>
            +
          </button>
        </div>
        <button className="remove-btn" onClick={() => onRemove(item.id)}>
          <i className="fas fa-trash"></i>
          حذف
        </button>
      </div>
    </div>
  );
}
