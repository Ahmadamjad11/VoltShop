import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import API from "../api/api";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // محاولة تسجيل الدخول عبر API
      const res = await API.post("/admin/login", form);
      if (res?.data?.token) {
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem("isAdmin", "true");
        navigate("/admin");
        return;
      }
    } catch (err) {
      console.error("API login failed:", err);
    }

    // fallback: بيانات محلية بسيطة
    if (form.username === "admin" && form.password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
      return;
    }
    
    setError("بيانات الدخول خاطئة");
    setLoading(false);
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-header">
          <i className="fas fa-bolt"></i>
          <h1>VoltShop</h1>
          <p>لوحة إدارة المتجر</p>
        </div>
        
        <form className="admin-login-form" onSubmit={submit}>
          <h2>تسجيل الدخول</h2>
          
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label>
              <i className="fas fa-user"></i>
              اسم المستخدم
            </label>
            <input 
              type="text"
              placeholder="أدخل اسم المستخدم" 
              value={form.username} 
              onChange={e => setForm({...form, username: e.target.value})}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>
              <i className="fas fa-lock"></i>
              كلمة المرور
            </label>
            <input 
              type="password" 
              placeholder="أدخل كلمة المرور" 
              value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})}
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                جاري تسجيل الدخول...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                تسجيل الدخول
              </>
            )}
          </button>
          
          <div className="login-info">
            <p><strong>بيانات الدخول التجريبية:</strong></p>
            <p>اسم المستخدم: <code>admin</code></p>
            <p>كلمة المرور: <code>admin123</code></p>
          </div>
        </form>
      </div>
    </div>
  );
}
