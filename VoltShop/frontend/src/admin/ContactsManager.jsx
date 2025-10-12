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
  const [replyText, setReplyText] = useState(""); // 💡 جديد: حالة نص الرد
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

  // 💡 دالة موحدة لتحديث الحالة (تشمل الرد)
  const updateContactStatus = async (contactId, newStatus, reply = "") => {
    try {
      setUpdating(true);
      const updateData = { status: newStatus };

      // إذا كانت الحالة "replied" أو "closed" ونحن نرسل رداً جديداً
      if (newStatus === 'replied' && reply) {
          updateData.reply = reply;
          updateData.repliedAt = new Date().toISOString(); // تسجيل وقت الرد
      }

      await API.patch(`/contacts/${contactId}/status`, updateData);
      
      // تحديث القائمة
      await loadContacts();
      
      // إغلاق المودال إذا كان مفتوحاً
      if (showModal) {
        setShowModal(false);
        setSelectedContact(null);
        setReplyText(""); // مسح نص الرد
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
    messageEl.style.cssText = `
        position: fixed; top: 100px; right: 20px; z-index: 9999;
        background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a;
        padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      `;
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
  
  // 💡 دالة لمعالجة فتح المودال
  const openContactDetails = async (contact) => {
    setSelectedContact(contact);
    setReplyText(contact.reply || ""); // تعيين نص الرد الحالي
    setShowModal(true);

    // تحديث الحالة إلى 'read' إذا كانت 'new'
    if (contact.status === 'new' && !updating) {
        // نستخدم دالة تحديث الحالة، لكن بدون رسالة نجاح منبثقة هنا
        // Update local state temporarily for immediate UI feedback
        const updatedContacts = contacts.map(c => 
            c._id === contact._id ? { ...c, status: 'read' } : c
        );
        setContacts(updatedContacts);
        
        await API.patch(`/contacts/${contact._id}/status`, { status: 'read' });
        
        // Load the full list again to ensure correct contact count in tabs
        loadContacts();
    }
  };
  
  const closeModal = () => {
    setShowModal(false);
    setSelectedContact(null);
    setReplyText("");
  };

  // 💡 دالة لإرسال الرد
  const handleReplySubmit = () => {
      if (selectedContact && replyText.trim()) {
          // تحديث الحالة إلى 'replied' مع نص الرد
          updateContactStatus(selectedContact._id, 'replied', replyText.trim());
      } else {
          alert("الرجاء كتابة نص الرد قبل الإرسال.");
      }
  };


  return (
    <div className="admin-layout">
      {/* ... (الجزء الخاص بالقائمة الجانبية كما هو) ... */}
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
        {/* ... (الجزء الخاص برأس الصفحة والتصفيات كما هو) ... */}
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
            جميع الرسائل ({contacts.filter(c => selectedStatus === 'all' || c.status === selectedStatus).length}) {/* تعديل بسيط لحساب العدد بشكل صحيح */}
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
          <h2>رسائل التواصل ({contacts.filter(c => selectedStatus === 'all' || c.status === selectedStatus).length})</h2>
          
          {/* ... (حالة التحميل والخطأ والحالة الفارغة) ... */}
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
                          <small>{contact.message?.substring(0, 50)}...</small>
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
                            title="عرض التفاصيل والرد"
                            disabled={updating}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          
                          {/* تم إزالة أزرار الإجراءات من الجدول. يفضل تنفيذها من داخل المودال لتحسين تجربة المستخدم */}
                          {/* يمكن الإبقاء عليها إذا كنت تفضل التحديث السريع */}
                          
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* مودال تفاصيل الرسالة والرد */}
        {showModal && selectedContact && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>تفاصيل الرسالة - {selectedContact.name}</h3>
                <button className="close-modal" onClick={closeModal}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="modal-body">
                
                {/* معلومات المرسل الأساسية */}
                <div className="detail-card">
                  <h4>معلومات المرسل</h4>
                  <div className="detail-grid">
                    <p><strong>الاسم:</strong> {selectedContact.name}</p>
                    <p><strong>البريد:</strong> {selectedContact.email}</p>
                    <p><strong>الهاتف:</strong> {selectedContact.phone || 'غير محدد'}</p>
                    <p><strong>الأولوية:</strong> {getPriorityBadge(selectedContact.priority)}</p>
                    <p><strong>الحالة:</strong> {getStatusBadge(selectedContact.status)}</p>
                    <p><strong>تاريخ الإرسال:</strong> {formatDate(selectedContact.createdAt)}</p>
                  </div>
                </div>

                {/* محتوى الرسالة */}
                <div className="detail-card">
                  <h4>
                    <i className="fas fa-quote-left"></i>
                    الموضوع: {selectedContact.subject}
                  </h4>
                  <div className="message-content">
                    <p>{selectedContact.message}</p>
                  </div>
                </div>

                {/* جزء الردود السابقة */}
                {(selectedContact.reply || selectedContact.status === 'replied') && (
                  <div className="detail-card reply-section">
                    <h4>
                      <i className="fas fa-history"></i>
                      آخر رد تم إرساله
                    </h4>
                    <div className="reply-content">
                      <p>{selectedContact.reply || 'لم يتم تسجيل نص الرد'}</p>
                      {selectedContact.repliedAt && (
                        <small>تم الرد في: {formatDate(selectedContact.repliedAt)}</small>
                      )}
                    </div>
                  </div>
                )}
                
                {/* 💡 جديد: حقل الرد */}
                <div className="detail-card reply-input-section">
                  <h4>
                    <i className="fas fa-reply"></i>
                    إرسال رد جديد
                  </h4>
                  <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows="4"
                      placeholder="اكتب ردك على العميل هنا..."
                      disabled={updating}
                  ></textarea>
                </div>
                
                {/* 💡 أزرار الإجراءات داخل المودال */}
                <div className="modal-actions">
                    <button 
                        onClick={handleReplySubmit}
                        className="btn-primary"
                        disabled={updating || !replyText.trim()}
                    >
                        {updating ? (
                            <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                            <i className="fas fa-paper-plane"></i>
                        )}
                        {selectedContact.status === 'replied' ? 'تعديل الرد وتأكيد' : 'إرسال الرد وتغيير الحالة'}
                    </button>
                    
                    {/* زر إغلاق الرسالة */}
                    <button 
                        onClick={() => updateContactStatus(selectedContact._id, 'closed')}
                        className="btn-secondary"
                        disabled={updating}
                    >
                        <i className="fas fa-check-circle"></i>
                        إغلاق الرسالة
                    </button>
                </div>

              </div>
              
              <div className="modal-footer">
                <button className="btn-outline" onClick={closeModal}>
                  إغلاق نافذة التفاصيل
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}