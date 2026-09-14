const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 }
});

const cartSchema = new mongoose.Schema({
  sessionId: { type: String, default: 'default-session' },
  items: [cartItemSchema],
  deliveryTip: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 15 },
  subtotal: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
