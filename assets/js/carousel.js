// Infinite horizontal carousel for all .carousel > .products-grid
// Horizontal carousel with arrows, 5 visible at a time
export function initCarousels() {
  document.querySelectorAll('.carousel').forEach(carousel => {
    const grid = carousel.querySelector('.products-grid');
    if (!grid) return;
    const left = carousel.querySelector('.carousel-arrow.left');
    const right = carousel.querySelector('.carousel-arrow.right');
    // Remove infinite scroll if present
    const clone = carousel.querySelector('.carousel-clone');
    if (clone) clone.remove();
    // Scroll by 1 card width per click
    function getCardWidth() {
      const card = grid.querySelector('.product-card');
      return card ? card.offsetWidth + 20 : 260 + 20; // 20px gap
    }
    // Always show arrows, and allow wrap-around
    left.style.display = 'block';
    right.style.display = 'block';
    // Remove any previous event listeners by using a flag
    if (!left._carouselHandler) {
      left.addEventListener('click', () => {
        const cardWidth = getCardWidth();
        if (grid.scrollLeft <= 0) {
          // Wrap to end
          grid.scrollLeft = grid.scrollWidth - grid.clientWidth;
        } else {
          grid.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        }
      });
      left._carouselHandler = true;
    }
    if (!right._carouselHandler) {
      right.addEventListener('click', () => {
        const cardWidth = getCardWidth();
        if (grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 1) {
          // Wrap to start
          grid.scrollLeft = 0;
        } else {
          grid.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      });
      right._carouselHandler = true;
    }
  });
}
