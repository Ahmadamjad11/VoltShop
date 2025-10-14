import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import "../styles/admin.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    completedOrders: 0,
    categories: 0,
    services: 0,
    contacts: 0,
    totalSales: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/stats").catch(() => ({ data: {} }));
      const data = res.data || {};
      setStats({
        products: data.products || 0,
        orders: data.orders || 0,
        completedOrders: data.completedOrders  || 0,
        categories: data.categories || 0,
        services: data.services || 0,
        contacts: data.contacts || 0,
        totalSales: data.totalSales || 0
      });
    } catch (err) {
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");
    window.location.href = "/";
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h3>
            <i className="fas fa-bolt"></i> Volt Admin
          </h3>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin" className="nav-link active">
            <i className="fas fa-tachometer-alt"></i> لوحة التحكم
          </Link>
          <Link to="/admin/products" className="nav-link">
            <i className="fas fa-box"></i> إدارة المنتجات
          </Link>
          <Link to="/admin/orders" className="nav-link">
            <i className="fas fa-shopping-cart"></i> إدارة الطلبات
          </Link>
          <Link to="/admin/categories" className="nav-link">
            <i className="fas fa-tags"></i> إدارة الفئات
          </Link>
          <Link to="/admin/services" className="nav-link">
            <i className="fas fa-tools"></i> إدارة الخدمات
          </Link>
          <Link to="/admin/contacts" className="nav-link">
            <i className="fas fa-envelope"></i> إدارة الرسائل
          </Link>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> تسجيل الخروج
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <div className="header-content">
            <h1>مرحباً بك في لوحة التحكم</h1>
            <p>إدارة متجر فولت شوب بسهولة ومرونة</p>
          </div>
          <div className="header-actions">
            <button onClick={loadStats} className="refresh-btn" disabled={loading}>
              <i className={`fas fa-sync-alt ${loading ? "fa-spin" : ""}`}></i> تحديث البيانات
            </button>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-box"></i></div>
            <div className="stat-content">
              <h3>{loading ? "..." : stats.products}</h3>
              <p>المنتجات</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-shopping-cart"></i></div>
            <div className="stat-content">
              <h3>{loading ? "..." : stats.orders}</h3>
              <p>الطلبات الكلية</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
            <div className="stat-content">
              <h3>{loading ? "..." : stats.completedOrders}</h3>
              <p>الطلبات المكتملة</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-tags"></i></div>
            <div className="stat-content">
              <h3>{loading ? "..." : stats.categories}</h3>
              <p>الفئات</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-tools"></i></div>
            <div className="stat-content">
              <h3>{loading ? "..." : stats.services}</h3>
              <p>طلبات الخدمات</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-envelope"></i></div>
            <div className="stat-content">
              <h3>{loading ? "..." : stats.contacts}</h3>
              <p>رسائل التواصل</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-dollar-sign"></i></div>
            <div className="stat-content">
              <h3>{loading ? "..." : `${stats.totalSales} د.أ`}</h3>
              <p>إجمالي المبيعات</p>
            </div>
          </div>
        </div>

        {/* بطاقات الإدارة */}
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon"><i className="fas fa-box"></i></div>
            <div className="card-content">
              <h3>إدارة المنتجات</h3>
              <p>إضافة وتعديل وحذف المنتجات</p>
              <Link to="/admin/products" className="card-link">
                <i className="fas fa-arrow-left"></i> إدارة المنتجات
              </Link>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon"><i className="fas fa-shopping-cart"></i></div>
            <div className="card-content">
              <h3>إدارة الطلبات</h3>
              <p>متابعة الطلبات وتحديث حالاتها</p>
              <Link to="/admin/orders" className="card-link">
                <i className="fas fa-arrow-left"></i> إدارة الطلبات
              </Link>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon"><i className="fas fa-tags"></i></div>
            <div className="card-content">
              <h3>إدارة الفئات</h3>
              <p>إدارة فئات المنتجات وتنظيمها</p>
              <Link to="/admin/categories" className="card-link">
                <i className="fas fa-arrow-left"></i> إدارة الفئات
              </Link>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon"><i className="fas fa-tools"></i></div>
            <div className="card-content">
              <h3>إدارة الخدمات</h3>
              <p>إدارة طلبات التركيبات والصيانة</p>
              <Link to="/admin/services" className="card-link">
                <i className="fas fa-arrow-left"></i> إدارة الخدمات
              </Link>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon"><i className="fas fa-envelope"></i></div>
            <div className="card-content">
              <h3>إدارة الرسائل</h3>
              <p>إدارة رسائل العملاء والاستفسارات</p>
              <Link to="/admin/contacts" className="card-link">
                <i className="fas fa-arrow-left"></i> إدارة الرسائل
              </Link>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon"><i className="fas fa-chart-line"></i></div>
            <div className="card-content">
              <h3>التقارير والإحصائيات</h3>
              <p>عرض إحصائيات المبيعات والأداء</p>
              <button className="card-link" disabled>
                <i className="fas fa-arrow-left"></i> قريباً
              </button>
            </div>
          </div>
        </div>

        {/* إجراءات سريعة */}
        <div className="quick-actions">
          <h3>إجراءات سريعة</h3>
          <div className="actions-grid">
            <Link to="/admin/products" className="action-btn">
              <i className="fas fa-plus"></i> إضافة منتج جديد
            </Link>
            <Link to="/admin/categories" className="action-btn">
              <i className="fas fa-plus"></i> إضافة فئة جديدة
            </Link>
            <Link to="/admin/orders" className="action-btn">
              <i className="fas fa-eye"></i> عرض الطلبات الجديدة
            </Link>
            <Link to="/admin/services" className="action-btn">
              <i className="fas fa-tools"></i> طلبات الخدمات الجديدة
            </Link>
            <Link to="/admin/contacts" className="action-btn">
              <i className="fas fa-envelope"></i> الرسائل الجديدة
            </Link>
            <Link to="/" className="action-btn">
              <i className="fas fa-external-link-alt"></i> زيارة المتجر
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
