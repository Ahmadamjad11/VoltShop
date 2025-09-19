import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/services.css";

export default function Services() {
  return (
    <>
      <Navbar />
      <div className="services-page">
        <h2>التركيبات والصيانة</h2>
        <p>نقدم خدمات تركيب وصيانة لجميع المنتجات الكهربائية — تواصل معنا للحجز</p>
      </div>
      <Footer />
    </>
  );
}
