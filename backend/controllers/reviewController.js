const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Create a review for a product
// @route   POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    // Check if user already reviewed this product
    const existing = await prisma.review.findFirst({
      where: { userId: req.user.id, productId }
    });
    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this product' });
    }

    const review = await prisma.review.create({
      data: { userId: req.user.id, productId, rating, comment }
    });
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:product_id
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.product_id },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, getProductReviews };