// Focus trap and ARIA for login modal, AMD-style UX
(function() {
  function trapFocus(modal) {
    const focusable = modal.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    modal.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });
  }
  document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('popupModal');
    if (modal) {
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'login-title');
      trapFocus(modal);
    }
    // Inline error feedback for login
    const form = modal.querySelector('form');
    if (form) {
      form.onsubmit = function(ev) {
        ev.preventDefault();
        const user = document.getElementById('Username').value.trim();
        const pass = document.getElementById('Password').value.trim();
        let error = '';
        if (!user || !pass) error = 'Please enter both username and password.';
        // You can add more validation or check here
        let errBox = modal.querySelector('.login-error');
        if (!errBox) {
          errBox = document.createElement('div');
          errBox.className = 'login-error';
          errBox.style.color = '#e84393';
          errBox.style.margin = '8px 0';
          form.insertBefore(errBox, form.firstChild);
        }
        errBox.textContent = error;
        if (!error && typeof submitLogin === 'function') submitLogin();
      };
    }
  });
})();
