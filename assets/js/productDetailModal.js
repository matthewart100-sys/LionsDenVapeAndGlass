// Product Detail Modal Handler
(function() {
  const API_BASE = 'http://localhost:5000';
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
          addCartBtn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            // Fetch product details to get name and category
            fetch(`http://localhost:5000/api/products/${productId}`)
              .then(res => res.json())
              .then(data => {
                if (data.success && window.CartManager) {
                  const product = data.product;
                  window.CartManager.addItem(
                    productId,
                    product.name,
                    product.price,
                    product.category
                  );
                }
              })
              .catch(err => console.error('Error adding to cart:', err));
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
