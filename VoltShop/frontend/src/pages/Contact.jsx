import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/contact.css";
import API from "../api/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const submit = async (e) => {
    e.preventDefault();
    try {
      // إذا في endpoint لإرسال الرسائل، يمكن استخدامه. الآن نعرض alert
      // await API.post("/contact", form);
      alert("تم إرسال رسالتك. سنرد قريبا");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("خطأ في الإرسال");
    }
  };
  return (
    <>
      <Navbar />
      <div className="contact-page">
        <h2>تواصل معنا</h2>
        <form onSubmit={submit}>
          <input placeholder="الاسم" value={form.name} onChange={(e)=> setForm({...form, name: e.target.value})} />
          <input placeholder="البريد الإلكتروني" value={form.email} onChange={(e)=> setForm({...form, email: e.target.value})} />
          <textarea placeholder="رسالتك" value={form.message} onChange={(e)=> setForm({...form, message: e.target.value})} />
          <button type="submit">إرسال</button>
        </form>
      </div>
      <Footer />
    </>
  );
}
