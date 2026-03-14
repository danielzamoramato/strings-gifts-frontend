import { useState } from "react";

export default function ProductCard({ product, onAdd, addedId }) {
  const [variant, setVariant] = useState(product.variants?.[0] || "Única");

  const isLow  = product.stock > 0 && product.stock <= 4;
  const isSold = product.stock === 0;
  // Soporta tanto isNew (datos locales) como esNuevo (MongoDB)
  const isNew  = product.isNew || product.esNuevo;
  const added  = addedId === (product._id || product.id);

  return (
    <article className="card">
      <div className="card-img-wrap">
        <img className="card-img" src={product.img} alt={product.name} loading="lazy" />
        {isNew && !isSold  && <span className="badge badge-new">New</span>}
        {isLow && !isSold  && <span className="badge badge-low">¡Últimas!</span>}
        {isSold && (
          <div className="sold-out-ov">
            <span className="sold-out-tag">Agotado</span>
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="card-name">{product.name}</div>
        <div className="card-desc">{product.desc}</div>

        <div className="card-footer">
          <div className="card-price">
            <sup>CUP</sup>
            {product.price.toLocaleString("es-CU", { minimumFractionDigits: 2 })}
          </div>

          <div className="card-actions">
            {product.variants?.length > 1 && (
              <select
                className="var-sel"
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                aria-label={`Talla de ${product.name}`}
              >
                {product.variants.map((v) => <option key={v}>{v}</option>)}
              </select>
            )}
            <button
              className={`add-btn${added ? " added" : ""}`}
              onClick={() => onAdd(product, variant)}
              disabled={isSold}
              aria-label={`Agregar ${product.name} al carrito`}
              style={{ marginLeft: product.variants?.length <= 1 ? "auto" : undefined }}
            >
              {added ? "✓" : "+"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}