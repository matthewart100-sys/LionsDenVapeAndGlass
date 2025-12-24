// AMD-style profile dropdown toggle for both desktop and mobile
(function() {
  function closeAllDropdowns() {
    document.querySelectorAll('.profile-dropdown-wrapper.open').forEach(el => el.classList.remove('open'));
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
        window.location.href = 'signup.html';
      });
    });

    // Close dropdown on outside click
    document.addEventListener('click', function(e) {
      closeAllDropdowns();
    });
    // Close dropdown on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeAllDropdowns();
    });
  });
})();
