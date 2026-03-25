const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Create a new order from cart
// @route   POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });

    if (!cartItems.length) return res.status(400).json({ message: 'Cart is empty' });

    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        total,
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      }
    });

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's orders
// @route   GET /api/orders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID (user or admin)
// @route   GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { product: true } }, user: true }
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Check if user owns order or is admin
    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/admin/orders/:id
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status,
        ...(paymentStatus ? { paymentStatus } : {})
      }
    });
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Process payment for an order
// @route   POST /api/orders/:id/pay
const processPayment = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (order.paymentStatus === 'PAID') {
      return res.status(400).json({ message: 'Order already paid' });
    }
    // Giả lập thanh toán thành công
    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        paymentStatus: 'PAID',
        // Sau khi user thanh toán xong, chuyển sang "Chờ xác nhận" để admin duyệt
        status: 'PENDING',
      },
    });
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an order (user)
// @route   PUT /api/orders/:id/cancel
const cancelOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    // Cho phép hủy ở giai đoạn "Chờ xác nhận" (PENDING) và "Chờ lấy hàng" (PROCESSING)
    if (!['PENDING', 'PROCESSING'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    });
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Return an order (user)
// @route   PUT /api/orders/:id/return
const returnOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    if (order.status !== 'DELIVERED') return res.status(400).json({ message: 'Order cannot be returned' });

    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id },
      // Backend hiện chưa có enum riêng cho "RETURNED" nên trả hàng được map vào CANCELLED
      data: { status: 'CANCELLED', paymentStatus: 'REFUNDED' },
    });
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  processPayment, // <-- thêm hàm này
  cancelOrder,
  returnOrder,
};