import { Link } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">⚡ VoltShop</Link>
      </div>
      <div className="navbar-right">
        <Link to="/">الرئيسية</Link>
        <Link to="/cart">سلة</Link>
        <Link to="/services">التركيبات والصيانة</Link>
        <Link to="/contact">تواصل معنا</Link>
      </div>
    </nav>
  );
}
