// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middlewares
app.use(cors());           // للسماح بالطلبات من أي دومين

// ملاحظة: express.json() و express.urlencoded() يجب أن يكونا قبل routes
// لكن multer يتعامل مع multipart/form-data بشكل مختلف
// لذلك نستخدم express.json() و express.urlencoded() فقط للطلبات غير multipart
// لكن يجب أن نستخدم middleware شرطي للتحقق من Content-Type
app.use((req, res, next) => {
  // إذا كان Content-Type هو multipart/form-data، تخطي express.json و express.urlencoded
  // لأن multer سيتعامل معه
  const contentType = req.get('content-type') || '';
  if (contentType.includes('multipart/form-data')) {
    return next();
  }
  // للطلبات الأخرى، استخدم express.json و express.urlencoded
  express.json()(req, res, () => {
    express.urlencoded({ extended: true, limit: '10mb' })(req, res, next);
  });
});

// تقديم الملفات الثابتة من مجلد uploads
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// ربط قاعدة البيانات MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/voltshop";
mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// Routes
app.use('/api/products', productRoutes);  // إدارة المنتجات
app.use('/api/orders', orderRoutes);      // إدارة الطلبات
app.use('/api/admin', adminRoutes);       // إدارة لوحة الأدمن
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);  // إدارة الماركات
app.use('/api/services', serviceRoutes);  // إدارة طلبات الخدمات
app.use('/api/contacts', contactRoutes);  // إدارة رسائل التواصل
// Route اختبارية للتأكد أن السيرفر يعمل
app.get('/', (req, res) => {
  res.send("VoltShop API is running");
});

// Error handling middleware (اختياري لكن مفيد)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});
app.get("/test", (req, res) => res.send("Server is working"));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
