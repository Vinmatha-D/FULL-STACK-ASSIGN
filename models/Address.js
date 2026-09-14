const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  houseNo: { type: String, required: true },
  street: { type: String, required: true },
  landmark: { type: String, default: '' },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  type: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
