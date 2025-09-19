import "../styles/cart.css";

export default function CartItem({ item, onRemove, onChangeQty }) {
  return (
    <div className="cart-item">
      <img src={item.image || "/placeholder.png"} alt={item.name} />
      <div className="cart-item-info">
        <h4>{item.name}</h4>
        <p>سعر الوحدة: {item.price} د.أ</p>
        <p>الكفالة: {item.warranty || "-"}</p>
        <div className="cart-controls">
          <input type="number" min="1" value={item.quantity} onChange={(e)=> onChangeQty(item.id, Number(e.target.value))} />
          <button className="remove-btn" onClick={()=> onRemove(item.id)}>حذف</button>
        </div>
      </div>
      <div className="cart-subtotal">{item.price * item.quantity} د.أ</div>
    </div>
  );
}
