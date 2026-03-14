import { useState, useEffect, useTransition } from "react";
import { CATEGORIES } from "../data/products";
import { useCart } from "../hooks/useCart";
import Header        from "./Header";
import Hero          from "./Hero";
import CategoryNav   from "./CategoryNav";
import ProductCard   from "./ProductCard";
import CartDrawer    from "./CartDrawer";
import BottomCartBar from "./BottomCartBar";
import CheckoutModal from "./CheckoutModal";
import "../styles/catalog.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function Catalogo() {
  const [activeCategory, setActiveCategory] = useState("pulseras");
  const [cartOpen, setCartOpen]             = useState(false);
  const [checkoutOpen, setCheckoutOpen]     = useState(false);
  const [search, setSearch]                 = useState("");
  const [products, setProducts]             = useState([]);
  const [isPending, startTransition]        = useTransition();

  const {
    cart, cartCount, cartTotal,
    addedId, toast,
    addToCart, updateQty, removeItem, clearCart
  } = useCart();

  useEffect(() => {
    const q   = search.trim();
    const url = q
      ? `${API}/products?q=${encodeURIComponent(q)}&limit=100`
      : `${API}/products?category=${activeCategory}&limit=100`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        startTransition(() => {
          if (data.ok) setProducts(data.data);
        });
      })
      .catch(() => {});
  }, [activeCategory, search]);

  const searchQ        = search.trim();
  const activeCatLabel = CATEGORIES.find((c) => c.key === activeCategory)?.label || "";

  const handleOpenCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    clearCart();
  };

  return (
    <>
      <Header
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        search={search}
        onSearchChange={setSearch}
      />

      <Hero />

      {!searchQ && (
        <CategoryNav active={activeCategory} onChange={setActiveCategory} />
      )}

      <main className="main">
        <div className="sec-hdr">
          <h2 className="sec-title">{searchQ ? "Resultados" : activeCatLabel}</h2>
          <span className="sec-count">
            {isPending ? "Cargando…" : `${products.length} productos`}
          </span>
        </div>

        <div className="grid">
          {isPending ? (
            <div className="no-res">
              <div className="no-res-icon">🦋</div>
              <h3>Cargando productos…</h3>
            </div>
          ) : products.length === 0 ? (
            <div className="no-res">
              <div className="no-res-icon">🔍</div>
              <h3>Sin resultados</h3>
              <p>Intenta con otro término</p>
            </div>
          ) : (
            products.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onAdd={addToCart}
                addedId={addedId}
              />
            ))
          )}
        </div>
      </main>

      <footer className="footer">
        <strong>Strings Gifts</strong> &nbsp;·&nbsp; Joyería artesanal hecha con amor 🦋
      </footer>

      <BottomCartBar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpen={() => setCartOpen(true)}
      />

      {cartOpen && (
        <CartDrawer
          cart={cart}
          cartCount={cartCount}
          cartTotal={cartTotal}
          onClose={() => setCartOpen(false)}
          onUpdateQty={updateQty}
          onRemove={removeItem}
          onClear={clearCart}
          onCheckout={handleOpenCheckout}
        />
      )}

      {checkoutOpen && (
        <CheckoutModal
          cart={cart}
          cartTotal={cartTotal}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={handleOrderSuccess}
        />
      )}

      {toast && (
        <div className="toast" role="status" aria-live="polite">{toast}</div>
      )}
    </>
  );
}