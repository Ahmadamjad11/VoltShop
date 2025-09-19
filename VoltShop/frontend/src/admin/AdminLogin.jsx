import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import API from "../api/api";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      // حاول عمل login على الباك أولاً
      const res = await API.post("/admin/login", form).catch(()=>null);
      if (res?.data?.token) {
        localStorage.setItem("adminToken", res.data.token);
        navigate("/admin");
        return;
      }
      // fallback: local simple credentials
      if (form.username === "admin" && form.password === "123456") {
        localStorage.setItem("isAdmin", "true");
        navigate("/admin");
        return;
      }
      alert("بيانات الدخول خاطئة");
    } catch (err) {
      console.error(err);
      alert("خطأ بالدخول");
    }
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-form" onSubmit={submit}>
        <h2>دخول الأدمن</h2>
        <input placeholder="اسم المستخدم" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} />
        <input type="password" placeholder="كلمة المرور" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        <button type="submit">دخول</button>
      </form>
    </div>
  );
}
