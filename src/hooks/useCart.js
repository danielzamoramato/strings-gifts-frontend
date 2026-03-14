import { useState, useRef } from "react";

export function useCart() {
  const [cart, setCart]       = useState([]);
  const [toast, setToast]     = useState(null);
  const [addedId, setAddedId] = useState(null);
  const toastRef              = useRef(null);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 2100);
  };

  const addToCart = (product, variant) => {
    const key = `${product.id}-${variant}`;
    setCart((prev) => {
      const ex = prev.find((i) => i.key === key);
      if (ex) return prev.map((i) => i.key === key ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, variant, key, qty: 1 }];
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 650);
    showToast(`✨ ${product.name} agregado`);
  };

  const updateQty = (key, delta) =>
    setCart((prev) =>
      prev.map((i) => i.key === key ? { ...i, qty: i.qty + delta } : i).filter((i) => i.qty > 0)
    );

  const removeItem = (key) => setCart((prev) => prev.filter((i) => i.key !== key));

  const clearCart = () => setCart([]);

  return { cart, cartCount, cartTotal, addedId, toast, addToCart, updateQty, removeItem, clearCart, showToast };
}
