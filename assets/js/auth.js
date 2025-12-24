// Authentication handler for sign-in card
(function() {
  const API_BASE = 'http://localhost:5000';
  
  // Store user session in localStorage for frontend state
  const authManager = {
    setUser: function(user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.updateUI();
    },
    
    getUser: function() {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    },
    
    clearUser: function() {
      localStorage.removeItem('currentUser');
      this.updateUI();
    },
    
    isAuthenticated: function() {
      return this.getUser() !== null;
    },
    
    updateUI: function() {
      const user = this.getUser();
      // Update UI if user is logged in (you can add a display for this)
      if (user) {
        console.log('User logged in:', user.first_name, user.last_name);
      }
    }
  };
  
  // Route protection function
  const routeProtector = {
    /**
     * Protect a page - redirects to home if not authenticated
     * Usage: Call this on page load of protected pages
     */
    protectPage: function(redirectUrl = '../index.html') {
      if (!authManager.isAuthenticated()) {
        console.warn('Access denied: Not authenticated. Redirecting to login...');
        window.location.href = redirectUrl;
        return false;
      }
      return true;
    },
    
    /**
     * Check if user is authenticated
     */
    isUserAuthenticated: function() {
      return authManager.isAuthenticated();
    },
    
    /**
     * Get current user or null
     */
    getCurrentUser: function() {
      return authManager.getUser();
    }
  };
  
  document.addEventListener('DOMContentLoaded', function() {
    const signinForm = document.querySelector('.signin-form');
    
    if (signinForm) {
      signinForm.addEventListener('submit', handleLogin);
    }
  });
  
  async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value;
    const rememberMe = document.getElementById('signin-remember').checked;
    
    // Validation
    if (!email || !password) {
      showMessage('Please enter email and password', 'error');
      return;
    }
    
    const submitBtn = document.querySelector('.signin-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing in...';
    submitBtn.disabled = true;
    
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Store user in localStorage
        authManager.setUser(data.user);
        
        // Save preference
        if (rememberMe) {
          localStorage.setItem('rememberEmail', email);
        } else {
          localStorage.removeItem('rememberEmail');
        }
        
        showMessage(`Welcome, ${data.user.first_name}!`, 'success');
        
        // Close card after 1.5 seconds
        setTimeout(() => {
          const overlay = document.getElementById('signinCardOverlay');
          if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
          }
          // Clear form
          document.querySelector('.signin-form').reset();
          
          // Redirect to profile page
          setTimeout(() => {
            window.location.href = 'pages/profile.html';
          }, 500);
        }, 1500);
      } else {
        showMessage(data.error || 'Login failed', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showMessage('Network error. Make sure the backend server is running on port 5000.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }
  
  function showMessage(message, type) {
    // Create a temporary message element
    const messageEl = document.createElement('div');
    messageEl.className = `auth-message auth-message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 16px;
      background: ${type === 'success' ? '#4caf50' : '#f44336'};
      color: white;
      border-radius: 4px;
      z-index: 40000;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
      messageEl.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => messageEl.remove(), 300);
    }, 3000);
  }
  
  // Add animations to page
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Load remembered email if available
  window.addEventListener('load', function() {
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
      const emailInput = document.getElementById('signin-email');
      if (emailInput) {
        emailInput.value = rememberedEmail;
      }
      const rememberCheckbox = document.getElementById('signin-remember');
      if (rememberCheckbox) {
        rememberCheckbox.checked = true;
      }
    }
  });
  
  // Export for external use
  window.authManager = authManager;
  window.routeProtector = routeProtector;
})();
