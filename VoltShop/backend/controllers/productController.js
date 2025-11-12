import Product from '../models/Product.js';
import Subcategory from '../models/Subcategory.js';

// ====================================================================
// دالة جلب المنتجات - لا تحتاج لتعديل، فهي سليمة
// ====================================================================
export const getProducts = async (req, res) => {
  try {
    const { category, subcategory, type, search, page = 1, limit = 12, sort = 'recent' } = req.query;
    const query = {};
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (type) query.type = type;
    if (search) query.name = { $regex: search, $options: 'i' };
    
    let sortOption = {};
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else sortOption = { createdAt: -1 };
    
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;
    
    const products = await Product.find(query).sort(sortOption).skip(skip).limit(limitNum);
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================================================================
// دالة جلب منتج واحد - لا تحتاج لتعديل
// ====================================================================
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================================================================
// *** دالة إضافة منتج جديد - تم تعديلها لتدعم Cloudinary ***
// ====================================================================
export const createProduct = async (req, res) => {
  try {
    console.log('\n========== Create Product Request (Cloudinary) ==========');
    console.log('req.body:', req.body);
    console.log('req.file:', req.file); // هنا ستجد معلومات الملف من Cloudinary
    console.log('=========================================================\n');

    const { name, price, description, category, subcategory, type, rating, warranty, stock } = req.body;

    // التحقق من البيانات المطلوبة
    if (!name || !category || !subcategory) {
      return res.status(400).json({ message: "البيانات المطلوبة غير مكتملة: الاسم، الفئة، والماركة مطلوبة" });
    }

    // *** التعديل الأهم: استخدام رابط الصورة من Cloudinary ***
    // multer-storage-cloudinary يضع الرابط الكامل في req.file.path
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "رفع الصورة فشل أو الصورة مطلوبة" });
    }
    const imageUrl = req.file.path;

    const newProduct = new Product({ 
      name, 
      image: imageUrl, // <-- استخدام رابط Cloudinary
      price: Number(price) || 0, 
      description: description || '',
      category, 
      subcategory, 
      type: type || '',
      rating: Number(rating) || 0, 
      warranty: warranty || '', 
      stock: Number(stock) || 0 
    });

    const savedProduct = await newProduct.save();
    console.log('✅ Product saved successfully with Cloudinary image:', savedProduct._id);
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('\n❌ ERROR CREATING PRODUCT ❌\n', err);
    res.status(500).json({ message: err.message || "حدث خطأ أثناء إنشاء المنتج" });
  }
};

// ====================================================================
// *** دالة تعديل منتج - تم تعديلها لتدعم Cloudinary ***
// ====================================================================
export const updateProduct = async (req, res) => {
  try {
    console.log('\n========== Update Product Request (Cloudinary) ==========');
    console.log('req.body:', req.body);
    console.log('req.file:', req.file); // إذا تم رفع صورة جديدة، ستكون هنا
    console.log('Product ID:', req.params.id);
    console.log('=========================================================\n');
    
    let updateData = { ...req.body };
    
    // تحويل الأرقام إذا كانت موجودة
    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.rating !== undefined) updateData.rating = Number(updateData.rating);
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);
    
    // *** التعديل الأهم: إذا تم رفع صورة جديدة، استخدم رابط Cloudinary ***
    if (req.file && req.file.path) {
      updateData.image = req.file.path;
      console.log('New Cloudinary image URL:', updateData.image);
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    
    console.log('✅ Product updated successfully:', updatedProduct._id);
    res.json(updatedProduct);
  } catch (err) {
    console.error('❌ Error updating product:', err);
    res.status(500).json({ message: err.message || "حدث خطأ أثناء تحديث المنتج" });
  }
};

// ====================================================================
// باقي الدوال - لا تحتاج لتعديل
// ====================================================================
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSubcategories = async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) return res.status(400).json({ message: "Category is required" });
    const subcategoriesFromDB = await Subcategory.find({ category }).select('name').sort({ name: 1 });
    const subcategoryNames = subcategoriesFromDB.map(s => s.name);
    if (subcategoryNames.length === 0) {
      const subcategoriesFromProducts = await Product.distinct('subcategory', { category });
      return res.json(subcategoriesFromProducts.filter(Boolean));
    }
    res.json(subcategoryNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTypes = async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    if (!category || !subcategory) return res.status(400).json({ message: "Category and subcategory are required" });
    const types = await Product.distinct('type', { category, subcategory });
    res.json(types.filter(Boolean));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
