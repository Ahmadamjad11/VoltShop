import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },

  rating: { type: Number, default: 0 }, // تقييم المنتج
  warranty: { type: String },           // الكفالة
  stock: { type: Number, default: 0 }, // كمية المخزون
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
