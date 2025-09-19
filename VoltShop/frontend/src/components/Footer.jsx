import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div>© {new Date().getFullYear()} VoltShop</div>
      <div>📞 079-1234567 | ✉️ info@voltshop.com</div>
    </footer>
  );
}
