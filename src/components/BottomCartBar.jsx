const fmt = (n) => `CUP ${n.toLocaleString("es-CU", { minimumFractionDigits: 2 })}`;

export default function BottomCartBar({ cartCount, cartTotal, onOpen }) {
  return (
    <div className={`bcb ${cartCount > 0 ? "on" : ""}`} aria-hidden={cartCount === 0}>
      <div className="bcb-info">
        <div className="bcb-lbl">{cartCount} {cartCount === 1 ? "artículo" : "artículos"}</div>
        <div className="bcb-total">{fmt(cartTotal)}</div>
      </div>
      <button className="bcb-btn" onClick={onOpen}>Ver carrito →</button>
    </div>
  );
}