const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all products (with optional filters)
// @route   GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { category, brand, search } = req.query;
    const where = {};
    if (category) where.category = category;
    if (brand) where.brand = brand;
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const products = await prisma.product.findMany({
      where,
      include: { images: true }
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { images: true, reviews: { include: { user: true } } }
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product (admin only)
// @route   POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const { images, ...data } = req.body;
    // images từ frontend là mảng { url } hoặc mảng string? Trong ProductForm, images là mảng { url }
    const product = await prisma.product.create({
      data: {
        ...data,
        images: images ? {
          create: images.map(img => ({ url: img.url }))
        } : undefined
      },
      include: { images: true }
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (admin only)
// @route   PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const { images, ...data } = req.body;
    
    const product = await prisma.$transaction(async (tx) => {
      // Cập nhật thông tin cơ bản
      const updated = await tx.product.update({
        where: { id: req.params.id },
        data
      });

      // Nếu có images, xóa hết ảnh cũ và tạo mới
      if (images && Array.isArray(images)) {
        // Xóa ảnh cũ
        await tx.productImage.deleteMany({
          where: { productId: req.params.id }
        });
        // Tạo ảnh mới
        await tx.productImage.createMany({
          data: images.map(img => ({ url: img.url, productId: req.params.id }))
        });
      }

      return updated;
    });

    // Trả về product kèm images (có thể query lại nếu cần)
    const result = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { images: true }
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (admin only)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};