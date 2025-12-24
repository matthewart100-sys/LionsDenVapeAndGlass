// Signup form handler
(function() {
  const API_BASE = 'http://localhost:5000';
  
  document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
      signupForm.addEventListener('submit', handleSignup);
    }
  });
  
  async function handleSignup(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      showError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }
    
    const submitBtn = document.querySelector('.signup-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;
    
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          email, 
          password, 
          first_name: firstName, 
          last_name: lastName 
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Store user in localStorage
        if (window.authManager) {
          window.authManager.setUser(data.user);
        }
        
        showSuccess('Account created successfully! Redirecting...');
        
        // Redirect to profile after 2 seconds
        setTimeout(() => {
          window.location.href = 'profile.html';
        }, 2000);
      } else {
        showError(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      showError('Network error. Make sure the backend server is running on port 5000.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }
  
  function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    errorEl.textContent = message;
    errorEl.classList.add('show');
    
    // Scroll to error
    errorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  function showSuccess(message) {
    const errorEl = document.getElementById('errorMessage');
    errorEl.textContent = message;
    errorEl.classList.add('show');
    errorEl.style.background = '#e8f5e9';
    errorEl.style.borderLeftColor = '#4caf50';
    errorEl.style.color = '#2e7d32';
  }
})();
