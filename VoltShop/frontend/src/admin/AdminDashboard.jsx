import React from "react";
import { Link } from "react-router-dom";
import "../styles/admin.css";

export default function AdminDashboard() {
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");
    window.location.href = "/";
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3>
          <i className="fas fa-bolt"></i>
          Volt Admin
        </h3>
        <nav>
          <Link to="/admin/products">
            <i className="fas fa-box"></i>
            إدارة المنتجات
          </Link>
          <Link to="/admin/orders">
            <i className="fas fa-shopping-cart"></i>
            إدارة الطلبات
          </Link>
          <Link to="/admin/categories">
            <i className="fas fa-tags"></i>
            إدارة الفئات
          </Link>
        </nav>
        <button className="logout" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          تسجيل الخروج
        </button>
      </aside>
      
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h2>مرحباً بك في لوحة التحكم</h2>
            <p>إدارة متجر فولت شوب بسهولة ومرونة</p>
          </div>
        </div>
        
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">
              <i className="fas fa-box"></i>
            </div>
            <div className="card-content">
              <h3>المنتجات</h3>
              <p>إدارة المنتجات وإضافة منتجات جديدة</p>
              <Link to="/admin/products" className="card-link">
                <i className="fas fa-arrow-left"></i>
                إدارة المنتجات
              </Link>
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="card-icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <div className="card-content">
              <h3>الطلبات</h3>
              <p>متابعة الطلبات وتحديث حالاتها</p>
              <Link to="/admin/orders" className="card-link">
                <i className="fas fa-arrow-left"></i>
                إدارة الطلبات
              </Link>
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="card-icon">
              <i className="fas fa-tags"></i>
            </div>
            <div className="card-content">
              <h3>الفئات</h3>
              <p>إدارة فئات المنتجات وتنظيمها</p>
              <Link to="/admin/categories" className="card-link">
                <i className="fas fa-arrow-left"></i>
                إدارة الفئات
              </Link>
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="card-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="card-content">
              <h3>التقارير</h3>
              <p>عرض إحصائيات المبيعات والأداء</p>
              <button className="card-link" disabled>
                <i className="fas fa-arrow-left"></i>
                قريباً
              </button>
            </div>
          </div>
        </div>
        
        <div className="quick-actions">
          <h3>إجراءات سريعة</h3>
          <div className="actions-grid">
            <Link to="/admin/products" className="action-btn">
              <i className="fas fa-plus"></i>
              إضافة منتج جديد
            </Link>
            <Link to="/admin/categories" className="action-btn">
              <i className="fas fa-plus"></i>
              إضافة فئة جديدة
            </Link>
            <Link to="/admin/orders" className="action-btn">
              <i className="fas fa-eye"></i>
              عرض الطلبات الجديدة
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
