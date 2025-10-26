import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/navbar.css";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalCount: cartCount, subtotal, FREE_SHIPPING_THRESHOLD } = useCart();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // تحديث عدد العناصر في السلة
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync search box with URL ?q=
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setSearch(q);
  }, [location.search]);

  // Debounce search typing to update URL automatically
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(location.search);
      if (search) {
        params.set("q", search);
      } else {
        params.delete("q");
      }
      // Only navigate if changed
      if (params.toString() !== location.search.replace(/^\?/, '')) {
        navigate({ pathname: "/", search: params.toString() });
      }
    }, 300);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (search) {
      params.set("q", search);
    } else {
      params.delete("q");
    }
    navigate({ pathname: "/", search: params.toString() });
    setIsMenuOpen(false);
  };

  // إغلاق القائمة عند تغيير حجم النافذة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
        {subtotal < FREE_SHIPPING_THRESHOLD && (
          <div className="free-ship-hint" style={{ position: 'absolute', left: '1rem', top: '100%', marginTop: '.25rem', fontSize: '.8rem', color: '#6b7280', whiteSpace: 'nowrap' }}>
            تبقّى { (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2) } د.أ للشحن المجاني
          </div>
        )}
        
        <div className={`navbar-right ${isMenuOpen ? 'active' : ''}`}>
          <form className="navbar-search" onSubmit={onSearchSubmit} role="search">
            <input
              type="search"
              placeholder="ابحث عن منتج..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="بحث"
            />
            <button type="submit" className="btn-primary"><i className="fas fa-search"></i></button>
          </form>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <i className="fas fa-home"></i> الرئيسية
          </Link>
          <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
            <i className="fas fa-shopping-cart"></i> سلة
            <span className={`cart-count${cartCount === 0 ? ' muted' : ''}`}>{cartCount}</span>
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