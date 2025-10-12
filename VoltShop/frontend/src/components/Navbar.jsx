import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // تحديث عدد العناصر في السلة
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    
    // الاستماع لتغييرات السلة
    window.addEventListener('storage', updateCartCount);
    
    // تحديث كل ثانية للتأكد
    const interval = setInterval(updateCartCount, 1000);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, []);

  // إغلاق القائمة عند تغيير حجم النافذة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    // تتبع التمرير لتغيير مظهر الشريط
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="logo">
            <i className="fas fa-bolt"></i> VoltShop
          </Link>
        </div>
        
        <div className={`navbar-right ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <i className="fas fa-home"></i> الرئيسية
          </Link>
          <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
            <i className="fas fa-shopping-cart"></i> سلة
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
          <Link to="/services" onClick={() => setIsMenuOpen(false)}>
            <i className="fas fa-tools"></i> التركيبات والصيانة
          </Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
            <i className="fas fa-envelope"></i> تواصل معنا
          </Link>
        </div>
        
        <div 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}