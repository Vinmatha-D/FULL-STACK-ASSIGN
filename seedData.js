const Category = require('./models/Category');
const Product = require('./models/Product');

const seedCategories = [
  { name: 'Dairy & Eggs', icon: '🥛', description: 'Milk, butter, cheese, paneer & fresh eggs' },
  { name: 'Fruits & Veggies', icon: '🥦', description: 'Fresh farm fruits and vegetables' },
  { name: 'Snacks & Munchies', icon: '🍿', description: 'Chips, popcorn, namkeen & chocolates' },
  { name: 'Cold Drinks & Juices', icon: '🥤', description: 'Soft drinks, juices, energy drinks & water' },
  { name: 'Instant & Frozen Food', icon: '🍜', description: 'Noodles, soups, pasta & frozen snacks' },
  { name: 'Bakery & Biscuits', icon: '🍞', description: 'Bread, cookies, cakes & rusks' },
  { name: 'Chocolates & Ice Creams', icon: '🍦', description: 'Silk chocolates, ice cream tubs & cones' },
  { name: 'Tea, Coffee & Drinks', icon: '☕', description: 'Coffee jars, tea leaves & health drinks' },
  { name: 'Atta, Rice & Dal', icon: '🌾', description: 'Chakki atta, basmati rice & pulses' },
  { name: 'Personal Care', icon: '🧼', description: 'Soaps, handwashes & skin care' },
  { name: 'Household Cleaning', icon: '🧹', description: 'Detergents, dishwashers & spray cleaners' }
];

const seedProducts = [
  // --- Dairy & Eggs ---
  {
    title: 'Amul Taaza Fresh Toned Milk',
    category: 'Dairy & Eggs',
    price: 27,
    mrp: 30,
    unit: '500 ml',
    stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '8 MINS',
    rating: 4.9,
    isFeatured: true,
    description: 'Pasteurized toned milk packed with nutrition and natural taste.'
  },
  {
    title: 'Amul Masti Dahi Curd',
    category: 'Dairy & Eggs',
    price: 35,
    mrp: 40,
    unit: '400 g',
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '8 MINS',
    rating: 4.8,
    isFeatured: false,
    description: 'Thick, creamy, and probiotic rich fresh natural curd.'
  },
  {
    title: 'Amul Malai Paneer Block',
    category: 'Dairy & Eggs',
    price: 95,
    mrp: 105,
    unit: '200 g',
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '7 MINS',
    rating: 4.9,
    isFeatured: true,
    description: 'Soft and fresh cottage cheese block for delicious curries.'
  },
  {
    title: 'Amul Pasteurized Salted Butter',
    category: 'Dairy & Eggs',
    price: 58,
    mrp: 60,
    unit: '100 g',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '8 MINS',
    rating: 4.9,
    isFeatured: true,
    description: 'Rich creamy salted butter made from fresh cow milk.'
  },
  {
    title: 'Farm Fresh White Eggs Pack',
    category: 'Dairy & Eggs',
    price: 99,
    mrp: 120,
    unit: '12 pcs',
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '9 MINS',
    rating: 4.8,
    isFeatured: true,
    description: 'High protein fresh farm white eggs, washed and quality verified.'
  },

  // --- Fruits & Veggies ---
  {
    title: 'Farm Fresh Organic Bananas',
    category: 'Fruits & Veggies',
    price: 39,
    mrp: 50,
    unit: '6 pcs',
    stock: 90,
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '9 MINS',
    rating: 4.8,
    isFeatured: true,
    description: 'Freshly harvested rich potassium bananas direct from certified farms.'
  },
  {
    title: 'Farm Fresh Hybrid Tomatoes',
    category: 'Fruits & Veggies',
    price: 24,
    mrp: 32,
    unit: '500 g',
    stock: 70,
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '8 MINS',
    rating: 4.7,
    isFeatured: false,
    description: 'Firm and juicy red tomatoes perfect for salads and cooking.'
  },
  {
    title: 'Fresh Red Onions',
    category: 'Fruits & Veggies',
    price: 38,
    mrp: 50,
    unit: '1 kg',
    stock: 100,
    imageUrl: '/images/fresh_red_onions.jpg',
    deliveryTime: '9 MINS',
    rating: 4.9,
    isFeatured: true,
    description: 'Crisp Indian red onions, kitchen essential for daily meals.'
  },
  {
    title: 'Imported Hass Avocados',
    category: 'Fruits & Veggies',
    price: 189,
    mrp: 249,
    unit: '2 pcs',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '10 MINS',
    rating: 4.7,
    isFeatured: true,
    description: 'Nutritious creamy Hass avocados perfect for guacamole and toast.'
  },
  {
    title: 'Fresh Alphonso Mangoes Box',
    category: 'Fruits & Veggies',
    price: 299,
    mrp: 399,
    unit: '1 kg',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '10 MINS',
    rating: 5.0,
    isFeatured: true,
    description: 'Naturally ripened sweet aromatic Ratnagiri Alphonso mangoes.'
  },

  // --- Snacks & Munchies ---
  {
    title: 'Doritos Nacho Cheese Tortilla Chips',
    category: 'Snacks & Munchies',
    price: 85,
    mrp: 99,
    unit: '150 g',
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '7 MINS',
    rating: 4.7,
    isFeatured: true,
    description: 'Crunchy tortilla chips loaded with savory bold nacho cheese flavor.'
  },
  {
    title: "Haldiram's Nagpur Bhujia Sev",
    category: 'Snacks & Munchies',
    price: 110,
    mrp: 130,
    unit: '350 g',
    stock: 40,
    imageUrl: '/images/haldiram_sev.jpg',
    deliveryTime: '7 MINS',
    rating: 4.9,
    isFeatured: true,
    description: 'Crispy fried spicy gram flour noodles seasoned with moth bean flour.'
  },
  {
    title: 'Pringles Sour Cream & Onion',
    category: 'Snacks & Munchies',
    price: 115,
    mrp: 135,
    unit: '107 g',
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '8 MINS',
    rating: 4.8,
    isFeatured: true,
    description: 'Iconic stackable potato chips with creamy onion seasoning.'
  },
  {
    title: 'Act II Butter Popcorn 3-Pack',
    category: 'Snacks & Munchies',
    price: 65,
    mrp: 75,
    unit: '3 x 70 g',
    stock: 55,
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '7 MINS',
    rating: 4.6,
    isFeatured: false,
    description: 'Instant stovetop butter popcorn for movie nights.'
  },

  // --- Cold Drinks & Juices ---
  {
    title: 'Coca-Cola Zero Sugar Can',
    category: 'Cold Drinks & Juices',
    price: 40,
    mrp: 45,
    unit: '300 ml',
    stock: 85,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '8 MINS',
    rating: 4.9,
    isFeatured: true,
    description: 'Chilled refreshing zero sugar cola for guilt-free instant refreshment.'
  },
  {
    title: 'Tropicana 100% Real Orange Juice',
    category: 'Cold Drinks & Juices',
    price: 125,
    mrp: 145,
    unit: '1 L',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '8 MINS',
    rating: 4.8,
    isFeatured: true,
    description: 'Pure squeezed sweet orange juice packed with natural Vitamin C.'
  },
  {
    title: 'Red Bull Energy Drink Can',
    category: 'Cold Drinks & Juices',
    price: 125,
    mrp: 130,
    unit: '250 ml',
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '7 MINS',
    rating: 4.9,
    isFeatured: true,
    description: 'Vitalizes body and mind with taurine and caffeine boost.'
  },

  // --- Instant & Frozen Food ---
  {
    title: 'Maggi 2-Minute Masala Noodles',
    category: 'Instant & Frozen Food',
    price: 54,
    mrp: 60,
    unit: '4 Pack (280 g)',
    stock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '7 MINS',
    rating: 4.9,
    isFeatured: true,
    description: 'India favorite instant noodles with iconic aromatic spice blend.'
  },
  {
    title: 'McCain Crispy French Fries',
    category: 'Instant & Frozen Food',
    price: 115,
    mrp: 135,
    unit: '450 g',
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '10 MINS',
    rating: 4.8,
    isFeatured: true,
    description: 'Crispy golden potato fries ready to deep fry or air fry.'
  },

  // --- Bakery & Biscuits ---
  {
    title: 'Modern 100% Whole Wheat Bread',
    category: 'Bakery & Biscuits',
    price: 45,
    mrp: 50,
    unit: '400 g',
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '8 MINS',
    rating: 4.6,
    isFeatured: false,
    description: 'Soft and healthy whole wheat bread slices for your daily breakfast.'
  },
  {
    title: 'Oreo Dark Chocolate Biscuits',
    category: 'Bakery & Biscuits',
    price: 35,
    mrp: 40,
    unit: '120 g',
    stock: 70,
    imageUrl: '/images/oreo_dark_chocolate.jpg',
    deliveryTime: '7 MINS',
    rating: 4.9,
    isFeatured: true,
    description: 'Crunchy cocoa cookies filled with rich vanilla cream.'
  },

  // --- Chocolates & Ice Creams ---
  {
    title: 'Cadbury Dairy Milk Silk Chocolate',
    category: 'Chocolates & Ice Creams',
    price: 175,
    mrp: 190,
    unit: '150 g',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '8 MINS',
    rating: 4.9,
    isFeatured: true,
    description: 'Ultra smooth, melt-in-mouth premium milk chocolate bar.'
  },
  {
    title: 'Amul Belgian Chocolate Ice Cream Tub',
    category: 'Chocolates & Ice Creams',
    price: 240,
    mrp: 280,
    unit: '1 L Tub',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '10 MINS',
    rating: 5.0,
    isFeatured: true,
    description: 'Rich dark Belgian cocoa gourmet ice cream tub.'
  },

  // --- Tea, Coffee & Drinks ---
  {
    title: 'Nescafe Classic Instant Coffee',
    category: 'Tea, Coffee & Drinks',
    price: 165,
    mrp: 180,
    unit: '50 g Jar',
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '8 MINS',
    rating: 4.9,
    isFeatured: true,
    description: '100% pure natural coffee beans roasted to perfection.'
  },
  {
    title: 'Tata Tea Gold Premium Assam Tea',
    category: 'Tea, Coffee & Drinks',
    price: 280,
    mrp: 320,
    unit: '500 g Pack',
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '9 MINS',
    rating: 4.8,
    isFeatured: false,
    description: 'Fine long tea leaves blended with rich Assam orthodox tea.'
  },

  // --- Atta, Rice & Dal ---
  {
    title: 'Aashirvaad Shuddh Chakki Whole Wheat Atta',
    category: 'Atta, Rice & Dal',
    price: 245,
    mrp: 285,
    unit: '5 kg',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '10 MINS',
    rating: 4.9,
    isFeatured: true,
    description: '100% pure whole wheat grain flour for soft puffed rotis.'
  },
  {
    title: 'Daawat Rozana Super Basmati Rice',
    category: 'Atta, Rice & Dal',
    price: 420,
    mrp: 520,
    unit: '5 kg',
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '10 MINS',
    rating: 4.8,
    isFeatured: true,
    description: 'Aromatic long grain Basmati rice ideal for daily biryanis and pulao.'
  },

  // --- Personal Care ---
  {
    title: 'Dettol Original Liquid Handwash Refill',
    category: 'Personal Care',
    price: 210,
    mrp: 249,
    unit: '1500 ml',
    stock: 40,
    imageUrl: '/images/dettol_handwash_refill.jpg',
    deliveryTime: '8 MINS',
    rating: 4.9,
    isFeatured: true,
    description: '99.9% germ protection liquid hand wash refill pouch.'
  },
  {
    title: 'Dove Cream Beauty Bath Soap (3 Pack)',
    category: 'Personal Care',
    price: 165,
    mrp: 190,
    unit: '3 x 100 g',
    stock: 55,
    imageUrl: '/images/dove_cream_beauty.jpg',
    deliveryTime: '8 MINS',
    rating: 4.9,
    isFeatured: true,
    description: '1/4 moisturizing cream formulation for smooth radiant skin.'
  },

  // --- Household Cleaning ---
  {
    title: 'Surf Excel Easy Wash Detergent Powder',
    category: 'Household Cleaning',
    price: 145,
    mrp: 165,
    unit: '1 kg',
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=600&q=80',
    deliveryTime: '9 MINS',
    rating: 4.8,
    isFeatured: false,
    description: 'Superior stain removal technology for bright clean clothes.'
  },
  {
    title: 'Vim Dishwash Gel Lemon Bottle',
    category: 'Household Cleaning',
    price: 155,
    mrp: 180,
    unit: '750 ml',
    stock: 50,
    imageUrl: '/images/vim_dishwash.jpg',
    deliveryTime: '8 MINS',
    rating: 4.9,
    isFeatured: true,
    description: 'Powerful lemon degreasing liquid gel for spotless utensils.'
  }
];

async function seedDatabase() {
  try {
    await Category.deleteMany({});
    for (const cat of seedCategories) {
      const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await Category.create({ ...cat, slug });
    }
    console.log('✅ Categories seeded successfully');

    await Product.deleteMany({});
    await Product.insertMany(seedProducts);
    console.log(`✅ ${seedProducts.length} Products seeded successfully`);
  } catch (err) {
    console.error('Error seeding database:', err.message);
  }
}

module.exports = seedDatabase;
