import React from "react";
import "../styles/admin.css";

export default function AdminDashboard() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3>Volt Admin</h3>
        <nav>
          <a href="/admin/products">المنتجات</a>
          <a href="/admin/orders">الطلبات</a>
        </nav>
        <button className="logout" onClick={() => { localStorage.removeItem("adminToken"); localStorage.removeItem("isAdmin"); window.location.href = "/"; }}>خروج</button>
      </aside>
      <main className="admin-main">
        <h2>مرحباً بالأدمن</h2>
        <p>من هنا تستطيع إدارة المنتجات والطلبات.</p>
      </main>
    </div>
  );
}
