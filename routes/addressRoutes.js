const express = require('express');
const router = express.Router();
const Address = require('../models/Address');

// GET all addresses (READ)
router.get('/', async (req, res) => {
  try {
    let addresses = await Address.find().sort({ isDefault: -1, createdAt: -1 });
    if (addresses.length === 0) {
      // Seed default address
      const defaultAddr = new Address({
        name: 'Alex Johnson',
        phone: '9876543210',
        houseNo: 'Flat 402, Green Towers',
        street: '100ft Ring Road, Koramangala',
        landmark: 'Near Sony World Signal',
        city: 'Bengaluru',
        pincode: '560034',
        type: 'Home',
        isDefault: true
      });
      await defaultAddr.save();
      addresses = [defaultAddr];
    }
    res.json({ success: true, count: addresses.length, data: addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST save address (CREATE)
router.post('/', async (req, res) => {
  try {
    const { name, phone, houseNo, street, landmark, city, pincode, type, isDefault } = req.body;
    if (!name || !phone || !houseNo || !street || !city || !pincode) {
      return res.status(400).json({ success: false, message: 'Please provide all required address fields' });
    }

    if (isDefault) {
      await Address.updateMany({}, { isDefault: false });
    }

    const address = new Address({
      name,
      phone,
      houseNo,
      street,
      landmark: landmark || '',
      city,
      pincode,
      type: type || 'Home',
      isDefault: isDefault || false
    });

    await address.save();
    res.status(201).json({ success: true, message: 'Address saved successfully', data: address });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE address (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id);
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }
    res.json({ success: true, message: 'Address deleted successfully', data: address });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
