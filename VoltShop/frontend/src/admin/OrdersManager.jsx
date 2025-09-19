import React, { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/admin.css";

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, pending, processing, completed

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, activeTab]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await API.get("/orders");
      console.log("Orders data received:", res.data);
      setOrders(res.data);
      setError("");
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("فشل في تحميل الطلبات");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (activeTab === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === activeTab));
    }
  };

  const changeStatus = async (id, status) => {
    try {
      console.log("📦 Updating order:", id, "to status:", status);
      const response = await API.put(`/orders/${id}`, { status });
      console.log("✅ Update response:", response.data);
      alert("تم تحديث حالة الطلب بنجاح");
      load(); // إعادة تحميل كل الطلبات
    } catch (err) {
      console.error("❌ Error updating status:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطأ غير معروف";
      alert("خطأ بتحديث الحالة: " + errorMessage);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: "قيد الانتظار",
      processing: "قيد التحضير",
      shipped: "تم الشحن",
      delivered: "تم التسليم",
      completed: "مكتمل",
      cancelled: "ملغي"
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    return `status-${status || 'pending'}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "غير معروف";
    
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  const getOrdersCount = (status) => {
    if (status === "all") return orders.length;
    return orders.filter(order => order.status === status).length;
  };

  if (loading) return <div className="loading">جاري تحميل الطلبات...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3>Volt Admin</h3>
        <nav>
          <a href="/admin">الرئيسية</a>
          <a href="/admin/products">المنتجات</a>
          <a href="/admin/orders" className="active">الطلبات</a>
          <a href="/admin/categories">التصنيفات</a>
        </nav>
      </aside>
      
      <main className="admin-main">
        <div className="admin-header">
          <h2>إدارة الطلبات</h2>
          <button onClick={load} className="btn-refresh">
            تحديث القائمة
          </button>
        </div>

        {/* تبويبات التصفية */}
        <div className="orders-tabs">
          <button 
            className={activeTab === "all" ? "tab-active" : ""}
            onClick={() => setActiveTab("all")}
          >
            الكل ({getOrdersCount("all")})
          </button>
          <button 
            className={activeTab === "pending" ? "tab-active" : ""}
            onClick={() => setActiveTab("pending")}
          >
            قيد الانتظار ({getOrdersCount("pending")})
          </button>
          <button 
            className={activeTab === "processing" ? "tab-active" : ""}
            onClick={() => setActiveTab("processing")}
          >
            قيد التحضير ({getOrdersCount("processing")})
          </button>
          <button 
            className={activeTab === "completed" ? "tab-active" : ""}
            onClick={() => setActiveTab("completed")}
          >
            المكتملة ({getOrdersCount("completed")})
          </button>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <p>لا توجد طلبات {activeTab !== "all" ? `في ${getStatusText(activeTab)}` : ""}</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>العميل</th>
                  <th>الهاتف</th>
                  <th>المجموع</th>
                  <th>الحالة</th>
                  <th>التاريخ</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={order._id} className="order-row">
                    <td>{index + 1}</td>
                    <td>
                      {order.customerInfo?.name || 
                       order.customer?.name || 
                       "غير معروف"}
                    </td>
                    <td>
                      {order.customerInfo?.phone || 
                       order.customer?.phone || 
                       "غير معروف"}
                    </td>
                    <td>{order.total} د.أ</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td>
                      {formatDate(order.createdAt)}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {order.status !== "processing" && (
                          <button 
                            className="btn-status btn-processing"
                            onClick={() => changeStatus(order._id, "processing")}
                            title="وضع قيد التحضير"
                          >
                            تحضير
                          </button>
                        )}
                        {order.status !== "shipped" && order.status !== "completed" && (
                          <button 
                            className="btn-status btn-shipped"
                            onClick={() => changeStatus(order._id, "shipped")}
                            title="تم شحن الطلب"
                          >
                            شحن
                          </button>
                        )}
                        {order.status !== "completed" && (
                          <button 
                            className="btn-status btn-completed"
                            onClick={() => changeStatus(order._id, "completed")}
                            title="تم إكمال الطلب"
                          >
                            إكمال
                          </button>
                        )}
                        {order.status === "completed" && (
                          <span className="completed-label">تم الإكمال</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}