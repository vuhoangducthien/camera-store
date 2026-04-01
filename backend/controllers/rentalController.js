const rentalService = require('../services/rentalService');

// @desc    Create a rental request
// @route   POST /api/rentals
const createRental = async (req, res, next) => {
  try {
    const { items, product_id, productId, start_date, startDate, end_date, endDate, quantity } = req.body;

    const singleProductId = productId || product_id;
    const start = startDate || start_date;
    const end = endDate || end_date;

    if (singleProductId) {
      const rental = await rentalService.createRental({
        userId: req.user.id,
        productId: singleProductId,
        quantity: quantity || 1,
        startDate: start,
        endDate: end,
      });
      return res.status(201).json(rental);
    }

    if (!Array.isArray(items) || items.length !== 1) {
      return res.status(400).json({ message: 'Chỉ hỗ trợ tạo đơn thuê cho 1 sản phẩm mỗi lần' });
    }

    const first = items[0];
    const rental = await rentalService.createRental({
      userId: req.user.id,
      productId: first.productId || first.product_id,
      quantity: first.quantity || 1,
      startDate: start,
      endDate: end,
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
    const rentals = await rentalService.getMyRentals(req.user.id);
    res.json(rentals);
  } catch (error) {
    next(error);
  }
};

// @desc    Get rental by id (user/admin)
// @route   GET /api/rentals/:id
const getRentalById = async (req, res, next) => {
  try {
    const rental = await rentalService.getRentalById({
      rentalId: req.params.id,
      userId: req.user.id,
      isAdmin: req.user.role === 'ADMIN',
    });
    res.json(rental);
  } catch (error) {
    next(error);
  }
};

// @desc    Get rentals booked ranges by product (calendar)
// @route   GET /api/rentals/product/:product_id
const getProductBookings = async (req, res, next) => {
  try {
    const productId = req.params.product_id || req.params.productId;
    const data = await rentalService.getBookedRangesByProduct(productId);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all rentals (admin)
// @route   GET /api/rentals/admin
const getAllRentals = async (req, res, next) => {
  try {
    const rentals = await rentalService.adminGetAllRentals();
    res.json(rentals);
  } catch (error) {
    next(error);
  }
};

// @desc    Update rental status (admin)
// @route   PUT /api/rentals/:id
const updateRentalStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const rental = await rentalService.adminUpdateRentalStatus({
      rentalId: req.params.id,
      status,
    });
    res.json(rental);
  } catch (error) {
    next(error);
  }
};

// @desc    Process payment for a rental (deposit/full)
// @route   POST /api/rentals/:id/pay
const processRentalPayment = async (req, res, next) => {
  try {
    const { paymentMethod, paymentType } = req.body || {};
    const rental = await rentalService.payRental({
      rentalId: req.params.id,
      userId: req.user.id,
      isAdmin: req.user.role === 'ADMIN',
      paymentMethod,
      paymentType,
    });
    res.json(rental);
  } catch (error) {
    next(error);
  }
};

// Admin: update rental status (optional)

module.exports = { createRental, getMyRentals, getRentalById, getProductBookings, getAllRentals, updateRentalStatus, processRentalPayment };
