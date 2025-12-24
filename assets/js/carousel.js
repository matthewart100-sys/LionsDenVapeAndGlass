// Horizontal carousel for all .carousel > .products-grid
// Carousel scrolls from beginning to end with no wrapping
export function initCarousels() {
  document.querySelectorAll('.carousel').forEach(carousel => {
    const grid = carousel.querySelector('.products-grid');
    if (!grid) return;
    const left = carousel.querySelector('.carousel-arrow.left');
    const right = carousel.querySelector('.carousel-arrow.right');
    
    // Get all cards
    const cards = Array.from(grid.querySelectorAll('.product-card'));
    if (cards.length === 0) return;
    
    function getCardWidth() {
      const card = grid.querySelector('.product-card');
      return card ? card.offsetWidth + 20 : 260 + 20;
    }
    
    // Start at scroll position 0 (beginning)
    grid.scrollLeft = 0;
    
    left.style.display = 'block';
    right.style.display = 'block';
    
    // Handle arrow clicks with scroll bounds
    if (!left._carouselHandler) {
      left.addEventListener('click', () => {
        const newScroll = Math.max(0, grid.scrollLeft - getCardWidth());
        grid.scrollTo({ left: newScroll, behavior: 'smooth' });
      });
      left._carouselHandler = true;
    }
    
    if (!right._carouselHandler) {
      right.addEventListener('click', () => {
        const maxScroll = grid.scrollWidth - grid.clientWidth;
        const newScroll = Math.min(maxScroll, grid.scrollLeft + getCardWidth());
        grid.scrollTo({ left: newScroll, behavior: 'smooth' });
      });
      right._carouselHandler = true;
    }
  });
}
