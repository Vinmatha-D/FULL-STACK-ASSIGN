// BlinkGo Storefront App JS
const API_BASE = '/api';

let activeCategory = 'All';
let searchQuery = '';
let sortBy = 'latest';
let cartData = { items: [], subtotal: 0, deliveryFee: 0, deliveryTip: 0, grandTotal: 0 };
let addresses = [];
let selectedAddressId = null;
let currentTrackingOrder = null;
let trackingInterval = null;

// DOM Elements
const categoryBar = document.getElementById('categoryBar');
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const sectionTitle = document.getElementById('sectionTitle');
const btnOpenCart = document.getElementById('btnOpenCart');
const btnCloseCart = document.getElementById('btnCloseCart');
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer = document.getElementById('cartDrawer');
const cartBody = document.getElementById('cartBody');
const cartCountBadge = document.getElementById('cartCountBadge');
const cartTotalText = document.getElementById('cartTotalText');
const btnProceedCheckout = document.getElementById('btnProceedCheckout');
const checkoutModal = document.getElementById('checkoutModal');
const btnCloseCheckoutModal = document.getElementById('btnCloseCheckoutModal');
const addressList = document.getElementById('addressList');
const newAddressForm = document.getElementById('newAddressForm');
const btnConfirmOrder = document.getElementById('btnConfirmOrder');
const orderTrackerModal = document.getElementById('orderTrackerModal');
const btnCloseTrackerModal = document.getElementById('btnCloseTrackerModal');
const btnMyOrders = document.getElementById('btnMyOrders');
const ordersListModal = document.getElementById('ordersListModal');
const btnCloseOrdersListModal = document.getElementById('btnCloseOrdersListModal');
const allOrdersContainer = document.getElementById('allOrdersContainer');
const toastContainer = document.getElementById('toastContainer');

// Init application
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  setupEventListeners();
});

async function initApp() {
  await fetchCategories();
  await fetchProducts();
  await fetchCart();
  await fetchAddresses();
}

function setupEventListeners() {
  // Search input with debounce
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchQuery = e.target.value.trim();
      fetchProducts();
    }, 300);
  });

  // Sort select
  sortSelect.addEventListener('change', (e) => {
    sortBy = e.target.value;
    fetchProducts();
  });

  // Cart drawer toggles
  btnOpenCart.addEventListener('click', openCartDrawer);
  btnCloseCart.addEventListener('click', closeCartDrawer);
  cartOverlay.addEventListener('click', closeCartDrawer);

  // Checkout modal
  btnProceedCheckout.addEventListener('click', () => {
    if (!cartData.items || cartData.items.length === 0) {
      showToast('⚠️ Your cart is empty!');
      return;
    }
    closeCartDrawer();
    openCheckoutModal();
  });
  btnCloseCheckoutModal.addEventListener('click', closeCheckoutModal);

  // New Address form
  newAddressForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await createAddress();
  });

  // Confirm Order
  btnConfirmOrder.addEventListener('click', handlePlaceOrder);

  // Tracker Modal close
  btnCloseTrackerModal.addEventListener('click', () => {
    orderTrackerModal.classList.remove('open');
    if (trackingInterval) clearInterval(trackingInterval);
  });

  // Orders list modal
  btnMyOrders.addEventListener('click', openOrdersListModal);
  btnCloseOrdersListModal.addEventListener('click', () => ordersListModal.classList.remove('open'));
}

// ----------------------------------------------------
// Toast Notification Helper
// ----------------------------------------------------
function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-bell"></i> <span>${msg}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ----------------------------------------------------
// 1. Categories API
// ----------------------------------------------------
async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    if (data.success) {
      renderCategories(data.data);
    }
  } catch (err) {
    console.error('Failed to fetch categories:', err);
  }
}

function renderCategories(categories) {
  categoryBar.innerHTML = '';

  // "All" Pill
  const allPill = document.createElement('button');
  allPill.className = `category-pill ${activeCategory === 'All' ? 'active' : ''}`;
  allPill.innerHTML = `<span class="icon">⚡</span> All Items`;
  allPill.onclick = () => selectCategory('All');
  categoryBar.appendChild(allPill);

  categories.forEach(cat => {
    const pill = document.createElement('button');
    pill.className = `category-pill ${activeCategory === cat.name ? 'active' : ''}`;
    pill.innerHTML = `<span class="icon">${cat.icon || '🛒'}</span> ${cat.name}`;
    pill.onclick = () => selectCategory(cat.name);
    categoryBar.appendChild(pill);
  });
}

function selectCategory(categoryName) {
  activeCategory = categoryName;
  sectionTitle.textContent = categoryName === 'All' ? 'All Fresh Products' : `${categoryName}`;
  document.querySelectorAll('.category-pill').forEach(pill => {
    if (pill.innerText.includes(categoryName) || (categoryName === 'All' && pill.innerText.includes('All Items'))) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });
  fetchProducts();
}

// ----------------------------------------------------
// 2. Products API
// ----------------------------------------------------
async function fetchProducts() {
  try {
    let url = `${API_BASE}/products?sort=${sortBy}`;
    if (activeCategory !== 'All') url += `&category=${encodeURIComponent(activeCategory)}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

    const res = await fetch(url);
    const data = await res.json();
    if (data.success) {
      renderProducts(data.data);
    }
  } catch (err) {
    console.error('Failed to fetch products:', err);
  }
}

function renderProducts(products) {
  productsGrid.innerHTML = '';
  if (products.length === 0) {
    productsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <i class="fa-solid fa-magnifying-glass" style="font-size: 40px; color: #ccc; margin-bottom: 16px;"></i>
        <h3>No products found</h3>
        <p style="color: #666;">Try searching for another item or choose a different category.</p>
      </div>
    `;
    return;
  }

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    // Find quantity in cart
    const cartItem = cartData.items.find(i => i.product && (i.product._id === product._id || i.product === product._id));
    const qty = cartItem ? cartItem.quantity : 0;

    card.innerHTML = `
      <div class="time-badge"><i class="fa-solid fa-stopwatch"></i> ${product.deliveryTime || '8 MINS'}</div>
      ${product.discountPercentage > 0 ? `<div class="discount-badge">${product.discountPercentage}% OFF</div>` : ''}
      <div class="img-container">
        <img src="${product.imageUrl}" alt="${product.title}" loading="lazy">
      </div>
      <div class="unit-label">${product.unit}</div>
      <div class="product-title">${product.title}</div>
      <div class="card-footer">
        <div class="price-container">
          <div class="price-row">
            <span class="current-price">₹${product.price}</span>
            ${product.mrp > product.price ? `<span class="original-price">₹${product.mrp}</span>` : ''}
          </div>
        </div>
        <div>
          ${qty === 0 ? `
            <button class="btn-add" onclick="handleAddToCart('${product._id}')">ADD</button>
          ` : `
            <div class="qty-stepper">
              <button class="qty-btn" onclick="handleUpdateCartQty('${product._id}', ${qty - 1})">-</button>
              <span class="qty-val">${qty}</span>
              <button class="qty-btn" onclick="handleUpdateCartQty('${product._id}', ${qty + 1})">+</button>
            </div>
          `}
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

// ----------------------------------------------------
// 3. Cart API Operations
// ----------------------------------------------------
async function fetchCart() {
  try {
    const res = await fetch(`${API_BASE}/cart`);
    const data = await res.json();
    if (data.success) {
      cartData = data.data;
      updateCartUI();
    }
  } catch (err) {
    console.error('Failed to fetch cart:', err);
  }
}

async function handleAddToCart(productId) {
  try {
    const res = await fetch(`${API_BASE}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1 })
    });
    const data = await res.json();
    if (data.success) {
      cartData = data.data;
      showToast('🛒 Item added to cart');
      updateCartUI();
      renderProducts(await getCurrentProductsState());
    }
  } catch (err) {
    showToast('❌ Error adding item');
  }
}

async function handleUpdateCartQty(productId, newQty) {
  try {
    const res = await fetch(`${API_BASE}/cart/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: newQty })
    });
    const data = await res.json();
    if (data.success) {
      cartData = data.data;
      updateCartUI();
      renderProducts(await getCurrentProductsState());
    }
  } catch (err) {
    showToast('❌ Error updating cart');
  }
}

async function handleSetTip(tipAmount) {
  try {
    const res = await fetch(`${API_BASE}/cart/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deliveryTip: tipAmount })
    });
    const data = await res.json();
    if (data.success) {
      cartData = data.data;
      updateCartUI();
    }
  } catch (err) {
    console.error('Error setting tip:', err);
  }
}

async function getCurrentProductsState() {
  let url = `${API_BASE}/products?sort=${sortBy}`;
  if (activeCategory !== 'All') url += `&category=${encodeURIComponent(activeCategory)}`;
  if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.data || [];
}

function updateCartUI() {
  const totalItems = cartData.items ? cartData.items.reduce((sum, i) => sum + i.quantity, 0) : 0;
  cartCountBadge.textContent = totalItems;
  cartTotalText.textContent = `Total: ₹${cartData.grandTotal || 0}`;

  if (!cartDrawer.classList.contains('open')) return;

  renderCartDrawerContents();
}

function renderCartDrawerContents() {
  if (!cartData.items || cartData.items.length === 0) {
    cartBody.innerHTML = `
      <div class="empty-cart-view">
        <i class="fa-solid fa-basket-shopping" style="font-size: 50px; color: #ddd; margin-bottom: 16px;"></i>
        <h4>Your cart is empty</h4>
        <p style="font-size: 13px; color: #777; margin-top: 6px;">Add items to start a 10-minute delivery!</p>
      </div>
    `;
    return;
  }

  let itemsHTML = '';
  cartData.items.forEach(item => {
    const prod = item.product;
    if (!prod) return;
    itemsHTML += `
      <div class="cart-item">
        <img src="${prod.imageUrl}" alt="${prod.title}">
        <div class="cart-item-details">
          <div class="cart-item-title">${prod.title}</div>
          <div class="cart-item-price">${prod.unit} • ₹${prod.price}</div>
        </div>
        <div class="qty-stepper">
          <button class="qty-btn" onclick="handleUpdateCartQty('${prod._id}', ${item.quantity - 1})">-</button>
          <span class="qty-val">${item.quantity}</span>
          <button class="qty-btn" onclick="handleUpdateCartQty('${prod._id}', ${item.quantity + 1})">+</button>
        </div>
      </div>
    `;
  });

  const tip = cartData.deliveryTip || 0;
  const tipOptionsHTML = `
    <div class="tip-selector">
      <div class="tip-title">⚡ Delivery Partner Tip</div>
      <div class="tip-options">
        <button class="tip-btn ${tip === 0 ? 'active' : ''}" onclick="handleSetTip(0)">None</button>
        <button class="tip-btn ${tip === 10 ? 'active' : ''}" onclick="handleSetTip(10)">₹10</button>
        <button class="tip-btn ${tip === 20 ? 'active' : ''}" onclick="handleSetTip(20)">₹20</button>
        <button class="tip-btn ${tip === 50 ? 'active' : ''}" onclick="handleSetTip(50)">₹50</button>
      </div>
    </div>
  `;

  const billHTML = `
    <div class="bill-details">
      <div class="bill-row"><span>Item Total</span><span>₹${cartData.subtotal}</span></div>
      <div class="bill-row"><span>Delivery Fee</span><span>${cartData.deliveryFee === 0 ? '<span style="color: green; font-weight:700;">FREE</span>' : `₹${cartData.deliveryFee}`}</span></div>
      ${tip > 0 ? `<div class="bill-row"><span>Delivery Tip</span><span>₹${tip}</span></div>` : ''}
      <div class="bill-row total"><span>Grand Total</span><span>₹${cartData.grandTotal}</span></div>
    </div>
  `;

  cartBody.innerHTML = itemsHTML + tipOptionsHTML + billHTML;
}

function openCartDrawer() {
  renderCartDrawerContents();
  cartOverlay.classList.add('open');
  cartDrawer.classList.add('open');
}

function closeCartDrawer() {
  cartOverlay.classList.remove('open');
  cartDrawer.classList.remove('open');
}

// ----------------------------------------------------
// 4. Address API & Checkout Operations
// ----------------------------------------------------
async function fetchAddresses() {
  try {
    const res = await fetch(`${API_BASE}/addresses`);
    const data = await res.json();
    if (data.success && data.data.length > 0) {
      addresses = data.data;
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      selectedAddressId = defaultAddr._id;
      document.getElementById('currentAddressLabel').textContent = `${defaultAddr.houseNo}, ${defaultAddr.street}`;
    }
  } catch (err) {
    console.error('Failed to fetch addresses:', err);
  }
}

function openCheckoutModal() {
  renderAddressList();
  checkoutModal.classList.add('open');
}

function closeCheckoutModal() {
  checkoutModal.classList.remove('open');
}

function renderAddressList() {
  addressList.innerHTML = '';
  if (addresses.length === 0) {
    addressList.innerHTML = `<p style="font-size: 13px; color: #777;">No addresses saved yet. Please add one below.</p>`;
    return;
  }

  addresses.forEach(addr => {
    const card = document.createElement('div');
    card.style.cssText = `
      padding: 12px;
      border: 2px solid ${selectedAddressId === addr._id ? '#0c831f' : '#e2e8f0'};
      background: ${selectedAddressId === addr._id ? '#f4fbf5' : '#ffffff'};
      border-radius: 8px;
      margin-bottom: 10px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    card.onclick = () => selectAddress(addr._id);

    card.innerHTML = `
      <div>
        <div style="font-weight: 700; font-size: 14px;">📍 ${addr.type} - ${addr.name} (${addr.phone})</div>
        <div style="font-size: 13px; color: #555; margin-top: 4px;">${addr.houseNo}, ${addr.street}, ${addr.city} - ${addr.pincode}</div>
      </div>
      <div>${selectedAddressId === addr._id ? '<i class="fa-solid fa-circle-check" style="color: #0c831f; font-size: 18px;"></i>' : ''}</div>
    `;

    addressList.appendChild(card);
  });
}

function selectAddress(id) {
  selectedAddressId = id;
  const addr = addresses.find(a => a._id === id);
  if (addr) {
    document.getElementById('currentAddressLabel').textContent = `${addr.houseNo}, ${addr.street}`;
  }
  renderAddressList();
}

async function createAddress() {
  const name = document.getElementById('addrName').value;
  const phone = document.getElementById('addrPhone').value;
  const houseNo = document.getElementById('addrHouse').value;
  const street = document.getElementById('addrStreet').value;
  const city = document.getElementById('addrCity').value;
  const pincode = document.getElementById('addrPincode').value;

  try {
    const res = await fetch(`${API_BASE}/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, houseNo, street, city, pincode, type: 'Home', isDefault: true })
    });
    const data = await res.json();
    if (data.success) {
      showToast('📍 New address saved!');
      newAddressForm.reset();
      await fetchAddresses();
      renderAddressList();
    }
  } catch (err) {
    showToast('❌ Failed to save address');
  }
}

// ----------------------------------------------------
// 5. Place Order & Live Tracker API Operations
// ----------------------------------------------------
async function handlePlaceOrder() {
  const selectedAddr = addresses.find(a => a._id === selectedAddressId) || (addresses.length > 0 ? addresses[0] : null);
  const paymentMethod = document.getElementById('paymentMethodSelect').value;

  try {
    btnConfirmOrder.disabled = true;
    btnConfirmOrder.innerHTML = '<span>Processing Order...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: selectedAddr, paymentMethod })
    });

    const data = await res.json();
    btnConfirmOrder.disabled = false;
    btnConfirmOrder.innerHTML = '<span>Confirm & Place Order</span> <i class="fa-solid fa-circle-check"></i>';

    if (data.success) {
      closeCheckoutModal();
      showToast('🎉 Order placed successfully!');
      await fetchCart();
      renderProducts(await getCurrentProductsState());
      openLiveTracker(data.data);
    } else {
      showToast(`❌ ${data.message}`);
    }
  } catch (err) {
    btnConfirmOrder.disabled = false;
    showToast('❌ Order placement failed');
  }
}

function openLiveTracker(order) {
  currentTrackingOrder = order;
  orderTrackerModal.classList.add('open');
  updateTrackerUI(order);

  // Poll order status every 4 seconds to reflect backend status updates!
  if (trackingInterval) clearInterval(trackingInterval);
  trackingInterval = setInterval(async () => {
    if (!currentTrackingOrder) return;
    try {
      const res = await fetch(`${API_BASE}/orders/${currentTrackingOrder._id}`);
      const data = await res.json();
      if (data.success) {
        currentTrackingOrder = data.data;
        updateTrackerUI(data.data);
      }
    } catch (err) {
      console.error('Error polling status:', err);
    }
  }, 4000);
}

function updateTrackerUI(order) {
  document.getElementById('trackerOrderId').textContent = `Order #${order.orderId}`;
  document.getElementById('trackerStatusText').textContent = order.status;
  document.getElementById('trackerEtaText').textContent = `Payment: ${order.paymentMethod} • Total: ₹${order.grandTotal}`;

  const steps = ['Order Placed', 'Packing', 'Out for Delivery', 'Delivered'];
  const currentIndex = steps.indexOf(order.status);

  const stepPlaced = document.getElementById('stepPlaced');
  const stepPacking = document.getElementById('stepPacking');
  const stepOutForDelivery = document.getElementById('stepOutForDelivery');
  const stepDelivered = document.getElementById('stepDelivered');

  const stepElements = [stepPlaced, stepPacking, stepOutForDelivery, stepDelivered];

  stepElements.forEach((el, index) => {
    el.className = 'timeline-step';
    if (index < currentIndex) {
      el.classList.add('completed');
    } else if (index === currentIndex) {
      el.classList.add('active');
    }
  });

  // Render items list inside tracker
  const trackerItemsList = document.getElementById('trackerItemsList');
  let itemsHTML = '<h4 style="font-size: 14px; margin-bottom: 10px;">Order Summary</h4>';
  order.items.forEach(i => {
    itemsHTML += `
      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
        <span>${i.title} (x${i.quantity})</span>
        <span style="font-weight: 700;">₹${i.price * i.quantity}</span>
      </div>
    `;
  });
  trackerItemsList.innerHTML = itemsHTML;
}

// ----------------------------------------------------
// 6. Orders List History API
// ----------------------------------------------------
async function openOrdersListModal() {
  ordersListModal.classList.add('open');
  allOrdersContainer.innerHTML = `<p style="text-align: center; color: #777;">Loading orders...</p>`;

  try {
    const res = await fetch(`${API_BASE}/orders`);
    const data = await res.json();
    if (data.success) {
      renderOrdersList(data.data);
    }
  } catch (err) {
    allOrdersContainer.innerHTML = `<p style="color: red;">Failed to load order history</p>`;
  }
}

function renderOrdersList(orders) {
  if (orders.length === 0) {
    allOrdersContainer.innerHTML = `<p style="text-align: center; padding: 20px; color: #666;">No past orders found.</p>`;
    return;
  }

  let html = '';
  orders.forEach(ord => {
    const dateStr = new Date(ord.createdAt).toLocaleString();
    html += `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 6px;">
          <span>#${ord.orderId}</span>
          <span style="color: #0c831f;">${ord.status}</span>
        </div>
        <div style="font-size: 12px; color: #666; margin-bottom: 8px;">${dateStr} • ${ord.items.length} Items</div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 16px; font-weight: 800;">₹${ord.grandTotal}</span>
          <button class="btn-nav" onclick="openLiveTrackerById('${ord._id}')" style="padding: 6px 12px; font-size: 13px;">Track Order</button>
        </div>
      </div>
    `;
  });
  allOrdersContainer.innerHTML = html;
}

async function openLiveTrackerById(orderId) {
  ordersListModal.classList.remove('open');
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}`);
    const data = await res.json();
    if (data.success) {
      openLiveTracker(data.data);
    }
  } catch (err) {
    showToast('❌ Error loading order details');
  }
}
