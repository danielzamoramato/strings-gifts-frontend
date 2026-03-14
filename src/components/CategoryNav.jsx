import { useRef, useEffect } from "react";
import { CATEGORIES } from "../data/products";

export default function CategoryNav({ active, onChange }) {
  const navRef = useRef(null);

  useEffect(() => {
    if (!navRef.current) return;
    const el = navRef.current.querySelector(".cat-tab.active");
    if (el) el.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  return (
    <nav className="cat-nav" ref={navRef} aria-label="Categorías">
      {CATEGORIES.map((c) => (
        <button
          key={c.key}
          className={`cat-tab ${active === c.key ? "active" : ""}`}
          onClick={() => onChange(c.key)}
          aria-current={active === c.key ? "true" : undefined}
        >
          <span aria-hidden="true">{c.emoji}</span>
          {c.label}
        </button>
      ))}
    </nav>
  );
}
