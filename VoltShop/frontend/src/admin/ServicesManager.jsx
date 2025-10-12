import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import "../styles/admin.css";

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadServices();
  }, [selectedStatus]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const params = selectedStatus !== "all" ? `?status=${selectedStatus}` : "";
      const res = await API.get(`/services${params}`);
      setServices(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      setError("خطأ في تحميل طلبات الخدمات");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const updateServiceStatus = async (serviceId, newStatus) => {
    try {
      setUpdating(true);
      await API.patch(`/services/${serviceId}/status`, { status: newStatus });
      
      // تحديث القائمة
      loadServices();
      
      // إغلاق المودال إذا كان مفتوحاً
      if (showModal) {
        setShowModal(false);
        setSelectedService(null);
      }
      
      // رسالة نجاح
      showSuccessMessage("تم تحديث حالة الطلب بنجاح!");
      
    } catch (err) {
      console.error(err);
      alert("خطأ في تحديث حالة الطلب");
    } finally {
      setUpdating(false);
    }
  };

  const showSuccessMessage = (message) => {
    const messageEl = document.createElement('div');
    messageEl.className = 'success-message';
    messageEl.textContent = message;
    messageEl.style.position = 'fixed';
    messageEl.style.top = '100px';
    messageEl.style.right = '20px';
    messageEl.style.zIndex = '9999';
    messageEl.style.background = '#f0fdf4';
    messageEl.style.border = '1px solid #bbf7d0';
    messageEl.style.color = '#16a34a';
    messageEl.style.padding = '1rem';
    messageEl.style.borderRadius = '0.5rem';
    messageEl.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
      if (document.body.contains(messageEl)) {
        document.body.removeChild(messageEl);
      }
    }, 3000);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', text: 'في الانتظار', icon: 'fas fa-clock' },
      confirmed: { class: 'status-processing', text: 'مؤكد', icon: 'fas fa-check' },
      in_progress: { class: 'status-shipped', text: 'قيد التنفيذ', icon: 'fas fa-tools' },
      completed: { class: 'status-completed', text: 'مكتمل', icon: 'fas fa-check-circle' },
      cancelled: { class: 'status-cancelled', text: 'ملغي', icon: 'fas fa-times-circle' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.class}`}>
        <i className={config.icon}></i>
        {config.text}
      </span>
    );
  };

  const getServiceTypeIcon = (serviceType) => {
    const icons = {
      'تركيب': 'fas fa-tools',
      'صيانة': 'fas fa-wrench',
      'إصلاح': 'fas fa-hammer',
      'استشارة': 'fas fa-comments',
      'أخرى': 'fas fa-cog'
    };
    return icons[serviceType] || 'fas fa-cog';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  };

  const openServiceDetails = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h3>
            <i className="fas fa-bolt"></i>
            Volt Admin
          </h3>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin" className="nav-link">
            <i className="fas fa-tachometer-alt"></i>
            لوحة التحكم
          </Link>
          <Link to="/admin/products" className="nav-link">
            <i className="fas fa-box"></i>
            إدارة المنتجات
          </Link>
          <Link to="/admin/orders" className="nav-link">
            <i className="fas fa-shopping-cart"></i>
            إدارة الطلبات
          </Link>
          <Link to="/admin/categories" className="nav-link">
            <i className="fas fa-tags"></i>
            إدارة الفئات
          </Link>
          <Link to="/admin/services" className="nav-link active">
            <i className="fas fa-tools"></i>
            إدارة الخدمات
          </Link>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => {
            localStorage.removeItem('adminToken');
            window.location.href = '/admin/login';
          }}>
            <i className="fas fa-sign-out-alt"></i>
            تسجيل الخروج
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <div className="header-content">
            <h1>إدارة طلبات الخدمات</h1>
            <p>إدارة طلبات التركيبات والصيانة</p>
          </div>
          <div className="header-actions">
            <button onClick={loadServices} className="refresh-btn" disabled={loading}>
              <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
              تحديث القائمة
            </button>
          </div>
        </div>

        {/* تبويبات التصفية */}
        <div className="orders-tabs">
          <button 
            className={selectedStatus === "all" ? "tab-active" : ""}
            onClick={() => setSelectedStatus("all")}
          >
            جميع الطلبات ({services.length})
          </button>
          <button 
            className={selectedStatus === "pending" ? "tab-active" : ""}
            onClick={() => setSelectedStatus("pending")}
          >
            في الانتظار
          </button>
          <button 
            className={selectedStatus === "confirmed" ? "tab-active" : ""}
            onClick={() => setSelectedStatus("confirmed")}
          >
            مؤكدة
          </button>
          <button 
            className={selectedStatus === "in_progress" ? "tab-active" : ""}
            onClick={() => setSelectedStatus("in_progress")}
          >
            قيد التنفيذ
          </button>
          <button 
            className={selectedStatus === "completed" ? "tab-active" : ""}
            onClick={() => setSelectedStatus("completed")}
          >
            مكتملة
          </button>
        </div>

        {/* جدول طلبات الخدمات */}
        <div className="table-section">
          <h2>طلبات الخدمات ({services.length})</h2>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>جاري تحميل طلبات الخدمات...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          ) : services.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-tools"></i>
              <p>لا توجد طلبات خدمات لعرضها</p>
              <p>ستظهر هنا طلبات التركيبات والصيانة الجديدة</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>العميل</th>
                    <th>نوع الخدمة</th>
                    <th>المشكلة</th>
                    <th>التاريخ</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <tr key={service._id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="customer-info">
                          <strong>{service.name}</strong>
                          <small>{service.phone}</small>
                          <small>{service.address}</small>
                        </div>
                      </td>
                      <td>
                        <div className="service-type">
                          <i className={getServiceTypeIcon(service.serviceType)}></i>
                          <span>{service.serviceType}</span>
                        </div>
                      </td>
                      <td>
                        <div className="issue-description">
                          <strong>{service.issueType || 'غير محدد'}</strong>
                          <small>{service.description?.substring(0, 50)}...</small>
                        </div>
                      </td>
                      <td>
                        <div className="date-info">
                          <strong>{formatDate(service.preferredDate)}</strong>
                          <small>{service.preferredTime || 'أي وقت'}</small>
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(service.status)}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => openServiceDetails(service)}
                            className="btn-details"
                            title="عرض التفاصيل"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          
                          {service.status === 'pending' && (
                            <button 
                              onClick={() => updateServiceStatus(service._id, 'confirmed')}
                              className="btn-processing"
                              disabled={updating}
                              title="تأكيد الطلب"
                            >
                              <i className="fas fa-check"></i>
                            </button>
                          )}
                          
                          {service.status === 'confirmed' && (
                            <button 
                              onClick={() => updateServiceStatus(service._id, 'in_progress')}
                              className="btn-shipped"
                              disabled={updating}
                              title="بدء التنفيذ"
                            >
                              <i className="fas fa-play"></i>
                            </button>
                          )}
                          
                          {service.status === 'in_progress' && (
                            <button 
                              onClick={() => updateServiceStatus(service._id, 'completed')}
                              className="btn-completed"
                              disabled={updating}
                              title="إكمال الطلب"
                            >
                              <i className="fas fa-check-circle"></i>
                            </button>
                          )}
                          
                          {(service.status === 'pending' || service.status === 'confirmed') && (
                            <button 
                              onClick={() => updateServiceStatus(service._id, 'cancelled')}
                              className="btn-cancel"
                              disabled={updating}
                              title="إلغاء الطلب"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* مودال تفاصيل الطلب */}
        {showModal && selectedService && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>تفاصيل طلب الخدمة</h3>
                <button className="close-modal" onClick={closeModal}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="modal-body">
                <div className="order-details-section">
                  <h4>معلومات العميل</h4>
                  <div className="customer-info">
                    <p><strong>الاسم:</strong> {selectedService.name}</p>
                    <p><strong>الهاتف:</strong> {selectedService.phone}</p>
                    <p><strong>البريد الإلكتروني:</strong> {selectedService.email || 'غير محدد'}</p>
                    <p><strong>العنوان:</strong> {selectedService.address}</p>
                  </div>
                </div>

                <div className="order-details-section">
                  <h4>تفاصيل الخدمة</h4>
                  <div className="order-info">
                    <p><strong>نوع الخدمة:</strong> {selectedService.serviceType}</p>
                    <p><strong>نوع المشكلة:</strong> {selectedService.issueType || 'غير محدد'}</p>
                    <p><strong>الوصف:</strong> {selectedService.description}</p>
                    <p><strong>التاريخ المفضل:</strong> {formatDate(selectedService.preferredDate)}</p>
                    <p><strong>الوقت المفضل:</strong> {selectedService.preferredTime || 'أي وقت'}</p>
                    <p><strong>الحالة الحالية:</strong> {getStatusBadge(selectedService.status)}</p>
                  </div>
                </div>

                {selectedService.notes && (
                  <div className="order-details-section">
                    <h4>ملاحظات</h4>
                    <p>{selectedService.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="modal-footer">
                <button className="btn-close" onClick={closeModal}>
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
