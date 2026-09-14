const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to get or create cart
async function getOrCreateCart(sessionId = 'default-session') {
  let cart = await Cart.findOne({ sessionId }).populate('items.product');
  if (!cart) {
    cart = new Cart({ sessionId, items: [], deliveryTip: 0, deliveryFee: 15 });
    await cart.save();
  }
  return cart;
}

// Recalculate totals
async function recalculateCart(cart) {
  let subtotal = 0;
  cart.items = cart.items.filter(item => item.product !== null); // Filter deleted products
  for (const item of cart.items) {
    if (item.product && item.product.price) {
      subtotal += item.product.price * item.quantity;
    }
  }
  cart.subtotal = subtotal;
  cart.deliveryFee = subtotal > 0 ? (subtotal > 300 ? 0 : 15) : 0; // Free delivery over 300
  cart.grandTotal = subtotal + cart.deliveryFee + (cart.deliveryTip || 0);
  await cart.save();
  return cart;
}

// GET active cart (READ)
router.get('/', async (req, res) => {
  try {
    const cart = await getOrCreateCart();
    await recalculateCart(cart);
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST add item to cart (CREATE / UPDATE)
router.post('/add', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'ProductId is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await getOrCreateCart();
    const existingIndex = cart.items.findIndex(item => item.product && item.product._id.toString() === productId);

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product');
    await recalculateCart(cart);

    res.json({ success: true, message: 'Product added to cart', data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update cart item quantity or tip (UPDATE)
router.put('/update', async (req, res) => {
  try {
    const { productId, quantity, deliveryTip } = req.body;
    let cart = await getOrCreateCart();

    if (deliveryTip !== undefined) {
      cart.deliveryTip = Number(deliveryTip);
    }

    if (productId && quantity !== undefined) {
      const targetQuantity = Number(quantity);
      if (targetQuantity <= 0) {
        cart.items = cart.items.filter(item => item.product && item.product._id.toString() !== productId);
      } else {
        const item = cart.items.find(i => i.product && i.product._id.toString() === productId);
        if (item) {
          item.quantity = targetQuantity;
        }
      }
    }

    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product');
    await recalculateCart(cart);

    res.json({ success: true, message: 'Cart updated', data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE single item from cart (DELETE)
router.delete('/remove/:productId', async (req, res) => {
  try {
    let cart = await getOrCreateCart();
    const { productId } = req.params;

    cart.items = cart.items.filter(item => item.product && item.product._id.toString() !== productId);
    await cart.save();

    cart = await Cart.findById(cart._id).populate('items.product');
    await recalculateCart(cart);

    res.json({ success: true, message: 'Item removed from cart', data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE clear all items from cart (DELETE)
router.delete('/clear', async (req, res) => {
  try {
    let cart = await getOrCreateCart();
    cart.items = [];
    cart.deliveryTip = 0;
    cart.subtotal = 0;
    cart.grandTotal = 0;
    await cart.save();

    res.json({ success: true, message: 'Cart cleared', data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
