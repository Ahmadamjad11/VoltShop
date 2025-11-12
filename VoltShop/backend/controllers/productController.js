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
  try {
    console.log('\n========== Create Product Request ==========');
    console.log('Content-Type:', req.get('content-type'));
    console.log('req.body type:', typeof req.body);
    console.log('req.body:', req.body);
    console.log('req.body keys:', req.body ? Object.keys(req.body) : 'N/A');
    console.log('req.file:', req.file);
    console.log('req.method:', req.method);
    console.log('req.url:', req.url);
    console.log('==========================================\n');
    
    // التحقق من وجود req.body وتأكيد أنه object
    // إذا لم يكن موجوداً، نعيد خطأ واضح
    if (req.body === undefined || req.body === null) {
      console.error('❌ ERROR: req.body is undefined or null');
      console.error('req.body value:', req.body);
      console.error('req.body type:', typeof req.body);
      return res.status(400).json({ 
        message: "خطأ في البيانات المرسلة - req.body غير موجود. يرجى التحقق من أن البيانات تُرسل بشكل صحيح." 
      });
    }
    
    // التأكد من أن req.body هو object
    if (typeof req.body !== 'object') {
      console.error('❌ ERROR: req.body is not an object');
      console.error('req.body value:', req.body);
      console.error('req.body type:', typeof req.body);
      return res.status(400).json({ 
        message: "خطأ في البيانات المرسلة - req.body ليس object" 
      });
    }
    
    // الآن يمكننا destructure بأمان
    const body = req.body;
    const name = body.name;
    const image = body.image;
    const price = body.price;
    const description = body.description;
    const category = body.category;
    const subcategory = body.subcategory;
    const type = body.type;
    const rating = body.rating;
    const warranty = body.warranty;
    const stock = body.stock;
    
    console.log('Extracted values:');
    console.log('  name:', name);
    console.log('  category:', category);
    console.log('  subcategory:', subcategory);
    console.log('  image:', image);
    
    // التحقق من البيانات المطلوبة
    if (!name || !category || !subcategory) {
      return res.status(400).json({ 
        message: "البيانات المطلوبة غير مكتملة: الاسم، الفئة، والماركة مطلوبة",
        received: { name, category, subcategory }
      });
    }
    
    // إذا تم رفع ملف صورة، استخدم رابط الملف المرفوع
    let imageUrl = image || '';
    if (req.file) {
      // بناء رابط الصورة المرفوعة
      const baseUrl = req.protocol + '://' + req.get('host');
      imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }
    
    // التحقق من وجود صورة
    if (!imageUrl) {
      return res.status(400).json({ 
        message: "يجب إدخال رابط الصورة أو رفع صورة" 
      });
    }
    
    const newProduct = new Product({ 
      name, 
      image: imageUrl, 
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
    console.log('✅ Product saved successfully:', savedProduct._id);
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('\n❌❌❌ ERROR CREATING PRODUCT ❌❌❌');
    console.error('Error message:', err.message);
    console.error('Error name:', err.name);
    console.error('Error stack:', err.stack);
    console.error('Full error object:', err);
    console.error('==========================================\n');
    res.status(500).json({ 
      message: err.message || "حدث خطأ أثناء إنشاء المنتج",
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};


// تعديل منتج
export const updateProduct = async (req, res) => {
  try {
    console.log('\n========== Update Product Request ==========');
    console.log('Content-Type:', req.get('content-type'));
    console.log('req.body type:', typeof req.body);
    console.log('req.body:', req.body);
    console.log('req.body keys:', req.body ? Object.keys(req.body) : 'N/A');
    console.log('req.file:', req.file);
    console.log('Product ID:', req.params.id);
    console.log('==========================================\n');
    
    // التأكد من وجود req.body
    if (!req.body || typeof req.body !== 'object') {
      console.error('❌ ERROR: req.body is undefined or not an object');
      return res.status(400).json({ 
        message: "خطأ في البيانات المرسلة - req.body غير موجود" 
      });
    }
    
    let updateData = { ...req.body };
    
    // تحويل الأرقام إذا كانت موجودة (عند استخدام FormData تأتي كـ strings)
    if (updateData.price !== undefined) updateData.price = Number(updateData.price) || 0;
    if (updateData.rating !== undefined) updateData.rating = Number(updateData.rating) || 0;
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock) || 0;
    
    // إذا تم رفع ملف صورة جديد، استخدم رابط الملف المرفوع
    if (req.file) {
      const baseUrl = req.protocol + '://' + req.get('host');
      updateData.image = `${baseUrl}/uploads/${req.file.filename}`;
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
