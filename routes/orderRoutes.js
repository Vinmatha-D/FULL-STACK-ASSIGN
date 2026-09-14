const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to generate custom Order ID like BLK-92841
function generateOrderId() {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `BLK-${randomNum}`;
}

// POST create order from active cart (CREATE)
router.post('/', async (req, res) => {
  try {
    const { address, paymentMethod = 'Cash on Delivery' } = req.body;
    
    // Fetch current cart
    const cart = await Cart.findOne({ sessionId: 'default-session' }).populate('items.product');
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty. Add items before placing an order.' });
    }

    // Build order items
    const orderItems = [];
    for (const cartItem of cart.items) {
      if (cartItem.product) {
        orderItems.push({
          product: cartItem.product._id,
          title: cartItem.product.title,
          price: cartItem.product.price,
          quantity: cartItem.quantity,
          unit: cartItem.product.unit,
          imageUrl: cartItem.product.imageUrl
        });

        // Deduct stock
        if (cartItem.product.stock >= cartItem.quantity) {
          cartItem.product.stock -= cartItem.quantity;
          await cartItem.product.save();
        }
      }
    }

    const addr = address || {};
    const newOrder = new Order({
      orderId: generateOrderId(),
      items: orderItems,
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      deliveryTip: cart.deliveryTip,
      grandTotal: cart.grandTotal,
      deliveryAddress: {
        name: addr.name || 'Guest User',
        phone: addr.phone || '9876543210',
        houseNo: addr.houseNo || 'Flat 402, Green Towers',
        street: addr.street || 'MG Road, Koramangala',
        city: addr.city || 'Bengaluru',
        pincode: addr.pincode || '560034',
        addressType: addr.type || addr.addressType || 'Home'
      },
      paymentMethod,
      status: 'Order Placed',
      estimatedDeliveryTime: '10 Mins'
    });

    await newOrder.save();

    // Clear cart
    cart.items = [];
    cart.subtotal = 0;
    cart.deliveryTip = 0;
    cart.grandTotal = 0;
    await cart.save();

    res.status(201).json({ success: true, message: 'Order placed successfully!', data: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all orders (READ)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single order by ID or orderId (READ)
router.get('/:id', async (req, res) => {
  try {
    const param = req.params.id;
    let order;
    if (param.startsWith('BLK-')) {
      order = await Order.findOne({ orderId: param });
    } else {
      order = await Order.findById(param);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH update order status (UPDATE)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Order Placed', 'Packing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, message: `Order status updated to ${status}`, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE order / cancel order (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, message: 'Order deleted successfully', data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
