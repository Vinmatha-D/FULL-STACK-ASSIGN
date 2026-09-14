const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products with filtering, searching & sorting (READ)
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, sort } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(category, 'i') };
    }

    if (search) {
      query.$or = [
        { title: { $regex: new RegExp(search, 'i') } },
        { category: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } }
      ];
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    if (sort === 'price_desc') sortOptions = { price: -1 };
    if (sort === 'rating') sortOptions = { rating: -1 };

    const products = await Product.find(query).sort(sortOptions);
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single product by ID (READ)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST new product (CREATE)
router.post('/', async (req, res) => {
  try {
    const { title, category, price, mrp, unit, stock, imageUrl, deliveryTime, description, isFeatured } = req.body;
    
    if (!title || !category || price === undefined || mrp === undefined || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Please provide title, category, price, mrp, and imageUrl' });
    }

    const product = new Product({
      title,
      category,
      price: Number(price),
      mrp: Number(mrp),
      unit: unit || '1 unit',
      stock: stock !== undefined ? Number(stock) : 50,
      imageUrl,
      deliveryTime: deliveryTime || '8 MINS',
      description: description || '',
      isFeatured: isFeatured || false
    });

    await product.save();
    res.status(201).json({ success: true, data: product, message: 'Product created successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update product (UPDATE)
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    Object.assign(product, req.body);
    await product.save();

    res.json({ success: true, data: product, message: 'Product updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE product (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully', data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
