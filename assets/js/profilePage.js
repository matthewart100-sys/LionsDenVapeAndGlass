// Profile page route protection and user display
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    // Wait for authManager to be available (auth.js might still be loading)
    waitForAuthManager(function() {
      checkAuthenticationAndLoadProfile();
      setupLogout();
    });
  });
  
  function waitForAuthManager(callback, attempts = 0) {
    if (window.authManager) {
      callback();
    } else if (attempts < 50) {
      // Try again after 50ms
      setTimeout(() => waitForAuthManager(callback, attempts + 1), 50);
    } else {
      // Timeout - authManager never loaded
      console.error('authManager failed to load');
      showError('Authentication system failed to load.');
    }
  }
  
  function checkAuthenticationAndLoadProfile() {
    // Check if user is authenticated in localStorage
    const user = window.authManager?.getUser();
    
    if (!user) {
      // No authenticated user - redirect to homepage
      showError('Please log in to access your profile.');
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 2000);
      return;
    }
    
    // User is authenticated - display profile
    displayUserProfile(user);
  }
  
  function displayUserProfile(user) {
    const profileContent = document.getElementById('profileContent');
    const loadingText = document.getElementById('loadingText');
    
    // Populate user data
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userFullName').textContent = `${user.first_name} ${user.last_name}`;
    
    // Hide loading text
    loadingText.style.display = 'none';
    
    // Show profile content
    profileContent.style.display = 'block';
  }
  
  function showError(message) {
    const errorContent = document.getElementById('errorContent');
    const errorMessage = document.getElementById('errorMessage');
    const profileContent = document.getElementById('profileContent');
    
    errorMessage.textContent = message;
    errorContent.style.display = 'block';
    profileContent.style.display = 'none';
  }
  
  function setupLogout() {
    const logoutButtons = document.querySelectorAll('#logoutBtn, #logoutBtnProfile');
    
    logoutButtons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        handleLogout();
      });
    });
  }
  
  async function handleLogout() {
    try {
      // Clear user from localStorage
      if (window.authManager) {
        window.authManager.clearUser();
      }
      
      // Redirect to home
      window.location.href = '../index.html';
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if error
      window.location.href = '../index.html';
    }
  }
  
  // Setup button handlers
  document.addEventListener('DOMContentLoaded', function() {
    const editProfileBtn = document.getElementById('editProfileBtn');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const viewOrdersBtn = document.getElementById('viewOrdersBtn');
    
    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', function() {
        alert('Edit profile functionality coming soon!');
      });
    }
    
    if (changePasswordBtn) {
      changePasswordBtn.addEventListener('click', function() {
        alert('Change password functionality coming soon!');
      });
    }
    
    if (viewOrdersBtn) {
      viewOrdersBtn.addEventListener('click', function() {
        alert('Order history coming soon!');
      });
    }
  });
})();
