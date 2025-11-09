import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // اسم الفئة الرئيسية
  description: { type: String, default: "" },
  image: { type: String, default: "" }
}, { timestamps: true });

// منع تكرار الماركة في نفس الفئة
subcategorySchema.index({ name: 1, category: 1 }, { unique: true });

export default mongoose.model("Subcategory", subcategorySchema);

