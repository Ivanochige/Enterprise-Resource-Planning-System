/**
 * modern-pos.js
 * Complete POS functionality: Cart, Filtering, Payments, Checkout, Shortcuts & Persistence
 */
(function () {
  'use strict';

  // ================= STATE MANAGEMENT =================
  const state = {
    cart: [],
    taxRate: 0.0825,
    orderNumber: 1042,
    orderType: 'Dine-in',
    selectedPayment: null,
    activeCategory: 'all',
    isProcessing: false
  };

  // DOM Cache
  const DOM = {};

  // ================= INITIALIZATION =================
  function init() {
    cacheDOM();
    loadState();
    setupInitialData();
    bindEvents();
    renderProducts();
    renderCart();
    updateTotals();
  }

  function cacheDOM() {
    DOM.searchInput = document.querySelector('.search-input');
    DOM.categoryTabs = document.querySelector('.category-tabs');
    DOM.productGrid = document.querySelector('.product-grid');
    DOM.cartContainer = document.querySelector('.cart-items-container');
    DOM.cartMeta = document.querySelector('.cart-meta');
    DOM.orderTitle = document.querySelector('.cart-header h2');
    
    const summaryRows = document.querySelectorAll('.summary-row');
    DOM.subtotalEl = summaryRows[0]?.querySelector('span:last-child');
    DOM.taxEl = summaryRows[1]?.querySelector('span:last-child');
    DOM.discountEl = summaryRows[2]?.querySelector('span:last-child');
    DOM.totalEl = document.querySelector('.total-amount');
    
    DOM.paymentBtns = document.querySelectorAll('.payment-btn');
    DOM.checkoutBtn = document.querySelector('.checkout-btn');
    DOM.clearBtn = document.querySelector('.btn-icon[title="Clear Cart"]');
    DOM.holdBtn = document.querySelector('.btn-icon[title="Hold Order"]');
  }

  function setupInitialData() {
    // Assign categories to product cards for filtering
    const categoryMapping = {
      '1': 'beverages', '2': 'food', '3': 'food', '4': 'beverages',
      '5': 'desserts', '6': 'desserts', '7': 'beverages', '8': 'food'
    };
    document.querySelectorAll('.product-card').forEach(card => {
      card.dataset.category = categoryMapping[card.dataset.id] || 'all';
    });

    // Parse pre-filled HTML cart into JS state (if any)
    document.querySelectorAll('.cart-item').forEach(item => {
      const id = item.querySelector('.qty-btn.plus')?.dataset.id;
      const name = item.querySelector('h4')?.textContent;
      const priceText = item.querySelector('.item-price')?.textContent;
      const price = priceText ? parseFloat(priceText.replace('$', '')) : 0;
      const qtyText = item.querySelector('.qty-value')?.textContent;
      const qty = qtyText ? parseInt(qtyText) : 1;

      if (id && name && price > 0) {
        state.cart.push({ id, name, price, qty });
      }
    });

    // Clear HTML cart to let JS control rendering
    DOM.cartContainer.innerHTML = '';
    DOM.orderTitle.textContent = `Order #${state.orderNumber}`;
  }

  // ================= EVENT BINDING =================
  function bindEvents() {
    // Product clicks
    DOM.productGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (!card) return;
      addToCart(card.dataset.id, card.querySelector('.product-name').textContent, parseFloat(card.dataset.price));
    });

    // Cart quantity controls (Event Delegation)
    DOM.cartContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.qty-btn');
      if (!btn) return;
      const id = btn.dataset.id;
      const change = btn.classList.contains('plus') ? 1 : -1;
      updateQty(id, change);
    });

    // Category tabs
    DOM.categoryTabs.addEventListener('click', (e) => {
      if (!e.target.classList.contains('tab')) return;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      state.activeCategory = e.target.dataset.category;
      renderProducts();
    });

    // Search input (debounced)
    DOM.searchInput.addEventListener('input', debounce(renderProducts, 250));

    // Payment selection
    DOM.paymentBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.paymentBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedPayment = btn.textContent.trim().replace(/[^a-zA-Z]/g, '');
      });
    });

    // Action buttons
    DOM.checkoutBtn.addEventListener('click', handleCheckout);
    DOM.clearBtn.addEventListener('click', clearCart);
    DOM.holdBtn.addEventListener('click', holdOrder);

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
  }

  // ================= CORE LOGIC =================
  function addToCart(id, name, price) {
    const existing = state.cart.find(item => item.id === id);
    if (existing) {
      existing.qty++;
    } else {
      state.cart.push({ id, name, price, qty: 1 });
    }
    renderCart();
    updateTotals();
    saveState();
  }

  function updateQty(id, delta) {
    const item = state.cart.find(i => i.id === id);
    if (!item) return;
    
    item.qty += delta;
    if (item.qty <= 0) {
      state.cart = state.cart.filter(i => i.id !== id);
    }
    
    renderCart();
    updateTotals();
    saveState();
  }

  function renderProducts() {
    const searchTerm = DOM.searchInput.value.toLowerCase().trim();
    const products = document.querySelectorAll('.product-card');

    products.forEach(card => {
      const name = card.querySelector('.product-name').textContent.toLowerCase();
      const category = card.dataset.category;
      
      const matchesCategory = state.activeCategory === 'all' || category === state.activeCategory;
      const matchesSearch = !searchTerm || name.includes(searchTerm);

      card.style.display = (matchesCategory && matchesSearch) ? 'flex' : 'none';
    });
  }

  function renderCart() {
    DOM.cartContainer.innerHTML = '';
    
    if (state.cart.length === 0) {
      DOM.cartContainer.innerHTML = `
        <div style="text-align:center; padding:2rem; color:var(--text-light); opacity:0.8;">
          🛒 Cart is empty<br><small>Add items to get started</small>
        </div>`;
      return;
    }

    state.cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="cart-item-info">
          <h4>${escapeHTML(item.name)}</h4>
          <span class="item-price">${formatCurrency(item.price)}</span>
        </div>
        <div class="qty-control">
          <button class="qty-btn minus" data-id="${item.id}">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn plus" data-id="${item.id}">+</button>
        </div>
        <span class="item-total">${formatCurrency(item.price * item.qty)}</span>
      `;
      DOM.cartContainer.appendChild(div);
    });
  }

  function updateTotals() {
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * state.taxRate;
    const discount = 0; // Extend later for coupon/discount logic
    const total = subtotal + tax - discount;

    if (DOM.subtotalEl) DOM.subtotalEl.textContent = formatCurrency(subtotal);
    if (DOM.taxEl) DOM.taxEl.textContent = formatCurrency(tax);
    if (DOM.discountEl) DOM.discountEl.textContent = `-${formatCurrency(discount)}`;
    if (DOM.totalEl) DOM.totalEl.textContent = formatCurrency(total);

    const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
    if (DOM.cartMeta) DOM.cartMeta.textContent = `${totalItems} items • ${state.orderType}`;
  }

  function handleCheckout() {
    if (state.isProcessing) return;
    if (state.cart.length === 0) {
      showToast('⚠️ Cart is empty! Add items before checking out.', 'warning');
      return;
    }
    if (!state.selectedPayment) {
      showToast('⚠️ Please select a payment method.', 'warning');
      return;
    }

    state.isProcessing = true;
    DOM.checkoutBtn.textContent = '⏳ Processing...';
    DOM.checkoutBtn.disabled = true;

    // Simulate API call / Payment terminal
    setTimeout(() => {
      state.isProcessing = false;
      DOM.checkoutBtn.textContent = 'Complete Sale';
      DOM.checkoutBtn.disabled = false;
      
      showToast(`✅ Order #${state.orderNumber} completed!`, 'success');
      
      // Reset for next order
      clearCart(true);
      state.orderNumber++;
      DOM.orderTitle.textContent = `Order #${state.orderNumber}`;
      saveState();
    }, 1200);
  }

  function clearCart(silent = false) {
    if (state.cart.length === 0 && !silent) return;
    if (!silent && !confirm('Are you sure you want to clear the current cart?')) return;
    
    state.cart = [];
    renderCart();
    updateTotals();
    saveState();
    if (!silent) showToast('🗑️ Cart cleared.', 'info');
  }

  function holdOrder() {
    if (state.cart.length === 0) {
      showToast('⚠️ No items to hold.', 'warning');
      return;
    }
    showToast(`📦 Order #${state.orderNumber} held successfully.`, 'success');
    clearCart(true);
    state.orderNumber++;
    DOM.orderTitle.textContent = `Order #${state.orderNumber}`;
    saveState();
  }

  function handleKeyboard(e) {
    // Ignore if typing in search
    if (document.activeElement === DOM.searchInput) {
      if (e.key === 'Escape') DOM.searchInput.blur();
      return;
    }

    if (e.key === 'F2') { e.preventDefault(); DOM.searchInput.focus(); }
    if (e.key === 'F8') { e.preventDefault(); clearCart(); }
    if (e.key === 'Enter' && state.cart.length > 0) {
      e.preventDefault();
      handleCheckout();
    }
    // Number keys 1-3 for quick payment selection
    if (['1', '2', '3'].includes(e.key) && state.cart.length > 0) {
      const idx = parseInt(e.key) - 1;
      if (DOM.paymentBtns[idx]) DOM.paymentBtns[idx].click();
    }
  }

  // ================= UTILITIES =================
  function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  function showToast(message, type = 'info') {
    // Simple inline toast implementation
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; bottom: 20px; right: 20px; padding: 12px 20px;
      background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
      color: white; border-radius: 8px; font-weight: 500; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 9999; animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // LocalStorage Persistence
  function saveState() {
    localStorage.setItem('pos_cart', JSON.stringify(state.cart));
    localStorage.setItem('pos_order', state.orderNumber.toString());
  }

  function loadState() {
    try {
      const savedCart = localStorage.getItem('pos_cart');
      const savedOrder = localStorage.getItem('pos_order');
      if (savedCart) state.cart = JSON.parse(savedCart);
      if (savedOrder) state.orderNumber = parseInt(savedOrder);
    } catch (e) {
      console.warn('POS State load failed:', e);
    }
  }

  // ================= AUTO-INIT =================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
