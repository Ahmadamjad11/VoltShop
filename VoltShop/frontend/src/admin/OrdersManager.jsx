import React, { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/admin.css";

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

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
      load();
    } catch (err) {
      console.error("❌ Error updating status:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطأ غير معروف";
      alert("خطأ بتحديث الحالة: " + errorMessage);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
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
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
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
          <div className="header-actions">
            <button onClick={load} className="btn-refresh">
              <span className="icon">🔄</span> تحديث القائمة
            </button>
            <div className="orders-summary">
              <span>إجمالي الطلبات: {orders.length}</span>
            </div>
          </div>
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
            className={activeTab === "shipped" ? "tab-active" : ""}
            onClick={() => setActiveTab("shipped")}
          >
            تم الشحن ({getOrdersCount("shipped")})
          </button>
          <button 
            className={activeTab === "delivered" ? "tab-active" : ""}
            onClick={() => setActiveTab("delivered")}
          >
            تم التسليم ({getOrdersCount("delivered")})
          </button>
          <button 
            className={activeTab === "completed" ? "tab-active" : ""}
            onClick={() => setActiveTab("completed")}
          >
            المكتملة ({getOrdersCount("completed")})
          </button>
          <button 
            className={activeTab === "cancelled" ? "tab-active" : ""}
            onClick={() => setActiveTab("cancelled")}
          >
            الملغية ({getOrdersCount("cancelled")})
          </button>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <p>لا توجد طلبات {activeTab !== "all" ? `في حالة ${getStatusText(activeTab)}` : ""}</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>العميل</th>
                  <th>الهاتف</th>
                  <th>العنوان</th>
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
                    <td className="address-cell">
                      {order.customerInfo?.address || 
                       order.customer?.address || 
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
                        <button 
                          className="btn-details"
                          onClick={() => viewOrderDetails(order)}
                          title="عرض تفاصيل الطلب"
                        >
                          التفاصيل
                        </button>
                        
                        {order.status !== "processing" && order.status !== "completed" && order.status !== "cancelled" && (
                          <button 
                            className="btn-status btn-processing"
                            onClick={() => changeStatus(order._id, "processing")}
                            title="وضع قيد التحضير"
                          >
                            تحضير
                          </button>
                        )}
                        
                        {order.status === "processing" && (
                          <button 
                            className="btn-status btn-shipped"
                            onClick={() => changeStatus(order._id, "shipped")}
                            title="تم شحن الطلب"
                          >
                            شحن
                          </button>
                        )}
                        
                        {order.status === "shipped" && (
                          <button 
                            className="btn-status btn-delivered"
                            onClick={() => changeStatus(order._id, "delivered")}
                            title="تم تسليم الطلب"
                          >
                            تسليم
                          </button>
                        )}
                        
                        {order.status === "delivered" && (
                          <button 
                            className="btn-status btn-completed"
                            onClick={() => changeStatus(order._id, "completed")}
                            title="تم إكمال الطلب"
                          >
                            إكمال
                          </button>
                        )}
                        
                        {order.status !== "completed" && order.status !== "cancelled" && (
                          <button 
                            className="btn-status btn-cancel"
                            onClick={() => changeStatus(order._id, "cancelled")}
                            title="إلغاء الطلب"
                          >
                            إلغاء
                          </button>
                        )}
                        
                        {order.status === "completed" && (
                          <span className="completed-label">تم الإكمال</span>
                        )}
                        
                        {order.status === "cancelled" && (
                          <span className="cancelled-label">ملغي</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* نافذة عرض تفاصيل الطلب */}
        {showOrderDetails && selectedOrder && (
          <div className="modal-overlay">
            <div className="modal-content order-details-modal">
              <div className="modal-header">
                <h3>تفاصيل الطلب #{selectedOrder._id.slice(-6)}</h3>
                <button className="close-modal" onClick={closeOrderDetails}>×</button>
              </div>
              <div className="modal-body">
                <div className="order-details-section">
                  <h4>معلومات العميل</h4>
                  <div className="customer-info">
                    <p><strong>الاسم:</strong> {selectedOrder.customerInfo?.name}</p>
                    <p><strong>الهاتف:</strong> {selectedOrder.customerInfo?.phone}</p>
                    <p><strong>العنوان:</strong> {selectedOrder.customerInfo?.address}</p>
                    <p><strong>طريقة الدفع:</strong> {selectedOrder.paymentMethod === 'cash' ? 'نقدي' : 
                                                     selectedOrder.paymentMethod === 'bank' ? 'تحويل بنكي' : 
                                                     selectedOrder.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 
                                                     selectedOrder.paymentMethod}</p>
                  </div>
                </div>
                
                <div className="order-details-section">
                  <h4>المنتجات</h4>
                  <div className="products-list">
                    {selectedOrder.products.map((product, idx) => (
                      <div key={idx} className="product-item">
                        <div className="product-image">
                          {product.image ? (
                            <img src={product.image} alt={product.name} />
                          ) : (
                            <div className="no-image">لا توجد صورة</div>
                          )}
                        </div>
                        <div className="product-details">
                          <h5>{product.name}</h5>
                          <p>الكمية: {product.quantity}</p>
                          <p>السعر: {product.price} د.أ</p>
                          <p>المجموع: {product.quantity * product.price} د.أ</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="order-details-section">
                  <h4>المجموع الكلي</h4>
                  <div className="order-totals">
                    <p><strong>مجموع المنتجات:</strong> {selectedOrder.total - selectedOrder.delivery} د.أ</p>
                    <p><strong>رسوم التوصيل:</strong> {selectedOrder.delivery} د.أ</p>
                    <p className="total-amount"><strong>المجموع الكلي:</strong> {selectedOrder.total} د.أ</p>
                  </div>
                </div>
                
                <div className="order-details-section">
                  <h4>معلومات الطلب</h4>
                  <div className="order-info">
                    <p><strong>حالة الطلب:</strong> 
                      <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </p>
                    <p><strong>تاريخ الطلب:</strong> {formatDate(selectedOrder.createdAt)}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-close" onClick={closeOrderDetails}>إغلاق</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}