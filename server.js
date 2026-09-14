const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const addressRoutes = require('./routes/addressRoutes');
const statsRoutes = require('./routes/statsRoutes');
const seedDatabase = require('./seedData');

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/stats', statsRoutes);

// Health check & API documentation ping
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'BlinkGo E-Commerce Backend',
    timestamp: new Date(),
    endpoints: {
      products: ['GET /api/products', 'GET /api/products/:id', 'POST /api/products', 'PUT /api/products/:id', 'DELETE /api/products/:id'],
      categories: ['GET /api/categories', 'POST /api/categories', 'DELETE /api/categories/:id'],
      cart: ['GET /api/cart', 'POST /api/cart/add', 'PUT /api/cart/update', 'DELETE /api/cart/remove/:productId', 'DELETE /api/cart/clear'],
      orders: ['POST /api/orders', 'GET /api/orders', 'GET /api/orders/:id', 'PATCH /api/orders/:id/status', 'DELETE /api/orders/:id'],
      addresses: ['GET /api/addresses', 'POST /api/addresses', 'DELETE /api/addresses/:id'],
      stats: ['GET /api/stats']
    }
  });
});

// Database connection setup with MongoMemoryServer fallback
async function connectDB() {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blinkgo_db';
  try {
    console.log('🔄 Attempting local MongoDB connection...');
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 2000 });
    console.log('✅ Connected to MongoDB at:', mongoURI);
  } catch (err) {
    console.log('⚠️ Local MongoDB not found. Launching MongoDB Memory Server...');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoMemoryServer at:', uri);
  }

  // Seed default data
  await seedDatabase();
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 BlinkGo Backend Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ Failed to start server:', err);
});
