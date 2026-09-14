const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  discountPercentage: { type: Number, default: 0 },
  unit: { type: String, required: true, default: '1 unit' },
  stock: { type: Number, required: true, default: 50 },
  inStock: { type: Boolean, default: true },
  imageUrl: { type: String, required: true },
  deliveryTime: { type: String, default: '8 MINS' },
  rating: { type: Number, default: 4.8 },
  isFeatured: { type: Boolean, default: false },
  description: { type: String, default: '' }
}, { timestamps: true });

// Pre-save middleware to calculate discount percentage and inStock status
productSchema.pre('save', function () {
  if (this.mrp > this.price) {
    this.discountPercentage = Math.round(((this.mrp - this.price) / this.mrp) * 100);
  } else {
    this.discountPercentage = 0;
  }
  this.inStock = this.stock > 0;
});

module.exports = mongoose.model('Product', productSchema);
