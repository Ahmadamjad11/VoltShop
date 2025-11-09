import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' }, // وصف المنتج
  
  // هيكل الفئات الثلاثي
  category: { type: String, required: true },      // الفئة الرئيسية: "قواطع"، "إنارة"، "أسلاك"
  subcategory: { type: String, required: true },  // النوع/الماركة: "شنايدر"، "ABB"، "LG"
  type: { type: String, default: '' },             // نوع المنتج الدقيق: "1 فاز"، "3 فاز"، "4 فاز"

  rating: { type: Number, default: 0 }, // تقييم المنتج
  warranty: { type: String },           // الكفالة
  stock: { type: Number, default: 0 }, // كمية المخزون
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
