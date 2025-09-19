import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerInfo: {
    name: { type: String, required: [true, 'اسم العميل مطلوب'] },
    phone: { type: String, required: [true, 'هاتف العميل مطلوب'] },
    address: { type: String, required: [true, 'عنوان العميل مطلوب'] }
  },
  products: [
    {
      productId: { 
        type: mongoose.Schema.Types.Mixed,
        required: [true, 'معرف المنتج مطلوب']
      },
      quantity: { 
        type: Number, 
        required: [true, 'الكمية مطلوبة'],
        min: [1, 'الكمية يجب أن تكون على الأقل 1']
      },
      price: { 
        type: Number, 
        required: [true, 'السعر مطلوب'],
        min: [0, 'السعر لا يمكن أن يكون سالباً']
      },
      name: { 
        type: String, 
        required: [true, 'اسم المنتج مطلوب']
      },
      image: { type: String }
    }
  ],
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'bank', 'cod'],
    default: "cash" 
  },
  total: { 
    type: Number, 
    required: [true, 'المجموع الكلي مطلوب'],
    min: [0, 'المجموع الكلي لا يمكن أن يكون سالباً']
  },
  delivery: { 
    type: Number, 
    default: 0,
    min: [0, 'رسوم التوصيل لا يمكن أن تكون سالبة']
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'], // أضف completed هنا
    default: "pending" 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);