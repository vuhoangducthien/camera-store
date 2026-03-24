const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Create a rental request
// @route   POST /api/rentals
const createRental = async (req, res, next) => {
  try {
    const { items, startDate, endDate } = req.body; // items: [{ productId, quantity }]
    // Validate products
    const productIds = items.map(i => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    if (products.length !== productIds.length) {
      return res.status(400).json({ message: 'Some products not found' });
    }

    let total = 0;
    const rentalItemsData = [];
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      const price = product.rentalPrice || 0;
      total += price * item.quantity;
      rentalItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price
      });
    }

    const rental = await prisma.rental.create({
      data: {
        userId: req.user.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        total,
        items: { create: rentalItemsData }
      }
    });

    res.status(201).json(rental);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's rentals
// @route   GET /api/rentals
const getMyRentals = async (req, res, next) => {
  try {
    const rentals = await prisma.rental.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(rentals);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all rentals (admin)
const getAllRentals = async (req, res, next) => {
  try {
    const rentals = await prisma.rental.findMany({
      include: { user: true, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(rentals);
  } catch (error) {
    next(error);
  }
};

// @desc    Update rental status (admin)
const updateRentalStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const rental = await prisma.rental.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(rental);
  } catch (error) {
    next(error);
  }
};

// Admin: update rental status (optional)

module.exports = { createRental, getMyRentals };