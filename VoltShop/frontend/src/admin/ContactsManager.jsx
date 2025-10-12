import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import "../styles/admin.css";

export default function ContactsManager() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadContacts();
  }, [selectedStatus]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const params = selectedStatus !== "all" ? `?status=${selectedStatus}` : "";
      const res = await API.get(`/contacts${params}`);
      setContacts(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      setError("خطأ في تحميل الرسائل");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (contactId, newStatus, reply = "") => {
    try {
      setUpdating(true);
      await API.patch(`/contacts/${contactId}/status`, { 
        status: newStatus,
        reply: reply
      });
      
      // تحديث القائمة
      loadContacts();
      
      // إغلاق المودال إذا كان مفتوحاً
      if (showModal) {
        setShowModal(false);
        setSelectedContact(null);
      }
      
      // رسالة نجاح
      showSuccessMessage("تم تحديث حالة الرسالة بنجاح!");
      
    } catch (err) {
      console.error(err);
      alert("خطأ في تحديث حالة الرسالة");
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
      new: { class: 'status-pending', text: 'جديدة', icon: 'fas fa-envelope' },
      read: { class: 'status-processing', text: 'مقروءة', icon: 'fas fa-eye' },
      replied: { class: 'status-shipped', text: 'تم الرد', icon: 'fas fa-reply' },
      closed: { class: 'status-completed', text: 'مغلقة', icon: 'fas fa-check-circle' }
    };
    
    const config = statusConfig[status] || statusConfig.new;
    return (
      <span className={`status-badge ${config.class}`}>
        <i className={config.icon}></i>
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { class: 'priority-low', text: 'منخفضة', icon: 'fas fa-arrow-down' },
      medium: { class: 'priority-medium', text: 'متوسطة', icon: 'fas fa-minus' },
      high: { class: 'priority-high', text: 'عالية', icon: 'fas fa-arrow-up' }
    };
    
    const config = priorityConfig[priority] || priorityConfig.medium;
    return (
      <span className={`priority-badge ${config.class}`}>
        <i className={config.icon}></i>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  };

  const openContactDetails = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedContact(null);
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
          <Link to="/admin/services" className="nav-link">
            <i className="fas fa-tools"></i>
            إدارة الخدمات
          </Link>
          <Link to="/admin/contacts" className="nav-link active">
            <i className="fas fa-envelope"></i>
            إدارة الرسائل
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
            <h1>إدارة رسائل التواصل</h1>
            <p>إدارة رسائل العملاء والاستفسارات</p>
          </div>
          <div className="header-actions">
            <button onClick={loadContacts} className="refresh-btn" disabled={loading}>
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
            جميع الرسائل ({contacts.length})
          </button>
          <button 
            className={selectedStatus === "new" ? "tab-active" : ""}
            onClick={() => setSelectedStatus("new")}
          >
            رسائل جديدة
          </button>
          <button 
            className={selectedStatus === "read" ? "tab-active" : ""}
            onClick={() => setSelectedStatus("read")}
          >
            مقروءة
          </button>
          <button 
            className={selectedStatus === "replied" ? "tab-active" : ""}
            onClick={() => setSelectedStatus("replied")}
          >
            تم الرد عليها
          </button>
          <button 
            className={selectedStatus === "closed" ? "tab-active" : ""}
            onClick={() => setSelectedStatus("closed")}
          >
            مغلقة
          </button>
        </div>

        {/* جدول الرسائل */}
        <div className="table-section">
          <h2>رسائل التواصل ({contacts.length})</h2>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>جاري تحميل الرسائل...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          ) : contacts.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-envelope-open"></i>
              <p>لا توجد رسائل لعرضها</p>
              <p>ستظهر هنا رسائل العملاء الجديدة</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>المرسل</th>
                    <th>الموضوع</th>
                    <th>الرسالة</th>
                    <th>التاريخ</th>
                    <th>الحالة</th>
                    <th>الأولوية</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact, index) => (
                    <tr key={contact._id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="customer-info">
                          <strong>{contact.name}</strong>
                          <small>{contact.email}</small>
                          <small>{contact.phone || 'لا يوجد رقم'}</small>
                        </div>
                      </td>
                      <td>
                        <div className="subject-info">
                          <strong>{contact.subject}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="message-preview">
                          <small>{contact.message?.substring(0, 100)}...</small>
                        </div>
                      </td>
                      <td>
                        <div className="date-info">
                          <strong>{formatDate(contact.createdAt)}</strong>
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(contact.status)}
                      </td>
                      <td>
                        {getPriorityBadge(contact.priority)}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => openContactDetails(contact)}
                            className="btn-details"
                            title="عرض التفاصيل"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          
                          {contact.status === 'new' && (
                            <button 
                              onClick={() => updateContactStatus(contact._id, 'read')}
                              className="btn-processing"
                              disabled={updating}
                              title="تأكيد القراءة"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                          )}
                          
                          {contact.status === 'read' && (
                            <button 
                              onClick={() => updateContactStatus(contact._id, 'replied')}
                              className="btn-shipped"
                              disabled={updating}
                              title="تم الرد"
                            >
                              <i className="fas fa-reply"></i>
                            </button>
                          )}
                          
                          {(contact.status === 'read' || contact.status === 'replied') && (
                            <button 
                              onClick={() => updateContactStatus(contact._id, 'closed')}
                              className="btn-completed"
                              disabled={updating}
                              title="إغلاق الرسالة"
                            >
                              <i className="fas fa-check-circle"></i>
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

        {/* مودال تفاصيل الرسالة */}
        {showModal && selectedContact && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>تفاصيل الرسالة</h3>
                <button className="close-modal" onClick={closeModal}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="modal-body">
                <div className="order-details-section">
                  <h4>معلومات المرسل</h4>
                  <div className="customer-info">
                    <p><strong>الاسم:</strong> {selectedContact.name}</p>
                    <p><strong>البريد الإلكتروني:</strong> {selectedContact.email}</p>
                    <p><strong>رقم الهاتف:</strong> {selectedContact.phone || 'غير محدد'}</p>
                    <p><strong>الموضوع:</strong> {selectedContact.subject}</p>
                    <p><strong>تاريخ الإرسال:</strong> {formatDate(selectedContact.createdAt)}</p>
                    <p><strong>الحالة:</strong> {getStatusBadge(selectedContact.status)}</p>
                    <p><strong>الأولوية:</strong> {getPriorityBadge(selectedContact.priority)}</p>
                  </div>
                </div>

                <div className="order-details-section">
                  <h4>محتوى الرسالة</h4>
                  <div className="message-content">
                    <p>{selectedContact.message}</p>
                  </div>
                </div>

                {selectedContact.reply && (
                  <div className="order-details-section">
                    <h4>الرد</h4>
                    <div className="reply-content">
                      <p>{selectedContact.reply}</p>
                      {selectedContact.repliedAt && (
                        <small>تم الرد في: {formatDate(selectedContact.repliedAt)}</small>
                      )}
                    </div>
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
