const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const ALLOWED_RENTAL_STATUSES = ['pending', 'approved', 'returned', 'cancelled'];
const BLOCKING_RENTAL_STATUSES = ['pending', 'approved', 'requested', 'active', 'PENDING', 'APPROVED', 'REQUESTED', 'ACTIVE'];
const ALLOWED_PAYMENT_METHODS = ['cash', 'bank', 'cod'];

function normalizeStatus(status) {
  if (!status) return null;
  const s = String(status).trim().toLowerCase();
  const aliases = {
    requested: 'pending',
    active: 'approved',
    completed: 'returned',
    rejected: 'cancelled',
  };
  return aliases[s] || s;
}

function parseDateOnly(input) {
  if (!input) return null;
  const value = String(input).trim();
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function calculateDays(startDate, endDate) {
  const ms = endDate.getTime() - startDate.getTime();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return days <= 0 ? 1 : days;
}

async function assertNoOverlap({ productId, startDate, endDate }) {
  const overlap = await prisma.rental.findFirst({
    where: {
      status: { in: BLOCKING_RENTAL_STATUSES },
      startDate: { lte: endDate },
      endDate: { gte: startDate },
      items: {
        some: {
          productId,
        },
      },
    },
    select: { id: true },
  });

  if (overlap) {
    const error = new Error('Sản phẩm đã được thuê trong khoảng thời gian này');
    error.status = 409;
    throw error;
  }
}

async function createRental({ userId, productId, quantity, startDate, endDate }) {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);
  if (!start || !end) {
    const error = new Error('Ngày bắt đầu/kết thúc không hợp lệ');
    error.status = 400;
    throw error;
  }

  const today = startOfToday();
  if (start < today) {
    const error = new Error('Ngày bắt đầu không được ở trong quá khứ');
    error.status = 400;
    throw error;
  }

  if (start >= end) {
    const error = new Error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
    error.status = 400;
    throw error;
  }

  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty < 1) {
    const error = new Error('Số lượng thuê không hợp lệ');
    error.status = 400;
    throw error;
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, rentalPrice: true, stock: true },
  });

  if (!product) {
    const error = new Error('Không tìm thấy sản phẩm');
    error.status = 404;
    throw error;
  }

  if (!product.rentalPrice || product.rentalPrice <= 0) {
    const error = new Error('Sản phẩm này chưa hỗ trợ thuê');
    error.status = 400;
    throw error;
  }

  if (product.stock <= 0) {
    const error = new Error('Sản phẩm đã hết hàng');
    error.status = 400;
    throw error;
  }

  await assertNoOverlap({ productId: product.id, startDate: start, endDate: end });

  const days = calculateDays(start, end);
  const total = days * product.rentalPrice * qty;
  const deposit = total * 0.3;

  const rental = await prisma.rental.create({
    data: {
      userId,
      startDate: start,
      endDate: end,
      total,
      deposit,
      status: 'pending',
      items: {
        create: [
          {
            productId: product.id,
            quantity: qty,
            price: product.rentalPrice,
          },
        ],
      },
    },
    include: { items: { include: { product: true } } },
  });

  return rental;
}

async function getMyRentals(userId) {
  return prisma.rental.findMany({
    where: { userId },
    include: { items: { include: { product: { include: { images: true } } } }, payment: true },
    orderBy: { createdAt: 'desc' },
  });
}

async function getBookedRangesByProduct(productId) {
  const rentals = await prisma.rental.findMany({
    where: {
      status: { in: BLOCKING_RENTAL_STATUSES },
      items: { some: { productId } },
    },
    select: { startDate: true, endDate: true },
    orderBy: { startDate: 'asc' },
  });

  return rentals.map((r) => ({
    start_date: r.startDate.toISOString().slice(0, 10),
    end_date: r.endDate.toISOString().slice(0, 10),
  }));
}

async function getRentalById({ rentalId, userId, isAdmin }) {
  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    include: {
      user: true,
      items: {
        include: {
          product: { include: { images: true } },
        },
      },
      payment: true,
    },
  });

  if (!rental) {
    const error = new Error('Không tìm thấy đơn thuê');
    error.status = 404;
    throw error;
  }

  if (!isAdmin && rental.userId !== userId) {
    const error = new Error('Không có quyền truy cập đơn thuê này');
    error.status = 403;
    throw error;
  }

  return rental;
}

async function adminGetAllRentals() {
  return prisma.rental.findMany({
    include: { user: true, items: { include: { product: { include: { images: true } } } }, payment: true },
    orderBy: { createdAt: 'desc' },
  });
}

async function adminUpdateRentalStatus({ rentalId, status }) {
  const normalized = normalizeStatus(status);
  if (!normalized || !ALLOWED_RENTAL_STATUSES.includes(normalized)) {
    const error = new Error('Trạng thái không hợp lệ');
    error.status = 400;
    throw error;
  }

  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    include: { items: { select: { productId: true } } },
  });

  if (!rental) {
    const error = new Error('Không tìm thấy đơn thuê');
    error.status = 404;
    throw error;
  }

  const current = normalizeStatus(rental.status) || 'pending';
  if (current === normalized) return rental;

  const today = startOfToday();
  const allowedTransitions = {
    pending: new Set(['approved', 'cancelled']),
    approved: new Set(['returned', 'cancelled']),
    returned: new Set([]),
    cancelled: new Set([]),
  };

  if (!allowedTransitions[current] || !allowedTransitions[current].has(normalized)) {
    const error = new Error('Không thể cập nhật trạng thái theo luồng hiện tại');
    error.status = 400;
    throw error;
  }

  if (normalized === 'approved') {
    for (const it of rental.items) {
      const overlap = await prisma.rental.findFirst({
        where: {
          id: { not: rental.id },
          status: { in: BLOCKING_RENTAL_STATUSES },
          startDate: { lte: rental.endDate },
          endDate: { gte: rental.startDate },
          items: { some: { productId: it.productId } },
        },
        select: { id: true },
      });
      if (overlap) {
        const error = new Error('Không thể duyệt vì bị trùng lịch thuê');
        error.status = 409;
        throw error;
      }
    }
  }

  return prisma.rental.update({
    where: { id: rentalId },
    data: { status: normalized },
  });
}

async function payRental({ rentalId, userId, isAdmin, paymentMethod, paymentType }) {
  const method = String(paymentMethod || 'cash').trim().toLowerCase();
  if (!ALLOWED_PAYMENT_METHODS.includes(method)) {
    const error = new Error('Phương thức thanh toán không hợp lệ');
    error.status = 400;
    throw error;
  }

  const type = String(paymentType || 'deposit').trim().toLowerCase();
  if (type !== 'deposit' && type !== 'full') {
    const error = new Error('Loại thanh toán không hợp lệ');
    error.status = 400;
    throw error;
  }

  return prisma.$transaction(async (tx) => {
    const rental = await tx.rental.findUnique({
      where: { id: rentalId },
      include: { payment: true },
    });

    if (!rental) {
      const error = new Error('Không tìm thấy đơn thuê');
      error.status = 404;
      throw error;
    }

    if (!isAdmin && rental.userId !== userId) {
      const error = new Error('Không có quyền thao tác');
      error.status = 403;
      throw error;
    }

    const status = normalizeStatus(rental.status);
    if (status === 'cancelled' || status === 'returned') {
      const error = new Error('Đơn thuê đã hủy, không thể thanh toán');
      error.status = 400;
      throw error;
    }

    if (status !== 'pending' && status !== 'approved') {
      const error = new Error('Chỉ có thể thanh toán khi đơn đang chờ xử lý hoặc đã duyệt');
      error.status = 400;
      throw error;
    }

    if (rental.paymentStatus === 'PAID') {
      const error = new Error('Đơn thuê đã thanh toán');
      error.status = 400;
      throw error;
    }

    const amount = type === 'full' ? rental.total : (rental.deposit || rental.total * 0.3);

    const data = rental.payment
      ? {
          paymentStatus: 'PAID',
          payment: {
            update: {
              amount,
              status: 'COMPLETED',
              paymentMethod: method,
            },
          },
        }
      : {
          paymentStatus: 'PAID',
          payment: {
            create: {
              userId,
              amount,
              status: 'COMPLETED',
              paymentMethod: method,
            },
          },
        };

    return tx.rental.update({
      where: { id: rentalId },
      data,
      include: { payment: true },
    });
  });
}

module.exports = {
  createRental,
  getMyRentals,
  getBookedRangesByProduct,
  getRentalById,
  adminGetAllRentals,
  adminUpdateRentalStatus,
  payRental,
  normalizeStatus,
  ALLOWED_RENTAL_STATUSES,
};
