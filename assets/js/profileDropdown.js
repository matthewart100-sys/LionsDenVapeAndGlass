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

    // Add sign-in card opening for My Account links
    document.querySelectorAll('.my-account-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        closeAllDropdowns();
        if (window.authManager && window.authManager.isAuthenticated()) {
          // User is logged in, go to profile page
          window.location.href = 'pages/profile.html';
        } else {
          // User is not logged in, open sign-in card
          openSigninCard();
        }
      });
    });

    // Add navigation for Create Account links
    document.querySelectorAll('.create-account-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        closeAllDropdowns();
        window.location.href = 'pages/signup.html';
      });
    });

    // Close sign-in card
    const overlay = document.getElementById('signinCardOverlay');
    if (overlay) {
      const closeBtn = overlay.querySelector('.signin-card-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', closeSigninCard);
      }
      
      // Close when clicking outside the card
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
          closeSigninCard();
        }
      });
    }

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
  });
  
  function updateDropdownMenu() {
    // Check if user is authenticated
    const isAuthenticated = window.authManager && window.authManager.isAuthenticated();
    const user = window.authManager && window.authManager.getUser();
    
    if (isAuthenticated && user) {
      // User is logged in - update menu items
      document.querySelectorAll('.my-account-link').forEach(link => {
        link.textContent = `${user.first_name}'s Profile`;
      });
      
      document.querySelectorAll('.create-account-link').forEach(link => {
        link.textContent = 'Logout';
        link.classList.remove('create-account-link');
        link.classList.add('logout-link');
        link.addEventListener('click', function(e) {
          e.preventDefault();
          closeAllDropdowns();
          handleLogout();
        });
      });
    }
  }
  
  function handleLogout() {
    if (window.authManager) {
      window.authManager.clearUser();
    }
    window.location.href = 'index.html';
  }
})();
