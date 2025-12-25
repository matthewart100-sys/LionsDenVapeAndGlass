// Product Detail Modal Handler
(function() {
  // Auto-detect API base URL - works on localhost and production
  const API_BASE = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : window.location.origin;
  let productIdCounter = 1; // Counter to assign product IDs to cards
  
  // Create product detail overlay
  function createProductDetailOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'productDetailOverlay';
    overlay.className = 'product-detail-overlay';
    overlay.innerHTML = '<div class="product-detail-modal" id="productDetailModal"></div>';
    document.body.appendChild(overlay);
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeProductDetail();
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeProductDetail();
      }
    });
  }
  
  function openProductDetail(productId) {
    const overlay = document.getElementById('productDetailOverlay');
    const modal = document.getElementById('productDetailModal');
    
    if (!overlay || !modal) return;
    
    // Show loading state
    modal.innerHTML = '<div style="padding: 32px; text-align: center;">Loading product details...</div>';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Fetch product HTML from backend
    fetch(`${API_BASE}/api/products/html/${productId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        modal.innerHTML = html;
        
        // Attach event listeners to buttons in the modal
        const backBtn = modal.querySelector('.btn-back-to-shop');
        if (backBtn) {
          backBtn.addEventListener('click', closeProductDetail);
        }
        
        const addCartBtn = modal.querySelector('.btn-add-cart');
        if (addCartBtn) {
          addCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = parseInt(this.dataset.productId);
            
            // Check if CartManager is available
            if (!window.CartManager) {
              console.error('CartManager not available');
              alert('Cart system is loading. Please try again.');
              return;
            }
            
            // Fetch product details to get name and category
            fetch(`http://localhost:5000/api/products/${productId}`)
              .then(res => res.json())
              .then(data => {
                if (data.success) {
                  const product = data.product;
                  window.CartManager.addItem(
                    productId,
                    product.name,
                    product.price,
                    product.category
                  );
                  
                  // Show cart confirmation panel
                  showCartConfirmation(
                    productId,
                    product.name,
                    product.price,
                    product.category
                  );
                }
              })
              .catch(err => {
                console.error('Error adding to cart:', err);
                alert('Error adding to cart. Please try again.');
              });
          });
        }
        
        const wishlistBtn = modal.querySelector('.btn-wishlist');
        if (wishlistBtn) {
          wishlistBtn.addEventListener('click', function() {
            alert(`Product #${productId} added to wishlist! (Feature coming soon)`);
          });
        }
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        modal.innerHTML = `<div class="product-detail-error"><p>Error loading product details: ${error.message}</p><button class="btn-back-to-shop" onclick="location.reload()">Reload</button></div>`;
      });
  }
  
  function closeProductDetail() {
    const overlay = document.getElementById('productDetailOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  function showCartConfirmation(productId, productName, productPrice, productCategory) {
    // Create slide-in panel if it doesn't exist
    let slidePanel = document.getElementById('cartConfirmationPanel');
    if (!slidePanel) {
      slidePanel = document.createElement('div');
      slidePanel.id = 'cartConfirmationPanel';
      slidePanel.className = 'cart-confirmation-panel';
      document.body.appendChild(slidePanel);
    }

    // Populate the panel with product info
    slidePanel.innerHTML = `
      <div class="cart-confirmation-content">
        <button class="close-panel-btn" aria-label="Close panel">✕</button>
        
        <div class="confirmation-header">
          <h2>✓ Added to Cart!</h2>
        </div>

        <div class="product-summary">
          <div class="summary-image">
            <img src="../assets/images/bong.png" alt="${productName}">
          </div>
          
          <div class="summary-details">
            <div class="summary-category">${productCategory.toUpperCase()}</div>
            <h3>${productName}</h3>
            <div class="summary-price">$${productPrice.toFixed(2)}</div>
            <div class="summary-status">✓ Item added to your cart</div>
          </div>
        </div>

        <div class="confirmation-divider"></div>

        <div class="cart-info">
          <div class="cart-items-count">
            <span class="info-label">Items in Cart:</span>
            <span class="info-value" id="cartItemsCount">1</span>
          </div>
          <div class="cart-subtotal">
            <span class="info-label">Subtotal:</span>
            <span class="info-value" id="cartSubtotal">$${productPrice.toFixed(2)}</span>
          </div>
        </div>

        <div class="confirmation-actions">
          <button class="btn-continue-shopping">← Continue Shopping</button>
          <button class="btn-view-cart">View Cart →</button>
        </div>

        <div class="quick-info">
          <p>🚚 Free shipping on orders over $100</p>
          <p>✓ Secure checkout</p>
          <p>📦 Same-day processing</p>
        </div>
      </div>
    `;

    // Show the panel with animation
    slidePanel.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Add event listeners
    const closeBtn = slidePanel.querySelector('.close-panel-btn');
    const continueBtn = slidePanel.querySelector('.btn-continue-shopping');
    const viewCartBtn = slidePanel.querySelector('.btn-view-cart');

    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        slidePanel.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    if (continueBtn) {
      continueBtn.addEventListener('click', function() {
        slidePanel.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    if (viewCartBtn) {
      viewCartBtn.addEventListener('click', function() {
        // Navigate to cart - works from index or pages
        const currentPath = window.location.pathname;
        if (currentPath.includes('/pages/')) {
          window.location.href = 'cart.html';
        } else {
          window.location.href = 'pages/cart.html';
        }
      });
    }

    // Update cart info
    updateConfirmationInfo();
  }

  function updateConfirmationInfo() {
    if (window.CartManager) {
      const cart = window.CartManager.getCart();
      const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      const cartSubtotal = window.CartManager.getTotal();

      const countEl = document.getElementById('cartItemsCount');
      const subtotalEl = document.getElementById('cartSubtotal');

      if (countEl) countEl.textContent = cartItemsCount;
      if (subtotalEl) subtotalEl.textContent = `$${cartSubtotal.toFixed(2)}`;
    }
  }
  
  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    // Create the overlay
    createProductDetailOverlay();
    
    // Assign IDs to product cards and add click handlers
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
      const productId = index + 1; // Product IDs start from 1
      card.style.cursor = 'pointer';
      card.setAttribute('data-product-id', productId);
      
      card.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openProductDetail(productId);
      });
      
      // Add hover effect
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
      });
    });
    
    // Make close function globally available
    window.closeProductDetail = closeProductDetail;
  });
})();
