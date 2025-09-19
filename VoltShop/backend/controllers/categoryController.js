import Category from "../models/Category.js";

// جلب كل الأقسام
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// إضافة قسم
export const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name) {
      return res.status(400).json({ message: "الاسم مطلوب" });
    }
    const newCategory = new Category({ name, image });
    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// تحديث قسم
export const updateCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name, image },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// حذف قسم
export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "تم حذف القسم" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
