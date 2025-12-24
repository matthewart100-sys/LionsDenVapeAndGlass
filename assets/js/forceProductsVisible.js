// Ensure products-section is visible if JS fails or observer is not used
window.addEventListener('DOMContentLoaded', function() {
  var productsSection = document.querySelector('.products-section');
  if (productsSection && !productsSection.classList.contains('visible')) {
    productsSection.classList.add('visible');
  }
});
