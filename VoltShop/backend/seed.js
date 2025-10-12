import mongoose from 'mongoose';
import Product from './models/Product.js';
import Category from './models/Category.js';

// ربط قاعدة البيانات
const MONGO_URI = "mongodb://localhost:27017/voltshop";
mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// بيانات الفئات التجريبية
const categories = [
  { name: "لمبات LED", image: "https://via.placeholder.com/200x200/2563eb/ffffff?text=LED" },
  { name: "مفاتيح كهربائية", image: "https://via.placeholder.com/200x200/10b981/ffffff?text=Switches" },
  { name: "أفياش", image: "https://via.placeholder.com/200x200/f59e0b/ffffff?text=Sockets" },
  { name: "كابلات", image: "https://via.placeholder.com/200x200/ef4444/ffffff?text=Cables" },
  { name: "مفاتيح ذكية", image: "https://via.placeholder.com/200x200/8b5cf6/ffffff?text=Smart" },
  { name: "أدوات كهربائية", image: "https://via.placeholder.com/200x200/06b6d4/ffffff?text=Tools" }
];

// بيانات المنتجات التجريبية
const products = [
  {
    name: "لمبة LED 12 واط",
    image: "https://via.placeholder.com/300x300/2563eb/ffffff?text=LED+12W",
    price: 15,
    category: "لمبات LED",
    rating: 4.5,
    warranty: "سنتان",
    stock: 50
  },
  {
    name: "مفتاح كهربائي أحادي",
    image: "https://via.placeholder.com/300x300/10b981/ffffff?text=Switch+1",
    price: 8,
    category: "مفاتيح كهربائية",
    rating: 4.2,
    warranty: "سنة واحدة",
    stock: 100
  },
  {
    name: "أفيش ثلاثي",
    image: "https://via.placeholder.com/300x300/f59e0b/ffffff?text=Socket+3",
    price: 12,
    category: "أفياش",
    rating: 4.3,
    warranty: "سنتان",
    stock: 75
  },
  {
    name: "كابل كهربائي 2.5 مم",
    image: "https://via.placeholder.com/300x300/ef4444/ffffff?text=Cable+2.5",
    price: 25,
    category: "كابلات",
    rating: 4.7,
    warranty: "5 سنوات",
    stock: 200
  },
  {
    name: "مفتاح ذكي WiFi",
    image: "https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Smart+WiFi",
    price: 45,
    category: "مفاتيح ذكية",
    rating: 4.8,
    warranty: "سنتان",
    stock: 30
  },
  {
    name: "لمبة LED 20 واط",
    image: "https://via.placeholder.com/300x300/2563eb/ffffff?text=LED+20W",
    price: 25,
    category: "لمبات LED",
    rating: 4.6,
    warranty: "سنتان",
    stock: 40
  },
  {
    name: "مفتاح كهربائي مزدوج",
    image: "https://via.placeholder.com/300x300/10b981/ffffff?text=Switch+2",
    price: 15,
    category: "مفاتيح كهربائية",
    rating: 4.4,
    warranty: "سنة واحدة",
    stock: 80
  },
  {
    name: "أفيش مزدوج",
    image: "https://via.placeholder.com/300x300/f59e0b/ffffff?text=Socket+2",
    price: 18,
    category: "أفياش",
    rating: 4.5,
    warranty: "سنتان",
    stock: 60
  },
  {
    name: "كابل كهربائي 4 مم",
    image: "https://via.placeholder.com/300x300/ef4444/ffffff?text=Cable+4",
    price: 35,
    category: "كابلات",
    rating: 4.9,
    warranty: "5 سنوات",
    stock: 150
  },
  {
    name: "مفتاح ذكي Bluetooth",
    image: "https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Smart+BT",
    price: 55,
    category: "مفاتيح ذكية",
    rating: 4.7,
    warranty: "سنتان",
    stock: 25
  },
  {
    name: "لمبة LED 30 واط",
    image: "https://via.placeholder.com/300x300/2563eb/ffffff?text=LED+30W",
    price: 35,
    category: "لمبات LED",
    rating: 4.8,
    warranty: "سنتان",
    stock: 35
  },
  {
    name: "مفتاح كهربائي ثلاثي",
    image: "https://via.placeholder.com/300x300/10b981/ffffff?text=Switch+3",
    price: 22,
    category: "مفاتيح كهربائية",
    rating: 4.3,
    warranty: "سنة واحدة",
    stock: 70
  }
];

// دالة لإضافة البيانات
async function seedData() {
  try {
    // حذف البيانات الموجودة
    await Product.deleteMany({});
    await Category.deleteMany({});
    
    console.log("تم حذف البيانات الموجودة");
    
    // إضافة الفئات
    const savedCategories = await Category.insertMany(categories);
    console.log(`تم إضافة ${savedCategories.length} فئة`);
    
    // إضافة المنتجات
    const savedProducts = await Product.insertMany(products);
    console.log(`تم إضافة ${savedProducts.length} منتج`);
    
    console.log("تم إضافة البيانات التجريبية بنجاح!");
    
  } catch (error) {
    console.error("خطأ في إضافة البيانات:", error);
  } finally {
    mongoose.connection.close();
  }
}

// تشغيل الدالة
seedData();
