import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const css = `
.co-overlay {
  position: fixed; inset: 0; z-index: 300;
  background: rgba(30,26,23,0.6);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  display: flex; align-items: flex-end; justify-content: center;
  animation: coFadeIn 0.25s ease;
}
@keyframes coFadeIn { from{opacity:0} to{opacity:1} }

.co-sheet {
  background: var(--warm); width: 100%; max-width: 520px;
  border-radius: 22px 22px 0 0;
  max-height: 92dvh; overflow-y: auto;
  display: flex; flex-direction: column;
  animation: coSlideUp 0.35s cubic-bezier(0.32,0.72,0,1);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
@keyframes coSlideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }

.co-handle {
  width: 34px; height: 4px; border-radius: 4px;
  background: var(--blush); margin: 0.7rem auto 0; flex-shrink: 0;
}
.co-hdr {
  padding: 0.85rem 1.25rem 0.9rem;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  flex-shrink: 0;
}
.co-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.15rem; font-weight: 500;
}
.co-close {
  background: var(--cream); border: 1px solid var(--border); color: var(--mid);
  border-radius: 50%; width: 32px; height: 32px; cursor: pointer;
  font-size: 1rem; display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.co-close:active { background: var(--blush); }

.co-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.85rem; }

.co-field { display: flex; flex-direction: column; gap: 0.35rem; }
.co-field label {
  font-size: 0.7rem; color: var(--muted);
  letter-spacing: 0.12em; text-transform: uppercase;
}
.co-field input, .co-field textarea {
  background: var(--cream); border: 1px solid var(--border);
  border-radius: 10px; padding: 0.7rem 0.9rem;
  font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
  color: var(--charcoal); outline: none; transition: border-color 0.2s;
  width: 100%;
}
.co-field input:focus, .co-field textarea:focus { border-color: var(--gold); }
.co-field textarea { resize: none; height: 70px; }
.co-field .co-hint { font-size: 0.65rem; color: var(--muted); }
.co-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

.co-summary {
  background: var(--cream); border: 1px solid var(--border);
  border-radius: 12px; padding: 0.85rem 1rem;
  display: flex; flex-direction: column; gap: 0.4rem;
}
.co-summary-title {
  font-size: 0.68rem; color: var(--muted);
  letter-spacing: 0.12em; text-transform: uppercase;
  margin-bottom: 0.25rem;
}
.co-summary-item {
  display: flex; justify-content: space-between; align-items: baseline;
  font-size: 0.78rem;
}
.co-summary-item span:first-child { color: var(--mid); }
.co-summary-item span:last-child { font-weight: 500; }
.co-summary-total {
  display: flex; justify-content: space-between; align-items: baseline;
  padding-top: 0.5rem; margin-top: 0.1rem;
  border-top: 1px solid var(--border);
}
.co-summary-total span:first-child {
  font-size: 0.72rem; color: var(--mid);
  letter-spacing: 0.1em; text-transform: uppercase;
}
.co-summary-total span:last-child {
  font-family: 'Playfair Display', serif;
  font-size: 1.15rem; font-weight: 500; color: var(--deep-rose);
}

.co-err {
  background: rgba(192,80,60,0.08); border: 1px solid rgba(192,80,60,0.25);
  color: var(--deep-rose); border-radius: 10px; padding: 0.65rem 0.9rem;
  font-size: 0.78rem; text-align: center;
}

.co-submit {
  background: linear-gradient(135deg, var(--charcoal) 0%, #4a3728 100%);
  color: var(--warm); border: none; border-radius: var(--radius-sm);
  padding: 0.95rem; width: 100%; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 500;
  letter-spacing: 0.16em; text-transform: uppercase;
  transition: opacity 0.2s, transform 0.15s;
  margin-top: 0.25rem;
}
.co-submit:active  { transform: scale(0.98); opacity: 0.9; }
.co-submit:disabled { opacity: 0.45; cursor: not-allowed; }

/* ── CONFIRMACION ── */
.co-confirm {
  padding: 2rem 1.5rem 2.5rem;
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 0.75rem;
}
.co-confirm-icon { font-size: 3rem; margin-bottom: 0.25rem; }
.co-confirm-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.35rem; font-weight: 500; color: var(--charcoal);
}
.co-confirm-sub { font-size: 0.78rem; color: var(--muted); line-height: 1.6; }
.co-confirm-num {
  background: var(--blush); border: 1px solid var(--border-mid);
  border-radius: 12px; padding: 0.65rem 1.5rem;
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem; font-weight: 500; color: var(--deep-rose);
  letter-spacing: 0.08em; margin: 0.25rem 0;
}
.co-confirm-btn {
  background: var(--charcoal); color: var(--warm); border: none;
  border-radius: 10px; padding: 0.8rem 2rem; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 0.8rem;
  letter-spacing: 0.12em; text-transform: uppercase;
  margin-top: 0.5rem; transition: opacity 0.2s;
}
.co-confirm-btn:hover { opacity: 0.85; }

@media (min-width: 640px) {
  .co-overlay { align-items: center; }
  .co-sheet { border-radius: 20px; max-height: 88dvh; }
  .co-handle { display: none; }
}
`;

const fmt = (n) => `CUP ${n.toLocaleString("es-CU", { minimumFractionDigits: 2 })}`;
const EMPTY = { name: "", email: "", phone: "", address: "", city: "", notes: "" };

export default function CheckoutModal({ cart, cartTotal, onClose, onSuccess }) {
  const [form, setForm]         = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState("");
  const [orderNumber, setOrderNumber] = useState(null);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError("");

    try {
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            name:    form.name.trim(),
            email:   form.email.trim(),
            phone:   form.phone.trim() || undefined,
            address: form.address.trim() || undefined,
            city:    form.city.trim() || undefined,
          },
          notes: form.notes.trim() || undefined,
          items: cart.map(i => ({
            productId: i._id,
            name:      i.name,
            img:       i.img,
            variant:   i.variant,
            price:     i.price,
            qty:       i.qty,
          })),
          total: cartTotal,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        setOrderNumber(data.data.orderNumber);
        onSuccess();
      } else {
        setError(data.message || "No se pudo completar la orden");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setSubmitting(false);
    }
  };

  // ── PANTALLA DE CONFIRMACION ──
  if (orderNumber) {
    return (
      <>
        <style>{css}</style>
        <div className="co-overlay">
          <div className="co-sheet">
            <div className="co-handle" />
            <div className="co-confirm">
              <div className="co-confirm-icon">🦋</div>
              <div className="co-confirm-title">¡Orden recibida!</div>
              <p className="co-confirm-sub">
                Gracias por tu compra. Tu número de orden es:
              </p>
              <div className="co-confirm-num">{orderNumber}</div>
              <p className="co-confirm-sub">
                Nos pondremos en contacto contigo a la brevedad para coordinar la entrega.
              </p>
              <button className="co-confirm-btn" onClick={onClose}>
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── FORMULARIO ──
  return (
    <>
      <style>{css}</style>
      <div className="co-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="co-sheet">
          <div className="co-handle" />

          <div className="co-hdr">
            <span className="co-title">Completar orden</span>
            <button className="co-close" onClick={onClose} aria-label="Cerrar">✕</button>
          </div>

          <form className="co-body" onSubmit={submit}>

            {/* Resumen del carrito */}
            <div className="co-summary">
              <div className="co-summary-title">Tu pedido</div>
              {cart.map(item => (
                <div className="co-summary-item" key={item.key}>
                  <span>{item.name} <span style={{color:"var(--muted)"}}>×{item.qty}</span></span>
                  <span>{fmt(item.price * item.qty)}</span>
                </div>
              ))}
              <div className="co-summary-total">
                <span>Total</span>
                <span>{fmt(cartTotal)}</span>
              </div>
            </div>

            {/* Datos del cliente */}
            <div className="co-field">
              <label>Nombre completo *</label>
              <input
                value={form.name}
                onChange={e => set("name", e.target.value)}
                placeholder="Ana García"
                required
              />
            </div>

            <div className="co-field">
              <label>Correo electrónico *</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set("email", e.target.value)}
                placeholder="ana@ejemplo.com"
                required
              />
            </div>

            <div className="co-row">
              <div className="co-field">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => set("phone", e.target.value)}
                  placeholder="+53 5..."
                />
              </div>
              <div className="co-field">
                <label>Ciudad</label>
                <input
                  value={form.city}
                  onChange={e => set("city", e.target.value)}
                  placeholder="La Habana"
                />
              </div>
            </div>

            <div className="co-field">
              <label>Dirección de entrega</label>
              <input
                value={form.address}
                onChange={e => set("address", e.target.value)}
                placeholder="Calle, número, municipio"
              />
            </div>

            <div className="co-field">
              <label>Nota para el pedido</label>
              <textarea
                value={form.notes}
                onChange={e => set("notes", e.target.value)}
                placeholder="Instrucciones especiales, horario de entrega..."
              />
            </div>

            {error && <div className="co-err">{error}</div>}

            <button className="co-submit" type="submit" disabled={submitting}>
              {submitting ? "Enviando orden..." : "Completar orden"}
            </button>

          </form>
        </div>
      </div>
    </>
  );
}