import Product from '../models/Product.js';
import Subcategory from '../models/Subcategory.js';

// جلب كل المنتجات مع فلترة حسب category / subcategory / type
export const getProducts = async (req, res) => {
  try {
    const { category, subcategory, type, search, page = 1, limit = 12, sort = 'recent' } = req.query;
    
    // بناء query للفلترة
    const query = {};
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (type) query.type = type;
    
    // فلترة حسب البحث في الاسم
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    // بناء sort
    let sortOption = {};
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else {
      sortOption = { createdAt: -1 }; // recent
    }
    
    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;
    
    // جلب المنتجات
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);
    
    // جلب العدد الإجمالي
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// جلب منتج واحد حسب الـID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// إضافة منتج جديد
export const createProduct = async (req, res) => {
  const { name, image, price, description, category, subcategory, type, rating, warranty, stock } = req.body;
  const newProduct = new Product({ 
    name, 
    image, 
    price, 
    description: description || '',
    category, 
    subcategory, 
    type: type || '',
    rating, 
    warranty, 
    stock 
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// تعديل منتج
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// حذف منتج
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// جلب Subcategories المتاحة لفئة معينة
export const getSubcategories = async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }
    
    // جلب الماركات من Subcategory Model أولاً
    const subcategoriesFromDB = await Subcategory.find({ category }).select('name').sort({ name: 1 });
    const subcategoryNames = subcategoriesFromDB.map(s => s.name);
    
    // إذا لم توجد ماركات في DB، جلبها من المنتجات (للتوافق مع البيانات القديمة)
    if (subcategoryNames.length === 0) {
      const subcategoriesFromProducts = await Product.distinct('subcategory', { category });
      return res.json(subcategoriesFromProducts.filter(Boolean));
    }
    
    res.json(subcategoryNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// جلب Types المتاحة لـ subcategory معينة
export const getTypes = async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    if (!category || !subcategory) {
      return res.status(400).json({ message: "Category and subcategory are required" });
    }
    
    const types = await Product.distinct('type', { category, subcategory });
    res.json(types.filter(Boolean)); // إزالة القيم الفارغة
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
