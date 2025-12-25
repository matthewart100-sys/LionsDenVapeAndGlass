// Shopping Cart Management System
(function() {
  const CART_STORAGE_KEY = 'lionsDenCart';
  const TAX_RATE = 0.08; // 8% tax rate
  const FREE_SHIPPING_THRESHOLD = 100;

  // Cart object management
  const CartManager = {
    getCart: function() {
      const cart = localStorage.getItem(CART_STORAGE_KEY);
      return cart ? JSON.parse(cart) : [];
    },

    saveCart: function(cart) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      this.updateUI();
    },

    addItem: function(productId, productName, price, category) {
      const cart = this.getCart();
      const existingItem = cart.find(item => item.productId === productId);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({
          productId: productId,
          name: productName,
          price: price,
          category: category,
          quantity: 1,
          image: '../assets/images/bong.png'
        });
      }

      this.saveCart(cart);
      this.showNotification(`Added ${productName} to cart!`);
    },

    removeItem: function(productId) {
      let cart = this.getCart();
      cart = cart.filter(item => item.productId !== productId);
      this.saveCart(cart);
    },

    updateQuantity: function(productId, quantity) {
      const cart = this.getCart();
      const item = cart.find(item => item.productId === productId);
      
      if (item) {
        item.quantity = Math.max(1, quantity);
        this.saveCart(cart);
      }
    },

    clearCart: function() {
      localStorage.removeItem(CART_STORAGE_KEY);
      this.updateUI();
    },

    getTotal: function() {
      const cart = this.getCart();
      return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    updateUI: function() {
      this.renderCart();
      this.updateSummary();
    },

    renderCart: function() {
      const cartContainer = document.getElementById('cartItems');
      if (!cartContainer) return;

      const cart = this.getCart();

      if (cart.length === 0) {
        cartContainer.innerHTML = `
          <div class="empty-cart">
            <div class="empty-icon">🛍️</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet. Browse our products and add items to your cart!</p>
            <a href="../index.html" class="btn-continue-shopping">Continue Shopping</a>
          </div>
        `;
        document.getElementById('recommendedSection').style.display = 'block';
        return;
      }

      document.getElementById('recommendedSection').style.display = 'none';

      cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-product-id="${item.productId}">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-category">${item.category}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          </div>
          <div class="cart-item-quantity">
            <button class="qty-btn minus-btn" data-product-id="${item.productId}">−</button>
            <input type="number" class="qty-input" value="${item.quantity}" min="1" data-product-id="${item.productId}">
            <button class="qty-btn plus-btn" data-product-id="${item.productId}">+</button>
          </div>
          <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
          <button class="cart-item-remove" data-product-id="${item.productId}">Remove</button>
        </div>
      `).join('');

      // Attach event listeners
      cartContainer.querySelectorAll('.minus-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const productId = parseInt(e.target.dataset.productId);
          const cart = this.getCart();
          const item = cart.find(i => i.productId === productId);
          if (item && item.quantity > 1) {
            this.updateQuantity(productId, item.quantity - 1);
          }
        });
      });

      cartContainer.querySelectorAll('.plus-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const productId = parseInt(e.target.dataset.productId);
          const cart = this.getCart();
          const item = cart.find(i => i.productId === productId);
          if (item) {
            this.updateQuantity(productId, item.quantity + 1);
          }
        });
      });

      cartContainer.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', (e) => {
          const productId = parseInt(e.target.dataset.productId);
          const quantity = parseInt(e.target.value) || 1;
          this.updateQuantity(productId, quantity);
        });
      });

      cartContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const productId = parseInt(e.target.dataset.productId);
          const cart = this.getCart();
          const item = cart.find(i => i.productId === productId);
          if (confirm(`Remove ${item.name} from cart?`)) {
            this.removeItem(productId);
          }
        });
      });
    },

    updateSummary: function() {
      const subtotal = this.getTotal();
      const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9.99;
      const tax = subtotal * TAX_RATE;
      const total = subtotal + shipping + tax;

      const subtotalEl = document.getElementById('subtotal');
      const shippingEl = document.getElementById('shipping');
      const taxEl = document.getElementById('tax');
      const totalEl = document.getElementById('total');

      if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
      if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
      if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
      if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

      // Update checkout button state
      const checkoutBtn = document.getElementById('checkoutBtn');
      if (checkoutBtn) {
        checkoutBtn.disabled = this.getCart().length === 0;
      }
    },

    showNotification: function(message) {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      `;
      notification.textContent = message;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  };

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', function() {
    CartManager.updateUI();

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function() {
        const cart = CartManager.getCart();
        if (cart.length === 0) {
          alert('Your cart is empty!');
          return;
        }
        alert(`Checkout feature coming soon! Total: $${CartManager.getTotal().toFixed(2)}`);
      });
    }

    // Promo code
    const promoBtn = document.querySelector('.btn-apply-promo');
    const promoInput = document.getElementById('promoCode');
    if (promoBtn) {
      promoBtn.addEventListener('click', function() {
        const code = promoInput.value.trim().toUpperCase();
        if (code === 'SAVE10') {
          alert('Promo code "SAVE10" for 10% off coming soon!');
        } else if (code === 'SAVE20') {
          alert('Promo code "SAVE20" for 20% off coming soon!');
        } else if (code) {
          alert('Invalid promo code');
        } else {
          alert('Please enter a promo code');
        }
      });
    }
  });

  // Expose CartManager globally so product detail modal can use it
  window.CartManager = CartManager;
})();
