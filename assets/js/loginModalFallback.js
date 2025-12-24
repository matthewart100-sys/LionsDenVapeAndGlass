// Fallback: ensure login modal opens on all account icon clicks
(function() {
  function openModal() {
    if (typeof window.openPopup === 'function') window.openPopup();
  }
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.profile-icon-btn').forEach(btn => {
      btn.addEventListener('click', openModal);
    });
  });
})();
