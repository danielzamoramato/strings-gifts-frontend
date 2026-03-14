import { useState, useEffect, useCallback, useTransition, useRef } from "react";

const API = (import.meta.env.VITE_API_URL || "http://localhost:4000/api") + "/admin";

const CATEGORIES = ["pulseras", "collares", "aretes", "tobilleras"];
const STATUS_LIST = ["pendiente","confirmado","en_preparacion","enviado","entregado","cancelado"];
const STATUS_COLORS = {
  pendiente:       { bg: "#fff7ed", color: "#c2410c", dot: "#f97316" },
  confirmado:      { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
  en_preparacion:  { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
  enviado:         { bg: "#fdf4ff", color: "#7e22ce", dot: "#a855f7" },
  entregado:       { bg: "#f0fdf4", color: "#14532d", dot: "#16a34a" },
  cancelado:       { bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
};
const STATUS_LABELS = {
  pendiente: "Pendiente", confirmado: "Confirmado",
  en_preparacion: "En preparación", enviado: "Enviado",
  entregado: "Entregado", cancelado: "Cancelado",
};

const EMPTY_PRODUCT = {
  name: "", desc: "", price: "", stock: "",
  category: "pulseras", variants: "Única", img: "", esNuevo: false,
};

// ─── STYLES ────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:       #0f0d0b;
  --surface:  #1a1714;
  --surface2: #221f1b;
  --surface3: #2d2925;
  --border:   rgba(201,169,110,0.15);
  --border2:  rgba(201,169,110,0.3);
  --gold:     #c9a96e;
  --cream:    #faf7f2;
  --muted:    #7a6a5e;
  --red:      #ef4444;
  --radius:   12px;
  --sidebar:  220px;
  --bottom-nav: 64px;
}

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg); color: var(--cream);
  min-height: 100vh; min-height: 100dvh;
  -webkit-font-smoothing: antialiased;
}

/* ════════════════════════════════════════
   LAYOUT
════════════════════════════════════════ */
.adm { display: flex; min-height: 100vh; min-height: 100dvh; }

/* ════════════════════════════════════════
   SIDEBAR — oculto por defecto (mobile-first)
════════════════════════════════════════ */
.sidebar {
  display: none;
}

/* ════════════════════════════════════════
   BOTTOM NAV — visible en mobile
════════════════════════════════════════ */
.bottom-nav {
  position: fixed; bottom: 0; left: 0; right: 0;
  height: var(--bottom-nav);
  background: var(--surface);
  border-top: 1px solid var(--border);
  display: flex; align-items: stretch;
  z-index: 50;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
.bn-item {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 0.2rem; cursor: pointer;
  background: none; border: none;
  color: var(--muted); font-family: 'DM Sans', sans-serif;
  font-size: 0.6rem; letter-spacing: 0.08em;
  text-transform: uppercase; transition: color 0.2s;
  padding: 0.5rem 0;
}
.bn-item:active { opacity: 0.7; }
.bn-item.active { color: var(--gold); }
.bn-item-icon { font-size: 1.25rem; line-height: 1; }
.bn-logout {
  flex: 0 0 56px;
  border-left: 1px solid var(--border);
}

/* ════════════════════════════════════════
   MAIN CONTENT
════════════════════════════════════════ */
.adm-main {
  flex: 1; display: flex; flex-direction: column;
  min-height: 100vh; min-height: 100dvh;
  /* espacio para bottom nav en mobile */
  padding-bottom: calc(var(--bottom-nav) + env(safe-area-inset-bottom, 0px));
}

.adm-topbar {
  height: 54px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 0 1rem;
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 40;
}
.adm-topbar-title {
  font-family: 'Syne', sans-serif; font-size: 0.95rem;
  font-weight: 600; color: var(--cream); letter-spacing: 0.03em;
}
.adm-topbar-badge {
  background: var(--surface3); border: 1px solid var(--border);
  color: var(--muted); font-size: 0.68rem; padding: 0.2rem 0.65rem;
  border-radius: 30px; letter-spacing: 0.08em;
}
.adm-topbar-logo {
  font-family: 'Syne', sans-serif; font-size: 0.85rem;
  font-weight: 600; color: var(--gold); letter-spacing: 0.05em;
}

.adm-content {
  padding: 1rem; flex: 1;
}

/* ════════════════════════════════════════
   LOGIN
════════════════════════════════════════ */
.login-wrap {
  min-height: 100vh; min-height: 100dvh;
  display: flex; align-items: center; justify-content: center;
  background: var(--bg); padding: 1rem;
}
.login-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 20px; padding: 2rem 1.5rem;
  width: 100%; max-width: 360px;
}
.login-logo {
  font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 700;
  color: var(--gold); text-align: center; margin-bottom: 0.35rem;
}
.login-sub {
  color: var(--muted); font-size: 0.78rem;
  text-align: center; margin-bottom: 1.75rem;
}

/* ════════════════════════════════════════
   FORM FIELDS
════════════════════════════════════════ */
.field { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.9rem; }
.field label {
  font-size: 0.68rem; color: var(--muted);
  letter-spacing: 0.12em; text-transform: uppercase;
}
.field input, .field select, .field textarea {
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 9px; padding: 0.7rem 0.9rem;
  font-family: 'DM Sans', sans-serif; font-size: 0.85rem; color: var(--cream);
  outline: none; transition: border-color 0.2s; width: 100%;
  /* evita zoom en iOS */
  font-size: max(16px, 0.85rem);
}
.field input:focus, .field select:focus, .field textarea:focus { border-color: var(--gold); }
.field textarea { resize: vertical; min-height: 80px; }
.field select option { background: var(--surface2); }

.btn-primary {
  background: var(--gold); color: var(--bg);
  border: none; border-radius: 9px; padding: 0.85rem;
  font-family: 'Syne', sans-serif; font-size: 0.8rem; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer;
  width: 100%; transition: opacity 0.2s, transform 0.15s;
  /* tap target mínimo */
  min-height: 48px;
}
.btn-primary:active { transform: scale(0.98); opacity: 0.9; }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

.login-err {
  background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
  color: #fca5a5; border-radius: 8px; padding: 0.65rem 0.9rem;
  font-size: 0.78rem; margin-bottom: 1rem; text-align: center;
}

/* ════════════════════════════════════════
   DASHBOARD CARDS
════════════════════════════════════════ */
.dash-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem; margin-bottom: 1.5rem;
}
.dash-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 1rem;
  display: flex; flex-direction: column; gap: 0.3rem;
}
.dash-card-label {
  font-size: 0.62rem; color: var(--muted);
  letter-spacing: 0.15em; text-transform: uppercase;
}
.dash-card-value {
  font-family: 'Syne', sans-serif; font-size: 1.6rem;
  font-weight: 700; color: var(--cream); line-height: 1;
}
.dash-card-value.gold   { color: var(--gold); font-size: 1.3rem; }
.dash-card-value.red    { color: #f87171; }
.dash-card-value.orange { color: #fb923c; }
.dash-card-sub { font-size: 0.65rem; color: var(--muted); }

/* ════════════════════════════════════════
   SECTION HEADER
════════════════════════════════════════ */
.sec-hdr {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1rem;
}
.sec-hdr h2 {
  font-family: 'Syne', sans-serif; font-size: 0.95rem;
  font-weight: 600; letter-spacing: 0.03em;
}
.btn-add {
  background: var(--gold); color: var(--bg); border: none; border-radius: 8px;
  padding: 0.55rem 1rem; font-family: 'DM Sans', sans-serif;
  font-size: 0.75rem; font-weight: 500; cursor: pointer;
  display: flex; align-items: center; gap: 0.4rem;
  transition: opacity 0.2s; min-height: 40px;
}
.btn-add:active { opacity: 0.85; }

/* ════════════════════════════════════════
   FILTERS
════════════════════════════════════════ */
.filters {
  display: flex; gap: 0.5rem;
  margin-bottom: 1rem;
  overflow-x: auto; padding-bottom: 2px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.filters::-webkit-scrollbar { display: none; }
.filter-btn {
  background: var(--surface2); border: 1px solid var(--border);
  color: var(--muted); border-radius: 30px;
  padding: 0.35rem 0.85rem; white-space: nowrap;
  font-family: 'DM Sans', sans-serif; font-size: 0.72rem; cursor: pointer;
  transition: all 0.2s; letter-spacing: 0.05em; text-transform: capitalize;
  flex-shrink: 0; min-height: 36px;
}
.filter-btn.active {
  background: var(--surface3); border-color: var(--gold); color: var(--gold);
}

/* ════════════════════════════════════════
   TABLA → CARDS en mobile
════════════════════════════════════════ */
.table-wrap {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); overflow: hidden;
}

/* Ocultar tabla real en mobile, mostrar cards */
.table-wrap table { display: none; }

/* Cards de producto */
.mob-list { display: flex; flex-direction: column; }
.mob-card {
  padding: 0.9rem 1rem; border-bottom: 1px solid var(--border);
  display: flex; gap: 0.75rem; align-items: flex-start;
}
.mob-card:last-child { border-bottom: none; }
.mob-card-img {
  width: 48px; height: 48px; border-radius: 8px;
  object-fit: cover; border: 1px solid var(--border); flex-shrink: 0;
}
.mob-card-body { flex: 1; min-width: 0; }
.mob-card-name {
  font-weight: 500; font-size: 0.82rem; color: var(--cream);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.mob-card-meta {
  font-size: 0.7rem; color: var(--muted); margin-top: 0.15rem;
  display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;
}
.mob-card-price {
  font-family: 'Syne', sans-serif; font-size: 0.82rem;
  font-weight: 600; color: var(--cream);
}
.mob-card-actions {
  display: flex; gap: 0.4rem; align-items: center; flex-shrink: 0;
}

/* Cards de orden */
.mob-order-card {
  padding: 0.9rem 1rem; border-bottom: 1px solid var(--border);
  cursor: pointer; transition: background 0.15s;
}
.mob-order-card:last-child { border-bottom: none; }
.mob-order-card:active { background: var(--surface2); }
.mob-order-top {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 0.35rem;
}
.mob-order-num {
  font-family: 'Syne', sans-serif; font-size: 0.82rem;
  font-weight: 600; color: var(--gold);
}
.mob-order-total {
  font-family: 'Syne', sans-serif; font-size: 0.88rem;
  font-weight: 600; color: var(--cream);
}
.mob-order-customer { font-size: 0.78rem; color: var(--cream); font-weight: 500; }
.mob-order-email { font-size: 0.68rem; color: var(--muted); }
.mob-order-bottom {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 0.5rem;
}
.mob-order-date { font-size: 0.68rem; color: var(--muted); }

/* Tabla del dashboard (órdenes recientes) */
.dash-table-wrap {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); overflow: hidden;
}
.dash-mob-list { display: flex; flex-direction: column; }
.dash-mob-row {
  padding: 0.75rem 1rem; border-bottom: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: center;
}
.dash-mob-row:last-child { border-bottom: none; }
.dash-mob-left {}
.dash-mob-num {
  font-family: 'Syne', sans-serif; font-size: 0.78rem;
  font-weight: 600; color: var(--gold);
}
.dash-mob-name { font-size: 0.75rem; color: var(--cream); margin-top: 0.1rem; }
.dash-mob-right { text-align: right; }
.dash-mob-total {
  font-family: 'Syne', sans-serif; font-size: 0.82rem;
  font-weight: 600; color: var(--cream);
}
.dash-mob-date { font-size: 0.65rem; color: var(--muted); margin-top: 0.1rem; }

/* ════════════════════════════════════════
   BADGES & CHIPS
════════════════════════════════════════ */
.prod-name { font-weight: 500; color: var(--cream); font-size: 0.83rem; }
.prod-cat {
  font-size: 0.68rem; color: var(--muted);
  letter-spacing: 0.08em; text-transform: capitalize;
}
.stock-badge {
  display: inline-flex; align-items: center; gap: 0.25rem;
  border-radius: 6px; padding: 0.18rem 0.55rem;
  font-size: 0.68rem; font-weight: 500;
}
.stock-ok   { background: rgba(34,197,94,0.1);  color: #86efac; }
.stock-low  { background: rgba(251,146,60,0.1); color: #fdba74; }
.stock-out  { background: rgba(239,68,68,0.1);  color: #fca5a5; }

.action-btns { display: flex; gap: 0.4rem; }
.btn-icon {
  background: var(--surface2); border: 1px solid var(--border);
  color: var(--muted); border-radius: 7px;
  width: 36px; height: 36px; cursor: pointer; font-size: 0.9rem;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.btn-icon:active { opacity: 0.7; }
.btn-icon.danger:active { color: #ef4444; }
.btn-icon.edit:active   { color: var(--gold); }

.status-chip {
  display: inline-flex; align-items: center; gap: 0.3rem;
  border-radius: 6px; padding: 0.22rem 0.65rem;
  font-size: 0.7rem; font-weight: 500;
}
.status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

/* ════════════════════════════════════════
   MODALES — bottom sheet en mobile
════════════════════════════════════════ */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
  z-index: 200; display: flex;
  align-items: flex-end;        /* ← bottom sheet por defecto */
  justify-content: center;
  animation: fadeIn 0.2s ease;
  padding: 0;
}
@keyframes fadeIn { from{opacity:0} to{opacity:1} }

.modal {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 20px 20px 0 0;   /* ← esquinas arriba */
  padding: 0 1.25rem 1.5rem;
  width: 100%;
  max-height: 92dvh; overflow-y: auto;
  animation: slideUp 0.3s cubic-bezier(0.32,0.72,0,1);
  padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
}
@keyframes slideUp {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}

.modal-handle {
  width: 36px; height: 4px; border-radius: 4px;
  background: var(--surface3); margin: 0.75rem auto 1rem;
}
.modal-hdr {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1.25rem;
}
.modal-title {
  font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 600;
}
.modal-close {
  background: var(--surface2); border: 1px solid var(--border);
  color: var(--muted); border-radius: 50%;
  width: 34px; height: 34px; cursor: pointer; font-size: 0.9rem;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.modal-actions {
  display: flex; gap: 0.6rem; margin-top: 1.25rem;
}
.btn-cancel {
  background: none; border: 1px solid var(--border); color: var(--muted);
  border-radius: 8px; padding: 0.75rem 1rem;
  font-family: 'DM Sans', sans-serif; font-size: 0.8rem; cursor: pointer;
  flex: 1; min-height: 48px; transition: all 0.2s;
}
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.field-check {
  display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;
}
.field-check input { width: auto; width: 18px; height: 18px; }
.field-check label { font-size: 0.82rem; color: var(--cream); cursor: pointer; }

/* ════════════════════════════════════════
   ORDER DETAIL MODAL
════════════════════════════════════════ */
.order-items { display: flex; flex-direction: column; gap: 0.6rem; margin: 1rem 0; }
.order-item {
  background: var(--surface2); border-radius: 9px; padding: 0.75rem;
  display: flex; gap: 0.75rem; align-items: center;
}
.order-item img { width: 44px; height: 44px; border-radius: 6px; object-fit: cover; }
.order-item-info { flex: 1; min-width: 0; }
.order-item-name { font-size: 0.82rem; font-weight: 500; }
.order-item-meta { font-size: 0.68rem; color: var(--muted); margin-top: 0.1rem; }
.order-item-price {
  font-family: 'Syne', sans-serif; font-size: 0.82rem;
  font-weight: 600; color: var(--gold); flex-shrink: 0;
}
.order-total-row {
  display: flex; justify-content: space-between;
  padding: 0.75rem 0; border-top: 1px solid var(--border);
  font-family: 'Syne', sans-serif; font-weight: 600;
}
.customer-block {
  background: var(--surface2); border-radius: 9px;
  padding: 0.9rem 1rem; margin-bottom: 1rem; display: grid; gap: 0.3rem;
}
.customer-block div { font-size: 0.75rem; color: var(--muted); }
.customer-block div span { color: var(--cream); }
.status-select {
  background: var(--surface2); border: 1px solid var(--border);
  color: var(--cream); border-radius: 8px; padding: 0.6rem 0.75rem;
  font-family: 'DM Sans', sans-serif; font-size: max(16px, 0.8rem);
  outline: none; cursor: pointer; width: 100%;
  transition: border-color 0.2s;
}
.status-select:focus { border-color: var(--gold); }

/* ════════════════════════════════════════
   EMPTY / LOADING
════════════════════════════════════════ */
.empty-state {
  text-align: center; padding: 3rem 1rem;
  color: var(--muted); font-size: 0.82rem;
}
.loading {
  color: var(--muted); font-size: 0.82rem;
  padding: 2rem 1rem; text-align: center;
}

/* ════════════════════════════════════════
   PAGINATION
════════════════════════════════════════ */
.pagination {
  display: flex; gap: 0.4rem;
  justify-content: center; margin-top: 1rem;
}
.page-btn {
  background: var(--surface2); color: var(--muted);
  border: 1px solid var(--border); border-radius: 7px;
  width: 36px; height: 36px; cursor: pointer; font-size: 0.78rem;
  display: flex; align-items: center; justify-content: center;
}
.page-btn.active {
  background: var(--gold); color: var(--bg); border-color: var(--gold);
}

/* ════════════════════════════════════════
   TOAST
════════════════════════════════════════ */
.toast {
  position: fixed; bottom: calc(var(--bottom-nav) + 0.75rem); left: 1rem; right: 1rem;
  z-index: 500; background: var(--surface); border: 1px solid var(--border2);
  border-radius: 10px; padding: 0.75rem 1rem;
  font-size: 0.8rem; display: flex; align-items: center; gap: 0.5rem;
  box-shadow: 0 8px 30px rgba(0,0,0,0.3);
  animation: slideInUp 0.3s ease;
}
@keyframes slideInUp {
  from { transform: translateY(16px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
.toast.ok  { border-color: rgba(34,197,94,0.4);  color: #86efac; }
.toast.err { border-color: rgba(239,68,68,0.4);  color: #fca5a5; }

/* ════════════════════════════════════════
   TABLET — 640px+
════════════════════════════════════════ */
@media (min-width: 640px) {
  .adm-content { padding: 1.5rem; }
  .dash-grid { grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  .dash-card-value.gold { font-size: 1.6rem; }
  .modal { border-radius: 18px; max-width: 500px; padding: 1.5rem; }
  .modal-overlay { align-items: center; }
  .modal-handle { display: none; }
  .toast { left: auto; right: 1.5rem; width: auto; min-width: 240px; }
}

/* ════════════════════════════════════════
   DESKTOP — 1024px+
════════════════════════════════════════ */
@media (min-width: 1024px) {
  /* Mostrar sidebar, ocultar bottom nav */
  .sidebar {
    display: flex;
    flex-direction: column;
    width: var(--sidebar);
    background: var(--surface);
    border-right: 1px solid var(--border);
    position: fixed; top: 0; left: 0; height: 100vh; z-index: 50;
  }
  .bottom-nav { display: none; }

  /* Main sin padding-bottom */
  .adm-main {
    margin-left: var(--sidebar);
    padding-bottom: 0;
  }
  .adm-topbar {
    padding: 0 2rem; height: 58px;
  }
  .adm-topbar-logo { display: none; }
  .adm-content { padding: 2rem; max-width: 1200px; }

  /* Mostrar tabla real, ocultar cards */
  .table-wrap table { display: table; }
  .mob-list { display: none; }
  .dash-table-wrap table { display: table; }
  .dash-mob-list { display: none; }

  /* Dashboard */
  .dash-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
  .dash-card { padding: 1.25rem; }
  .dash-card-value { font-size: 1.9rem; }
  .dash-card-value.gold { font-size: 1.9rem; }

  /* Tabla */
  .table-wrap { overflow: hidden; }
  table { width: 100%; border-collapse: collapse; }
  thead { background: var(--surface2); }
  th {
    padding: 0.7rem 1rem; text-align: left;
    font-size: 0.68rem; color: var(--muted);
    letter-spacing: 0.12em; text-transform: uppercase; font-weight: 500;
    border-bottom: 1px solid var(--border);
  }
  td {
    padding: 0.85rem 1rem; font-size: 0.82rem;
    border-bottom: 1px solid var(--border); vertical-align: middle;
  }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.02); }
  .empty-row td {
    text-align: center; padding: 3rem; color: var(--muted);
  }

  .prod-img-thumb {
    width: 42px; height: 42px; border-radius: 7px;
    object-fit: cover; border: 1px solid var(--border);
  }
  .order-number {
    font-family: 'Syne', sans-serif; font-size: 0.82rem;
    font-weight: 600; color: var(--gold);
  }
  .customer-name { font-weight: 500; font-size: 0.82rem; }
  .customer-email { font-size: 0.7rem; color: var(--muted); }
  .order-total {
    font-family: 'Syne', sans-serif; font-weight: 600; color: var(--cream);
  }

  /* Toast vuelve a esquina */
  .toast {
    bottom: 1.5rem; right: 1.5rem; left: auto;
  }

  /* Modal centrado */
  .modal { border-radius: 18px; max-width: 500px; padding: 1.75rem; }
  .modal-overlay { align-items: center; }
  .modal-handle { display: none; }

  /* Hover states para desktop */
  .btn-icon.danger:hover { border-color: #ef4444; color: #ef4444; }
  .btn-icon.edit:hover { border-color: var(--gold); color: var(--gold); }
  .btn-cancel:hover { border-color: var(--border2); color: var(--cream); }
  .filter-btn:hover { border-color: var(--border2); color: var(--cream); }
}

/* ════════════════════════════════════════
   SIDEBAR (solo desktop)
════════════════════════════════════════ */
.sb-logo {
  padding: 1.5rem 1.25rem 1.2rem;
  border-bottom: 1px solid var(--border);
  font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 600;
  color: var(--gold); display: flex; align-items: center; gap: 0.5rem;
  letter-spacing: 0.05em;
}
.sb-logo span { color: var(--cream); font-weight: 400; font-size: 0.8rem; }
.sb-nav {
  flex: 1; padding: 1rem 0.75rem;
  display: flex; flex-direction: column; gap: 0.25rem;
}
.sb-item {
  background: none; border: none; cursor: pointer;
  padding: 0.7rem 0.9rem; border-radius: 9px;
  font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
  color: var(--muted); text-align: left;
  display: flex; align-items: center; gap: 0.6rem;
  transition: all 0.2s; width: 100%;
}
.sb-item:hover { background: var(--surface2); color: var(--cream); }
.sb-item.active { background: var(--surface3); color: var(--gold); font-weight: 500; }
.sb-item-icon { font-size: 1rem; width: 18px; text-align: center; }
.sb-logout {
  padding: 1rem 0.75rem; border-top: 1px solid var(--border);
}
.sb-logout button {
  background: none; border: 1px solid var(--border);
  color: var(--muted); border-radius: 9px; padding: 0.6rem 0.9rem;
  font-family: 'DM Sans', sans-serif; font-size: 0.78rem;
  cursor: pointer; width: 100%; transition: all 0.2s;
  display: flex; align-items: center; gap: 0.5rem;
}
.sb-logout button:hover { border-color: var(--red); color: var(--red); }
`;

// ─── HELPERS ───────────────────────────────────────────────────────────────
const fmt     = (n) => `CUP ${Number(n).toLocaleString("es-CU", { minimumFractionDigits: 2 })}`;
const fmtDate = (d) => new Date(d).toLocaleDateString("es", { day:"2-digit", month:"short", year:"numeric" });

function useApi(token, onUnauthorized) {
  const call = useCallback(async (path, options = {}) => {
    const res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
    if (res.status === 401) {
      onUnauthorized?.();
      return { ok: false, message: "Sesión expirada" };
    }
    return res.json();
  }, [token, onUnauthorized]);
  return call;
}

// ─── COMPONENTS ────────────────────────────────────────────────────────────
function StatusChip({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.pendiente;
  return (
    <span className="status-chip" style={{ background: s.bg, color: s.color }}>
      <span className="status-dot" style={{ background: s.dot }} />
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function StockBadge({ stock }) {
  if (stock === 0) return <span className="stock-badge stock-out">● Agotado</span>;
  if (stock <= 4)  return <span className="stock-badge stock-low">● Pocas ({stock})</span>;
  return            <span className="stock-badge stock-ok">● {stock}</span>;
}

// ─── LOGIN ─────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [form, setForm]       = useState({ username: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res  = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) onLogin(data.token);
      else setError(data.message || "Error al iniciar sesión");
    } catch {
      setError("No se pudo conectar al servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">🦋 Strings Gifts</div>
        <div className="login-sub">Panel de administración</div>
        {error && <div className="login-err">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Usuario</label>
            <input value={form.username} onChange={e => setForm(p => ({...p, username: e.target.value}))} autoComplete="username" />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input type="password" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} autoComplete="current-password" />
          </div>
          <button className="btn-primary" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
        </form>
      </div>
    </div>
  );
}

// ─── DASHBOARD ─────────────────────────────────────────────────────────────
function Dashboard({ call }) {
  const [data, setData]              = useState(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    call("/dashboard").then(r => {
      startTransition(() => { if (r.ok) setData(r.data); });
    });
  }, [call]);

  if (isPending || !data) return <p className="loading">Cargando...</p>;

  const byStatus = STATUS_LIST.reduce((acc, s) => {
    acc[s] = data.orders.byStatus.find(b => b._id === s)?.count || 0;
    return acc;
  }, {});

  return (
    <>
      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card-label">Ingresos totales</div>
          <div className="dash-card-value gold">{fmt(data.orders.revenue)}</div>
          <div className="dash-card-sub">Órdenes no canceladas</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">Órdenes</div>
          <div className="dash-card-value">{data.orders.total}</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">Productos activos</div>
          <div className="dash-card-value">{data.products.total}</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">Agotados</div>
          <div className="dash-card-value red">{data.products.outOfStock}</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">Stock bajo</div>
          <div className="dash-card-value orange">{data.products.lowStock}</div>
          <div className="dash-card-sub">Menos de 4 unidades</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">Pendientes</div>
          <div className="dash-card-value orange">{byStatus.pendiente}</div>
        </div>
      </div>

      <div className="sec-hdr"><h2>Órdenes recientes</h2></div>

      {/* Mobile: cards */}
      <div className="dash-table-wrap">
        <div className="dash-mob-list">
          {data.orders.recent.length === 0 ? (
            <div className="empty-state">No hay órdenes aún</div>
          ) : data.orders.recent.map(o => (
            <div className="dash-mob-row" key={o._id}>
              <div className="dash-mob-left">
                <div className="dash-mob-num">{o.orderNumber}</div>
                <div className="dash-mob-name">{o.customer?.name}</div>
              </div>
              <div className="dash-mob-right">
                <div className="dash-mob-total">{fmt(o.total)}</div>
                <div className="dash-mob-date">{fmtDate(o.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Desktop: tabla */}
        <table>
          <thead>
            <tr><th>Número</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Fecha</th></tr>
          </thead>
          <tbody>
            {data.orders.recent.length === 0 ? (
              <tr className="empty-row"><td colSpan="5">No hay órdenes aún</td></tr>
            ) : data.orders.recent.map(o => (
              <tr key={o._id}>
                <td><span className="order-number">{o.orderNumber}</span></td>
                <td>{o.customer?.name}</td>
                <td><span className="order-total">{fmt(o.total)}</span></td>
                <td><StatusChip status={o.status} /></td>
                <td style={{color:"var(--muted)",fontSize:"0.75rem"}}>{fmtDate(o.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── PRODUCT MODAL ─────────────────────────────────────────────────────────
function ProductModal({ product, onClose, onSave }) {
  const [form, setForm]     = useState(
    product
      ? { ...product, variants: product.variants.join(", "), esNuevo: product.esNuevo || false }
      : EMPTY_PRODUCT
  );
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      await onSave({
        ...form,
        price:    Number(form.price),
        stock:    Number(form.stock),
        variants: form.variants.split(",").map(v => v.trim()).filter(Boolean),
      });
      onClose();
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-handle" />
        <div className="modal-hdr">
          <span className="modal-title">{product ? "Editar producto" : "Nuevo producto"}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {error && <div className="login-err">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Nombre</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} required />
          </div>
          <div className="field">
            <label>Descripción</label>
            <textarea value={form.desc} onChange={e => set("desc", e.target.value)} required />
          </div>
          <div className="form-row">
            <div className="field">
              <label>Precio</label>
              <input type="number" inputMode="decimal" value={form.price} onChange={e => set("price", e.target.value)} required min="0" />
            </div>
            <div className="field">
              <label>Stock</label>
              <input type="number" inputMode="numeric" value={form.stock} onChange={e => set("stock", e.target.value)} required min="0" />
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label>Categoría</label>
              <select value={form.category} onChange={e => set("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Variantes (coma)</label>
              <input value={form.variants} onChange={e => set("variants", e.target.value)} placeholder="S, M, L" />
            </div>
          </div>
          <div className="field">
            <label>URL de imagen</label>
            <input value={form.img} onChange={e => set("img", e.target.value)} required placeholder="https://..." inputMode="url" />
          </div>
          <div className="field-check">
            <input type="checkbox" id="esNuevo" checked={form.esNuevo} onChange={e => set("esNuevo", e.target.checked)} />
            <label htmlFor="esNuevo">Marcar como nuevo (badge "New")</label>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" style={{flex:2}} disabled={saving}>
              {saving ? "Guardando..." : product ? "Guardar cambios" : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── PRODUCTS VIEW ─────────────────────────────────────────────────────────
function Products({ call, showToast }) {
  const [products, setProducts]      = useState([]);
  const [catFilter, setCatFilter]    = useState("todas");
  const [editing, setEditing]        = useState(null);
  const [creating, setCreating]      = useState(false);
  const [isPending, startTransition] = useTransition();

  const load = useCallback(() => {
    const q = catFilter !== "todas" ? `?category=${catFilter}` : "";
    call(`/products${q}`).then(r => {
      startTransition(() => { if (r.ok) setProducts(r.data); });
    });
  }, [call, catFilter]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (form) => {
    const isEdit = !!editing;
    const r = await call(
      isEdit ? `/products/${editing._id}` : "/products",
      { method: isEdit ? "PUT" : "POST", body: JSON.stringify(form) }
    );
    if (!r.ok) throw new Error(r.message);
    showToast(isEdit ? "Producto actualizado" : "Producto creado", "ok");
    load();
  };

  const handleDelete = async (p) => {
    if (!confirm(`Desactivar "${p.name}"?`)) return;
    const r = await call(`/products/${p._id}`, { method: "DELETE" });
    if (r.ok) { showToast("Producto desactivado", "ok"); load(); }
    else showToast(r.message, "err");
  };

  const empty = !isPending && products.length === 0;

  return (
    <>
      <div className="sec-hdr">
        <h2>Productos</h2>
        <button className="btn-add" onClick={() => setCreating(true)}>+ Nuevo</button>
      </div>

      <div className="filters">
        {["todas", ...CATEGORIES].map(c => (
          <button key={c} className={`filter-btn ${catFilter === c ? "active" : ""}`}
            onClick={() => setCatFilter(c)}>{c}</button>
        ))}
      </div>

      <div className="table-wrap">
        {/* ── MOBILE: cards ── */}
        <div className="mob-list">
          {isPending ? (
            <div className="empty-state">Cargando...</div>
          ) : empty ? (
            <div className="empty-state">No hay productos</div>
          ) : products.map(p => (
            <div className="mob-card" key={p._id}>
              <img className="mob-card-img" src={p.img} alt={p.name} />
              <div className="mob-card-body">
                <div className="mob-card-name">{p.name}</div>
                <div className="mob-card-meta">
                  <span className="mob-card-price">{fmt(p.price)}</span>
                  <StockBadge stock={p.stock} />
                  {p.esNuevo && <span style={{fontSize:"0.62rem",color:"var(--gold)"}}>NEW</span>}
                </div>
                <div style={{fontSize:"0.65rem",color:"var(--muted)",marginTop:"0.2rem",textTransform:"capitalize"}}>
                  {p.category} · {p.variants?.join(", ")}
                </div>
              </div>
              <div className="mob-card-actions">
                <button className="btn-icon edit" onClick={() => setEditing(p)} title="Editar">✏️</button>
                <button className="btn-icon danger" onClick={() => handleDelete(p)} title="Desactivar">🗑</button>
              </div>
            </div>
          ))}
        </div>

        {/* ── DESKTOP: tabla ── */}
        <table>
          <thead>
            <tr><th>Producto</th><th>Precio</th><th>Stock</th><th>Categoría</th><th>Variantes</th><th></th></tr>
          </thead>
          <tbody>
            {isPending ? (
              <tr className="empty-row"><td colSpan="6">Cargando...</td></tr>
            ) : empty ? (
              <tr className="empty-row"><td colSpan="6">No hay productos</td></tr>
            ) : products.map(p => (
              <tr key={p._id}>
                <td>
                  <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
                    <img className="prod-img-thumb" src={p.img} alt={p.name} />
                    <div>
                      <div className="prod-name">{p.name}</div>
                      {p.esNuevo && <span style={{fontSize:"0.62rem",color:"var(--gold)",letterSpacing:"0.1em"}}>NEW</span>}
                    </div>
                  </div>
                </td>
                <td style={{fontFamily:"'Syne',sans-serif",fontWeight:600}}>{fmt(p.price)}</td>
                <td><StockBadge stock={p.stock} /></td>
                <td><span className="prod-cat">{p.category}</span></td>
                <td style={{fontSize:"0.72rem",color:"var(--muted)"}}>{p.variants?.join(", ")}</td>
                <td>
                  <div className="action-btns">
                    <button className="btn-icon edit" onClick={() => setEditing(p)}>✏️</button>
                    <button className="btn-icon danger" onClick={() => handleDelete(p)}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <ProductModal
          product={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </>
  );
}

// ─── ORDER DETAIL MODAL ─────────────────────────────────────────────────────
function OrderModal({ order, onClose, onStatusChange }) {
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await onStatusChange(order.orderNumber, status);
    setSaving(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{maxWidth:520}}>
        <div className="modal-handle" />
        <div className="modal-hdr">
          <div>
            <div className="modal-title">{order.orderNumber}</div>
            <div style={{fontSize:"0.7rem",color:"var(--muted)",marginTop:"0.15rem"}}>{fmtDate(order.createdAt)}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="customer-block">
          <div><span>{order.customer?.name}</span></div>
          <div>Email: <span>{order.customer?.email}</span></div>
          {order.customer?.phone   && <div>Teléfono: <span>{order.customer.phone}</span></div>}
          {order.customer?.address && <div>Dirección: <span>{order.customer.address}</span></div>}
          {order.customer?.city    && <div>Ciudad: <span>{order.customer.city}</span></div>}
          {order.notes             && <div>Nota: <span>{order.notes}</span></div>}
        </div>

        <div style={{fontSize:"0.7rem",color:"var(--muted)",marginBottom:"0.5rem",letterSpacing:"0.1em",textTransform:"uppercase"}}>Productos</div>
        <div className="order-items">
          {order.items?.map((item, i) => (
            <div className="order-item" key={i}>
              <img src={item.img} alt={item.name} />
              <div className="order-item-info">
                <div className="order-item-name">{item.name}</div>
                <div className="order-item-meta">{item.variant} · Cant: {item.qty}</div>
              </div>
              <div className="order-item-price">{fmt(item.price * item.qty)}</div>
            </div>
          ))}
        </div>

        <div className="order-total-row">
          <span>Total</span>
          <span style={{color:"var(--gold)"}}>{fmt(order.total)}</span>
        </div>

        <div className="field" style={{marginTop:"1rem"}}>
          <label>Cambiar estado</label>
          <select className="status-select" value={status} onChange={e => setStatus(e.target.value)}>
            {STATUS_LIST.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cerrar</button>
          <button className="btn-primary" style={{flex:2}} onClick={save} disabled={saving || status === order.status}>
            {saving ? "Guardando..." : "Actualizar estado"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ORDERS VIEW ───────────────────────────────────────────────────────────
function Orders({ call, showToast }) {
  const [orders, setOrders]             = useState([]);
  const [total, setTotal]               = useState(0);
  const [statusFilter, setStatusFilter] = useState("todas");
  const [selected, setSelected]         = useState(null);
  const [page, setPage]                 = useState(1);
  const [pages, setPages]               = useState(1);
  const [isPending, startTransition]    = useTransition();

  const load = useCallback((p = page) => {
    const q = statusFilter !== "todas"
      ? `?status=${statusFilter}&page=${p}`
      : `?page=${p}`;
    call(`/orders${q}`).then(r => {
      startTransition(() => {
        if (r.ok) { setOrders(r.data); setTotal(r.total); setPages(r.pages); }
      });
    });
  }, [call, statusFilter, page]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (orderNumber, status) => {
    const r = await call(`/orders/${orderNumber}/status`, {
      method: "PATCH", body: JSON.stringify({ status }),
    });
    if (r.ok) { showToast("Estado actualizado", "ok"); load(); }
    else showToast(r.message, "err");
  };

  const empty = !isPending && orders.length === 0;

  return (
    <>
      <div className="sec-hdr">
        <h2>Órdenes <span style={{color:"var(--muted)",fontWeight:400,fontSize:"0.82rem"}}>({total})</span></h2>
      </div>

      <div className="filters">
        {["todas", ...STATUS_LIST].map(s => (
          <button key={s} className={`filter-btn ${statusFilter === s ? "active" : ""}`}
            onClick={() => { setStatusFilter(s); setPage(1); load(1); }}>
            {s === "todas" ? "Todas" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        {/* ── MOBILE: cards ── */}
        <div className="mob-list">
          {isPending ? (
            <div className="empty-state">Cargando...</div>
          ) : empty ? (
            <div className="empty-state">No hay órdenes</div>
          ) : orders.map(o => (
            <div className="mob-order-card" key={o._id} onClick={() => setSelected(o)}>
              <div className="mob-order-top">
                <span className="mob-order-num">{o.orderNumber}</span>
                <span className="mob-order-total">{fmt(o.total)}</span>
              </div>
              <div className="mob-order-customer">{o.customer?.name}</div>
              <div className="mob-order-email">{o.customer?.email}</div>
              <div className="mob-order-bottom">
                <StatusChip status={o.status} />
                <span className="mob-order-date">{fmtDate(o.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── DESKTOP: tabla ── */}
        <table>
          <thead>
            <tr><th>Orden</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Fecha</th><th></th></tr>
          </thead>
          <tbody>
            {isPending ? (
              <tr className="empty-row"><td colSpan="6">Cargando...</td></tr>
            ) : empty ? (
              <tr className="empty-row"><td colSpan="6">No hay órdenes</td></tr>
            ) : orders.map(o => (
              <tr key={o._id}>
                <td><span className="order-number">{o.orderNumber}</span></td>
                <td>
                  <div className="customer-name">{o.customer?.name}</div>
                  <div className="customer-email">{o.customer?.email}</div>
                </td>
                <td><span className="order-total">{fmt(o.total)}</span></td>
                <td><StatusChip status={o.status} /></td>
                <td style={{color:"var(--muted)",fontSize:"0.72rem"}}>{fmtDate(o.createdAt)}</td>
                <td>
                  <button className="btn-icon edit" onClick={() => setSelected(o)} title="Ver detalle">👁</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="pagination">
          {Array.from({length:pages},(_,i)=>i+1).map(p => (
            <button key={p} className={`page-btn ${p===page?"active":""}`}
              onClick={() => { setPage(p); load(p); }}>{p}</button>
          ))}
        </div>
      )}

      {selected && (
        <OrderModal
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
}

// ─── APP ───────────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [token, setToken] = useState(() => localStorage.getItem("adm_token") || "");
  const [view, setView]   = useState("dashboard");
  const [toast, setToast] = useState(null);
  const toastTimer        = useRef(null);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const login  = (t) => { localStorage.setItem("adm_token", t); setToken(t); };
  const logout = ()  => { localStorage.removeItem("adm_token"); setToken(""); };
  const call   = useApi(token, logout);

  if (!token) return (
    <>
      <style>{css}</style>
      <Login onLogin={login} />
    </>
  );

  const NAV = [
    { key: "dashboard", label: "Inicio",    icon: "◈" },
    { key: "products",  label: "Productos", icon: "◇" },
    { key: "orders",    label: "Órdenes",   icon: "○" },
  ];
  const VIEW_TITLES = { dashboard: "Dashboard", products: "Productos", orders: "Órdenes" };

  return (
    <>
      <style>{css}</style>
      <div className="adm">

        {/* ── SIDEBAR (desktop) ── */}
        <aside className="sidebar">
          <div className="sb-logo">🦋 <span>Strings Gifts</span></div>
          <nav className="sb-nav">
            {NAV.map(n => (
              <button key={n.key} className={`sb-item ${view === n.key ? "active" : ""}`}
                onClick={() => setView(n.key)}>
                <span className="sb-item-icon">{n.icon}</span>
                {n.label}
              </button>
            ))}
          </nav>
          <div className="sb-logout">
            <button onClick={logout}><span>↩</span> Cerrar sesión</button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="adm-main">
          <div className="adm-topbar">
            <span className="adm-topbar-logo">🦋 Strings Gifts</span>
            <span className="adm-topbar-title">{VIEW_TITLES[view]}</span>
            <span className="adm-topbar-badge">Admin</span>
          </div>

          <div className="adm-content">
            {view === "dashboard" && <Dashboard call={call} />}
            {view === "products"  && <Products  call={call} showToast={showToast} />}
            {view === "orders"    && <Orders    call={call} showToast={showToast} />}
          </div>
        </div>

        {/* ── BOTTOM NAV (mobile) ── */}
        <nav className="bottom-nav">
          {NAV.map(n => (
            <button key={n.key} className={`bn-item ${view === n.key ? "active" : ""}`}
              onClick={() => setView(n.key)}>
              <span className="bn-item-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
          <button className="bn-item bn-logout" onClick={logout}>
            <span className="bn-item-icon">↩</span>
            Salir
          </button>
        </nav>

      </div>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "ok" ? "✓" : "✕"} {toast.msg}
        </div>
      )}
    </>
  );
}