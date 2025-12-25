// AMD-style profile dropdown toggle for both desktop and mobile
(function() {
  function closeAllDropdowns() {
    document.querySelectorAll('.profile-dropdown-wrapper.open').forEach(el => el.classList.remove('open'));
  }
  
  function openSigninCard() {
    const overlay = document.getElementById('signinCardOverlay');
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  function closeSigninCard() {
    const overlay = document.getElementById('signinCardOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    // Update dropdown based on authentication status
    updateDropdownMenu();
    
    document.querySelectorAll('.profile-icon-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const wrapper = btn.closest('.profile-dropdown-wrapper');
        if (wrapper.classList.contains('open')) {
          wrapper.classList.remove('open');
        } else {
          closeAllDropdowns();
          wrapper.classList.add('open');
        }
      });
    });

    // Close dropdown on outside click
    document.addEventListener('click', function(e) {
      closeAllDropdowns();
    });
    
    // Close dropdown on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeAllDropdowns();
        closeSigninCard();
      }
    });

    // Close sign-in card on close button click
    const closeBtn = document.querySelector('.signin-card-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeSigninCard();
      });
      // Also handle touch for mobile
      closeBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeSigninCard();
      });
    }

    // Close sign-in card when clicking overlay (outside the card)
    const overlay = document.getElementById('signinCardOverlay');
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
          e.preventDefault();
          e.stopPropagation();
          closeSigninCard();
        }
      });
      // Also handle touch for mobile
      overlay.addEventListener('touchend', function(e) {
        if (e.target === overlay) {
          e.preventDefault();
          e.stopPropagation();
          closeSigninCard();
        }
      });
    }
  });
  
  function updateDropdownMenu() {
    // Check if user is authenticated
    const isAuthenticated = window.authManager && window.authManager.isAuthenticated();
    const user = window.authManager && window.authManager.getUser();
    
    if (isAuthenticated && user) {
      // User is logged in - show authenticated menu
      document.querySelectorAll('.profile-dropdown-menu').forEach(menu => {
        menu.innerHTML = `
          <a href="pages/profile.html" class="profile-menu-item profile-view" role="menuitem" tabindex="0">
            <span>👤 View Profile</span>
          </a>
          <a href="#" class="profile-menu-item profile-settings" role="menuitem" tabindex="0">
            <span>⚙️ Settings</span>
          </a>
          <a href="#" class="profile-menu-item profile-orders" role="menuitem" tabindex="0">
            <span>📦 My Orders</span>
          </a>
          <hr style="margin: 4px 0; border: none; border-top: 1px solid #e0e0e0;">
          <a href="#" class="profile-menu-item profile-logout" role="menuitem" tabindex="0">
            <span>🚪 Logout</span>
          </a>
        `;
        
        // Add event listeners
        const settingsLink = menu.querySelector('.profile-settings');
        if (settingsLink) {
          settingsLink.addEventListener('click', function(e) {
            e.preventDefault();
            closeAllDropdowns();
            alert('Settings page coming soon!');
          });
        }
        
        const ordersLink = menu.querySelector('.profile-orders');
        if (ordersLink) {
          ordersLink.addEventListener('click', function(e) {
            e.preventDefault();
            closeAllDropdowns();
            alert('Order history coming soon!');
          });
        }
        
        const logoutLink = menu.querySelector('.profile-logout');
        if (logoutLink) {
          logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            closeAllDropdowns();
            handleLogout();
          });
        }
        
        const profileLink = menu.querySelector('.profile-view');
        if (profileLink) {
          profileLink.addEventListener('click', function(e) {
            closeAllDropdowns();
          });
        }
      });
    } else {
      // User is not logged in - show sign in menu
      document.querySelectorAll('.profile-dropdown-menu').forEach(menu => {
        menu.innerHTML = `
          <a href="#" class="profile-menu-item my-account-link" role="menuitem" tabindex="0">
            <span>🔐 Sign In</span>
          </a>
          <a href="pages/signup.html" class="profile-menu-item create-account-link" role="menuitem" tabindex="0">
            <span>✨ Create Account</span>
          </a>
        `;
        
        // Add event listeners
        const signInLink = menu.querySelector('.my-account-link');
        if (signInLink) {
          signInLink.addEventListener('click', function(e) {
            e.preventDefault();
            closeAllDropdowns();
            openSigninCard();
          });
        }
        
        const signUpLink = menu.querySelector('.create-account-link');
        if (signUpLink) {
          signUpLink.addEventListener('click', function(e) {
            e.preventDefault();
            closeAllDropdowns();
          });
        }
      });
    }
  }
  
  function handleLogout() {
    if (window.authManager) {
      window.authManager.clearUser();
    }
    window.location.href = 'index.html';
  }
  
  // Listen for auth changes and update menu
  window.addEventListener('storage', function(e) {
    if (e.key === 'currentUser') {
      updateDropdownMenu();
    }
  });
})();
