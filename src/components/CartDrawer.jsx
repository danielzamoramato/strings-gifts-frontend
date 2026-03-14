const fmt = (n) => `CUP ${n.toLocaleString("es-CU", { minimumFractionDigits: 2 })}`;

export default function CartDrawer({ cart, cartCount, cartTotal, onClose, onUpdateQty, onRemove, onClear, onCheckout }) {
  return (
    <>
      <div className="overlay" onClick={onClose} aria-hidden="true" />

      <div className="drawer" role="dialog" aria-modal="true" aria-label="Carrito de compras">
        <div className="drawer-handle" />

        <div className="drawer-hdr">
          <div className="drawer-title">
            Mi Carrito
            {cartCount > 0 && <span className="d-qty-badge">{cartCount}</span>}
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Cerrar carrito">✕</button>
        </div>

        <div className="drawer-items">
          {cart.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🛍️</div>
              <div className="empty-t">Tu carrito está vacío</div>
              <div className="empty-s">Agrega productos para comenzar</div>
            </div>
          ) : (
            cart.map((item) => (
              <div className="ci" key={item.key}>
                <img className="ci-img" src={item.img} alt={item.name} />
                <div className="ci-mid">
                  <div className="ci-name">{item.name}</div>
                  <div className="ci-var">{item.variant}</div>
                  <div className="ci-ctrl">
                    <button className="qty-btn" onClick={() => onUpdateQty(item.key, -1)} aria-label="Reducir">−</button>
                    <span className="qty-n">{item.qty}</span>
                    <button className="qty-btn" onClick={() => onUpdateQty(item.key, +1)} aria-label="Aumentar">+</button>
                  </div>
                </div>
                <div className="ci-right">
                  <span className="ci-price">CUP {(item.price * item.qty).toLocaleString("es-CU")}</span>
                  <button className="ci-del" onClick={() => onRemove(item.key)} aria-label={`Eliminar ${item.name}`}>🗑</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-foot">
            <div className="tot-row">
              <span className="tot-lbl">Total</span>
              <span className="tot-amt">{fmt(cartTotal)}</span>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>
              Completar orden
            </button>
            <button className="clear-btn" onClick={onClear}>
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}