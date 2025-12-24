// Mobile hamburger menu logic
window.addEventListener('DOMContentLoaded', function() {
  var hamburger = document.querySelector('.hamburger');
  var slideout = document.querySelector('.mobile-slideout-menu');
  var closeBtn = document.querySelector('.close-menu');

  if (hamburger && slideout) {
    hamburger.addEventListener('click', function() {
      slideout.classList.add('open');
    });
  }
  if (closeBtn && slideout) {
    closeBtn.addEventListener('click', function() {
      slideout.classList.remove('open');
    });
  }
  // Optional: close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (slideout && slideout.classList.contains('open')) {
      if (!slideout.contains(e.target) && !hamburger.contains(e.target)) {
        slideout.classList.remove('open');
      }
    }
  });
});
