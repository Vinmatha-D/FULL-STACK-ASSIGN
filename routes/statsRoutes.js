const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');

// GET dashboard statistics (READ)
router.get('/', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const outOfStockProducts = await Product.countDocuments({ stock: { $lte: 0 } });

    const orders = await Order.find({ status: { $ne: 'Cancelled' } });
    const totalRevenue = orders.reduce((sum, order) => sum + (order.grandTotal || 0), 0);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCategories,
        outOfStockProducts,
        recentOrders
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
