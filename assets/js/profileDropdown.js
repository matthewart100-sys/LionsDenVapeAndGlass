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

    // Add navigation for Create Account links
    document.querySelectorAll('.create-account-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        closeAllDropdowns();
        window.location.href = 'pages/signup.html';
      });
    });

    // Add sign-in card opening for My Account links
    document.querySelectorAll('.my-account-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        closeAllDropdowns();
        openSigninCard();
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
})();
