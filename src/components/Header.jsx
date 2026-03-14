export default function Header({ cartCount, onCartOpen, search, onSearchChange }) {
  return (
    <header className="hdr">
      <div className="hdr-logo">
        
        <span>Accesorios <em>Strings Gifts</em></span>
      </div>

      <div className="hdr-search-wrap">
        <span className="hdr-search-icon">⌕</span>
        <input
          className="hdr-search"
          placeholder="Buscar…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Buscar productos"
        />
      </div>

      <button
        className="hdr-cart"
        onClick={onCartOpen}
        aria-label={`Carrito: ${cartCount} artículos`}
      >
        🛍
        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </button>
    </header>
  );
}
