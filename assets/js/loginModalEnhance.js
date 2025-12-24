// Enhance login modal UX to match AMD site
(function() {
  function closeModal() {
    const modal = document.getElementById('popupModal');
    if (modal) modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
  function openModal() {
    const modal = document.getElementById('popupModal');
    if (modal) {
      modal.style.display = 'grid';
      document.body.classList.add('modal-open');
      // Focus first input
      setTimeout(() => {
        const input = modal.querySelector('input[type="text"],input[type="email"],input[type="password"]');
        if (input) input.focus();
      }, 100);
    }
  }
  window.openPopup = openModal;
  window.closePopup = closeModal;

  // Close modal on outside click
  document.addEventListener('mousedown', function(e) {
    const modal = document.getElementById('popupModal');
    if (modal && modal.style.display !== 'none') {
      const content = modal.querySelector('.login-modal-content');
      if (content && !content.contains(e.target)) {
        closeModal();
      }
    }
  });
  // Close modal on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });
  // Prevent form reload and provide instant feedback
  document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.login-modal-content form');
    if (form) {
      form.onsubmit = function(ev) {
        ev.preventDefault();
        if (typeof submitLogin === 'function') submitLogin();
      };
    }
  });
})();
