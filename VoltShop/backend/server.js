// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// استيراد Routes
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import categoryRoutes from "./routes/categories.js";
import subcategoryRoutes from "./routes/subcategories.js";
import serviceRoutes from './routes/services.js';
import contactRoutes from './routes/contacts.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());           // للسماح بالطلبات من أي دومين
app.use(express.json());   // لتحويل JSON تلقائيًا

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
