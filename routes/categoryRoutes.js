const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// GET all categories (READ)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST new category (CREATE)
router.post('/', async (req, res) => {
  try {
    const { name, icon, image, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const category = new Category({
      name,
      slug,
      icon: icon || '🛒',
      image: image || '',
      description: description || ''
    });

    await category.save();
    res.status(201).json({ success: true, data: category, message: 'Category created successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE category (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully', data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
