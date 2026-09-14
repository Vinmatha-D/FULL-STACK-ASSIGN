# ⚡ BlinkGo — Quick Commerce Full Stack Application

BlinkGo is a modern, Blinkit-style Quick Commerce web application for instant grocery and daily essentials ordering. Built with Node.js, Express, MongoDB, and Vanilla JavaScript, it features a responsive storefront for shoppers and a full-featured admin management dashboard.

---

## 🌟 Key Features

### 🛒 Customer Storefront (`public/index.html`)
- **Product Catalog**: Browse grocery items categorized into Vegetables & Fruits, Snacks & Munchies, Dairy & Bread, Cold Drinks & Juices, etc.
- **Search & Filter**: Search products dynamically by name and filter by category.
- **Shopping Cart**: Real-time cart calculations (Subtotal, Taxes, Delivery Fee, Total Savings).
- **Address Management**: Save and select delivery addresses.
- **Order Placement**: Simple one-click checkout with automated order creation.

### 🛡️ Admin Dashboard (`public/admin.html`)
- **Product Management**: Add new products, edit existing items, update prices, stock status, and product images.
- **Category Management**: Create and manage product categories.
- **Order Tracker**: View all incoming orders, track delivery status (Placed, Processing, Out for Delivery, Delivered, Cancelled), and update status in real-time.
- **Analytics & Stats**: Live summary metrics showing total revenue, total orders, active products, and customer counts.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ORM
  - *Fallback Support*: Includes `mongodb-memory-server` so the application runs seamlessly out-of-the-box even without a local MongoDB service installed!
- **Frontend**: HTML5, Vanilla CSS3, JavaScript (Fetch API)
- **Middleware**: CORS, Dotenv

---

## 📁 Project Architecture

```
FULL STACK ASSIGN/
├── models/             # Mongoose Data Models
│   ├── Address.js      # Customer Delivery Address Schema
│   ├── Cart.js         # Cart & Cart Items Schema
│   ├── Category.js     # Product Category Schema
│   ├── Order.js        # Customer Order Schema
│   └── Product.js      # Product Details Schema
├── public/             # Static Frontend Assets
│   ├── images/         # Optimized Product Images
│   ├── admin.html      # Admin Management Portal
│   ├── admin.js        # Admin Portal Script
│   ├── app.js          # Customer Storefront Script
│   ├── index.html      # Main Customer Storefront
│   └── styles.css      # Custom UI Styling
├── routes/             # REST API Endpoint Handlers
│   ├── addressRoutes.js
│   ├── cartRoutes.js
│   ├── categoryRoutes.js
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   └── statsRoutes.js
├── .gitignore          # Excluded files & folders
├── package.json        # Dependencies & Scripts
├── seedData.js         # Database Auto-seeder
└── server.js           # Express Server Entry Point
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Vinmatha-D/FULL-STACK-ASSIGN.git
   cd FULL-STACK-ASSIGN
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the application**:
   ```bash
   npm start
   ```
   *Or for development with automatic reload:*
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - 🛒 **Customer Storefront**: [http://localhost:5000](http://localhost:5000)
   - 🛡️ **Admin Dashboard**: [http://localhost:5000/admin.html](http://localhost:5000/admin.html)
   - ⚡ **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📡 REST API Documentation

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/products` | `GET` | Fetch all products (supports `?category=` filter) |
| `/api/products/:id` | `GET` | Fetch single product details |
| `/api/products` | `POST` | Create a new product (Admin) |
| `/api/products/:id` | `PUT` | Update product details (Admin) |
| `/api/products/:id` | `DELETE` | Delete a product (Admin) |
| `/api/categories` | `GET` | Fetch all categories |
| `/api/cart` | `GET` | Retrieve current cart contents |
| `/api/cart/add` | `POST` | Add item to cart |
| `/api/cart/update` | `PUT` | Update item quantity in cart |
| `/api/cart/remove/:id`| `DELETE` | Remove item from cart |
| `/api/orders` | `POST` | Place a new customer order |
| `/api/orders` | `GET` | Retrieve all customer orders |
| `/api/orders/:id/status`| `PATCH` | Update order status (Admin) |
| `/api/stats` | `GET` | Fetch dashboard statistics |

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
