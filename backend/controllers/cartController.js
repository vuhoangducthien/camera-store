const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get current user's cart
// @route   GET /api/cart
const getCart = async (req, res, next) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: { include: { images: true } } }
    });
    res.json(cartItems);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    // Check if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check if already in cart
    const existing = await prisma.cartItem.findFirst({
      where: { userId: req.user.id, productId }
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity }
      });
      res.json(updated);
    } else {
      const newItem = await prisma.cartItem.create({
        data: { userId: req.user.id, productId, quantity }
      });
      res.status(201).json(newItem);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
const removeFromCart = async (req, res, next) => {
  try {
    const result = await prisma.cartItem.deleteMany({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (result.count === 0) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, removeFromCart };