import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const CartContext = createContext({ items: [], totalCount: 0, addItem: () => {}, updateQty: () => {}, removeItem: () => {}, clear: () => {}, subtotal: 0, shipping: 0, total: 0, FREE_SHIPPING_THRESHOLD: 50 });

const STORAGE_KEY = "cart";
const FREE_SHIPPING_THRESHOLD = 50; // د.أ
const SHIPPING_FEE = 2; // د.أ

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Sync from external changes (legacy code writing directly to localStorage or other tabs)
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        setItems((prev) => JSON.stringify(prev) !== JSON.stringify(parsed) ? parsed : prev);
      } catch {}
    };
    const onStorage = (e) => { if (e.key === STORAGE_KEY) syncFromStorage(); };
    window.addEventListener('storage', onStorage);
    window.addEventListener('cart:sync', syncFromStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('cart:sync', syncFromStorage);
    };
  }, []);

  const addItem = useCallback((product, quantity = 1) => {
    const id = product._id || product.id;
    setItems((prev) => {
      const next = [...prev];
      const existing = next.find((x) => x.id === id);
      if (existing) existing.quantity += quantity; else next.push({ id, name: product.name, price: product.price, image: product.image, warranty: product.warranty, quantity });
      return next;
    });
  }, []);

  const updateQty = useCallback((id, quantity) => {
    setItems((prev) => prev.map((x) => x.id === id ? { ...x, quantity } : x));
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totalCount = useMemo(() => items.reduce((t, x) => t + (x.quantity || 0), 0), [items]);

  const subtotal = useMemo(() => items.reduce((t, x) => t + (Number(x.price || 0) * Number(x.quantity || 0)), 0), [items]);
  const shipping = useMemo(() => (items.length === 0 ? 0 : (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE)), [items.length, subtotal]);
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  const value = useMemo(() => ({ items, totalCount, addItem, updateQty, removeItem, clear, subtotal, shipping, total, FREE_SHIPPING_THRESHOLD }), [items, totalCount, addItem, updateQty, removeItem, clear, subtotal, shipping, total]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { return useContext(CartContext); }
