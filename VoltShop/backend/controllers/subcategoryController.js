import Subcategory from '../models/Subcategory.js';

// جلب كل الماركات
export const getSubcategories = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const subcategories = await Subcategory.find(query).sort({ name: 1 });
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// جلب ماركة واحدة
export const getSubcategoryById = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });
    res.json(subcategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// إضافة ماركة جديدة
export const createSubcategory = async (req, res) => {
  try {
    const { name, category, description, image } = req.body;
    
    if (!name || !category) {
      return res.status(400).json({ message: "الاسم والفئة مطلوبان" });
    }

    const newSubcategory = new Subcategory({ 
      name, 
      category, 
      description: description || "",
      image: image || ""
    });
    
    const saved = await newSubcategory.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: "هذه الماركة موجودة بالفعل في هذه الفئة" });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
};

// تحديث ماركة
export const updateSubcategory = async (req, res) => {
  try {
    const { name, category, description, image } = req.body;
    const updated = await Subcategory.findByIdAndUpdate(
      req.params.id,
      { name, category, description, image },
      { new: true, runValidators: true }
    );
    
    if (!updated) return res.status(404).json({ message: "Subcategory not found" });
    res.json(updated);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: "هذه الماركة موجودة بالفعل في هذه الفئة" });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
};

// حذف ماركة
export const deleteSubcategory = async (req, res) => {
  try {
    const deleted = await Subcategory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Subcategory not found" });
    res.json({ message: "تم حذف الماركة بنجاح" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

