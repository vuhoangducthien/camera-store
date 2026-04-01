const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all users (admin)
// @route   GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        address: true,
        cccd: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

const updateMe = async (req, res, next) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : undefined;
    const phone = typeof req.body.phone === 'string' ? req.body.phone.trim() : undefined;
    const address = typeof req.body.address === 'string' ? req.body.address.trim() : undefined;
    const cccd = typeof req.body.cccd === 'string' ? req.body.cccd.trim() : undefined;

    if (phone !== undefined && phone !== '') {
      const normalized = phone.replace(/\s+/g, '');
      if (!/^\d{9,11}$/.test(normalized)) {
        return res.status(400).json({ message: 'Số điện thoại không hợp lệ' });
      }
    }

    if (cccd !== undefined && cccd !== '') {
      const normalized = cccd.replace(/\s+/g, '');
      if (!/^\d{9,12}$/.test(normalized)) {
        return res.status(400).json({ message: 'CCCD không hợp lệ' });
      }
    }

    if (address !== undefined && address !== '' && address.length < 5) {
      return res.status(400).json({ message: 'Địa chỉ quá ngắn' });
    }

    if (name !== undefined && name !== '' && name.length < 2) {
      return res.status(400).json({ message: 'Tên hiển thị quá ngắn' });
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name !== undefined ? { name: name || null } : {}),
        ...(phone !== undefined ? { phone: phone || null } : {}),
        ...(address !== undefined ? { address: address || null } : {}),
        ...(cccd !== undefined ? { cccd: cccd || null } : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        address: true,
        cccd: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getMe, updateMe };
