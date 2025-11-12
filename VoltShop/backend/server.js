// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// استيراد Routes
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import categoryRoutes from "./routes/categories.js";
import subcategoryRoutes from "./routes/subcategories.js";
import serviceRoutes from './routes/services.js';
import contactRoutes from './routes/contacts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middlewares
app.use(cors()); // للسماح بالطلبات من أي دومين

// *** هذا هو الجزء الذي تم تعديله بذكاء ***
// Middleware شرطي لتحليل الجسم (body) بناءً على نوع المحتوى
app.use((req, res, next) => {
  const contentType = req.get('content-type');

  // إذا كان الطلب يحتوي على ملفات، فإن multer سيتولى الأمر، لذا ننتقل مباشرة
  if (contentType && contentType.includes('multipart/form-data')) {
    return next();
  }

  // للطلبات الأخرى (JSON, URL-encoded, أو حتى بدون body مثل GET)
  // نقوم بتشغيل express.json() و express.urlencoded()
  express.json({ limit: '10mb' })(req, res, (err) => {
    if (err) return next(err); // في حال حدوث خطأ في تحليل JSON
    express.urlencoded({ extended: true, limit: '10mb' })(req, res, next);
  });
});

// تقديم الملفات الثابتة من مجلد uploads (للحفاظ على الصور القديمة)
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// ربط قاعدة البيانات MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/voltshop";
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB connection error:", err));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contacts', contactRoutes);

// Route اختبارية للتأكد أن السيرفر يعمل
app.get('/', (req, res) => {
  res.send("VoltShop API is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

app.get("/test", (req, res) => res.send("Server is working"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
