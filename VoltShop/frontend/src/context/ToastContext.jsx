import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext({ showToast: () => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success", duration = 2500) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" style={{ position: 'fixed', top: 100, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`} style={{ background: t.type==='error' ? '#fef2f2' : '#f0fdf4', border: `1px solid ${t.type==='error' ? '#fecaca' : '#bbf7d0'}`, color: t.type==='error' ? '#991b1b' : '#16a34a', padding: '0.9rem 1rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
