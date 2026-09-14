// Admin Control Center JS
const API_BASE = '/api';

let categoriesList = [];

document.addEventListener('DOMContentLoaded', () => {
  initAdmin();
});

async function initAdmin() {
  await fetchStats();
  await loadCategoriesDropdown();
  await fetchAdminProducts();
  await fetchAdminCategories();
  await fetchAdminOrders();
  setupAdminForms();
}

function showToast(msg) {
  const toastContainer = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-gear"></i> <span>${msg}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('panelProducts').style.display = 'none';
  document.getElementById('panelCategories').style.display = 'none';
  document.getElementById('panelOrders').style.display = 'none';

  if (tabName === 'products') {
    document.getElementById('tabProductsBtn').classList.add('active');
    document.getElementById('panelProducts').style.display = 'block';
    fetchAdminProducts();
  } else if (tabName === 'categories') {
    document.getElementById('tabCategoriesBtn').classList.add('active');
    document.getElementById('panelCategories').style.display = 'block';
    fetchAdminCategories();
  } else if (tabName === 'orders') {
    document.getElementById('tabOrdersBtn').classList.add('active');
    document.getElementById('panelOrders').style.display = 'block';
    fetchAdminOrders();
  }
}

// ----------------------------------------------------
// 1. Dashboard Stats API
// ----------------------------------------------------
async function fetchStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    const data = await res.json();
    if (data.success) {
      document.getElementById('statRevenue').textContent = `₹${data.data.totalRevenue}`;
      document.getElementById('statOrders').textContent = data.data.totalOrders;
      document.getElementById('statProducts').textContent = data.data.totalProducts;
      document.getElementById('statOutOfStock').textContent = data.data.outOfStockProducts;
    }
  } catch (err) {
    console.error('Failed to fetch stats:', err);
  }
}

// ----------------------------------------------------
// 2. Categories Dropdown & Admin Operations
// ----------------------------------------------------
async function loadCategoriesDropdown() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    if (data.success) {
      categoriesList = data.data;
      const select = document.getElementById('prodCategorySelect');
      select.innerHTML = categoriesList.map(c => `<option value="${c.name}">${c.icon || ''} ${c.name}</option>`).join('');
    }
  } catch (err) {
    console.error('Failed to load categories dropdown:', err);
  }
}

async function fetchAdminCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    if (data.success) {
      renderCategoriesTable(data.data);
    }
  } catch (err) {
    console.error('Failed to load categories table:', err);
  }
}

function renderCategoriesTable(categories) {
  const tbody = document.getElementById('categoriesTableBody');
  tbody.innerHTML = categories.map(cat => `
    <tr>
      <td style="font-size: 20px;">${cat.icon || '🛒'}</td>
      <td style="font-weight: 700;">${cat.name}</td>
      <td><code>${cat.slug}</code></td>
      <td>
        <button class="btn-action btn-delete" onclick="deleteCategory('${cat._id}')"><i class="fa-solid fa-trash"></i> Delete</button>
      </td>
    </tr>
  `).join('');
}

async function deleteCategory(id) {
  if (!confirm('Are you sure you want to delete this category?')) return;
  try {
    const res = await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast('🗑️ Category deleted');
      fetchAdminCategories();
      loadCategoriesDropdown();
    }
  } catch (err) {
    showToast('❌ Failed to delete category');
  }
}

// ----------------------------------------------------
// 3. Products CRUD Admin Operations
// ----------------------------------------------------
async function fetchAdminProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    const data = await res.json();
    if (data.success) {
      renderProductsTable(data.data);
    }
  } catch (err) {
    console.error('Failed to load products table:', err);
  }
}

function renderProductsTable(products) {
  const tbody = document.getElementById('productsTableBody');
  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #888;">No products in catalog.</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(prod => `
    <tr>
      <td><img src="${prod.imageUrl}" alt="${prod.title}" style="width: 40px; height: 40px; object-fit: contain;"></td>
      <td style="font-weight: 700;">${prod.title} ${prod.isFeatured ? '⭐' : ''}</td>
      <td><span style="background: #eef2ff; color: #4f46e5; padding: 3px 8px; border-radius: 4px; font-weight: 600; font-size: 12px;">${prod.category}</span></td>
      <td><span style="font-weight: 800;">₹${prod.price}</span> <span style="font-size: 12px; color: #999; text-decoration: line-through;">₹${prod.mrp}</span></td>
      <td>${prod.unit}</td>
      <td><span style="font-weight: 700; color: ${prod.stock > 10 ? 'green' : (prod.stock > 0 ? 'orange' : 'red')};">${prod.stock}</span></td>
      <td>
        <button class="btn-action btn-edit" onclick="editProduct('${prod._id}')"><i class="fa-solid fa-pen"></i> Edit</button>
        <button class="btn-action btn-delete" onclick="deleteProduct('${prod._id}')"><i class="fa-solid fa-trash"></i> Delete</button>
      </td>
    </tr>
  `).join('');
}

function openProductModal(prod = null) {
  const modal = document.getElementById('productModal');
  const title = document.getElementById('productModalTitle');
  const form = document.getElementById('productForm');

  if (prod) {
    title.textContent = 'Edit Product';
    document.getElementById('prodEditId').value = prod._id;
    document.getElementById('prodTitle').value = prod.title;
    document.getElementById('prodCategorySelect').value = prod.category;
    document.getElementById('prodUnit').value = prod.unit;
    document.getElementById('prodPrice').value = prod.price;
    document.getElementById('prodMrp').value = prod.mrp;
    document.getElementById('prodStock').value = prod.stock;
    document.getElementById('prodImage').value = prod.imageUrl;
    document.getElementById('prodDescription').value = prod.description || '';
    document.getElementById('prodFeatured').checked = prod.isFeatured || false;
  } else {
    title.textContent = 'Add New Product';
    form.reset();
    document.getElementById('prodEditId').value = '';
  }

  modal.classList.add('open');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('open');
}

async function editProduct(id) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    const data = await res.json();
    if (data.success) {
      openProductModal(data.data);
    }
  } catch (err) {
    showToast('❌ Error loading product data');
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast('🗑️ Product deleted successfully');
      fetchAdminProducts();
      fetchStats();
    }
  } catch (err) {
    showToast('❌ Failed to delete product');
  }
}

function setupAdminForms() {
  // Product Save Form Submit
  const productForm = document.getElementById('productForm');
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const editId = document.getElementById('prodEditId').value;
    const payload = {
      title: document.getElementById('prodTitle').value,
      category: document.getElementById('prodCategorySelect').value,
      unit: document.getElementById('prodUnit').value,
      price: Number(document.getElementById('prodPrice').value),
      mrp: Number(document.getElementById('prodMrp').value),
      stock: Number(document.getElementById('prodStock').value),
      imageUrl: document.getElementById('prodImage').value,
      description: document.getElementById('prodDescription').value,
      isFeatured: document.getElementById('prodFeatured').checked
    };

    try {
      let url = `${API_BASE}/products`;
      let method = 'POST';

      if (editId) {
        url = `${API_BASE}/products/${editId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        showToast(editId ? '✏️ Product updated!' : '✨ Product created!');
        closeProductModal();
        fetchAdminProducts();
        fetchStats();
      } else {
        showToast(`❌ ${data.message}`);
      }
    } catch (err) {
      showToast('❌ Save failed');
    }
  });

  // Category Add Form Submit
  const addCategoryForm = document.getElementById('addCategoryForm');
  addCategoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('catNameInput').value;
    const icon = document.getElementById('catIconInput').value;
    const description = document.getElementById('catDescInput').value;

    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, icon, description })
      });
      const data = await res.json();
      if (data.success) {
        showToast('📁 Category created!');
        addCategoryForm.reset();
        fetchAdminCategories();
        loadCategoriesDropdown();
      }
    } catch (err) {
      showToast('❌ Failed to add category');
    }
  });
}

// ----------------------------------------------------
// 4. Orders Admin Control
// ----------------------------------------------------
async function fetchAdminOrders() {
  try {
    const res = await fetch(`${API_BASE}/orders`);
    const data = await res.json();
    if (data.success) {
      renderOrdersTable(data.data);
    }
  } catch (err) {
    console.error('Failed to load orders:', err);
  }
}

function renderOrdersTable(orders) {
  const tbody = document.getElementById('ordersTableBody');
  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #888;">No orders placed yet.</td></tr>`;
    return;
  }

  const statuses = ['Order Placed', 'Packing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  tbody.innerHTML = orders.map(ord => `
    <tr>
      <td><span style="font-weight: 800; color: #0c831f;">#${ord.orderId}</span></td>
      <td>
        <div style="font-weight: 700;">${ord.deliveryAddress ? ord.deliveryAddress.name : 'Customer'}</div>
        <div style="font-size: 12px; color: #666;">${ord.deliveryAddress ? ord.deliveryAddress.phone : ''}</div>
      </td>
      <td>
        <div style="font-size: 13px;">${ord.items.map(i => `${i.title} (${i.quantity})`).join(', ')}</div>
      </td>
      <td><span style="font-weight: 800;">₹${ord.grandTotal}</span></td>
      <td>
        <select onchange="updateOrderStatus('${ord._id}', this.value)" style="padding: 6px 10px; border-radius: 6px; border: 1px solid #ccc; font-weight: 700;">
          ${statuses.map(s => `<option value="${s}" ${ord.status === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </td>
      <td>
        <button class="btn-action btn-delete" onclick="deleteOrder('${ord._id}')"><i class="fa-solid fa-trash"></i> Cancel/Delete</button>
      </td>
    </tr>
  `).join('');
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`⚡ Order status changed to ${newStatus}`);
      fetchStats();
    }
  } catch (err) {
    showToast('❌ Failed to update status');
  }
}

async function deleteOrder(orderId) {
  if (!confirm('Are you sure you want to cancel and delete this order?')) return;
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast('🗑️ Order removed');
      fetchAdminOrders();
      fetchStats();
    }
  } catch (err) {
    showToast('❌ Failed to delete order');
  }
}
