import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="/" className="brand">
              <i className="fas fa-bolt"></i>
              <span>VoltShop</span>
            </a>
            <p className="brand-text">
              متجرك الأول للأجهزة الكهربائية والإلكترونية عالية الجودة مع توصيل سريع وضمان موثوق.
            </p>
            <div className="socials">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-x-twitter"></i></a>
              <a href="#" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>

          <div className="footer-links">
            <h4>روابط سريعة</h4>
            <ul>
              <li><a href="/">الرئيسية</a></li>
              <li><a href="/services">التركيبات والصيانة</a></li>
              <li><a href="/contact">تواصل معنا</a></li>
              <li><a href="/cart">سلة المشتريات</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>تواصل</h4>
            <ul>
              <li><i className="fas fa-phone"></i><span>079-1234567</span></li>
              <li><i className="fas fa-envelope"></i><span>info@voltshop.com</span></li>
              <li><i className="fas fa-location-dot"></i><span>عمّان، الأردن</span></li>
              <li><i className="fas fa-clock"></i><span>من 9 صباحاً إلى 9 مساءً</span></li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h4>اشترك بالنشرة</h4>
            <p>آخر العروض والتخفيضات مباشرة إلى بريدك</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="بريدك الإلكتروني" aria-label="البريد الإلكتروني" required />
              <button type="submit" className="btn-primary">اشترك</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">© {new Date().getFullYear()} VoltShop. جميع الحقوق محفوظة.</div>
          <div className="policies">
            <a href="#">سياسة الخصوصية</a>
            <span className="dot" aria-hidden>•</span>
            <a href="#">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
