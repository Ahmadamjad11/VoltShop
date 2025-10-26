import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

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