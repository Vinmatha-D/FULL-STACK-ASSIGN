const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  title: String,
  price: Number,
  quantity: Number,
  unit: String,
  imageUrl: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 15 },
  deliveryTip: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  deliveryAddress: {
    name: { type: String },
    phone: { type: String },
    houseNo: { type: String },
    street: { type: String },
    landmark: { type: String, default: '' },
    city: { type: String },
    pincode: { type: String },
    addressType: { type: String, default: 'Home' }
  },
  status: {
    type: String,
    enum: ['Order Placed', 'Packing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Order Placed'
  },
  paymentMethod: { type: String, default: 'Cash on Delivery' },
  estimatedDeliveryTime: { type: String, default: '10 Mins' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
