export function initObservers(){
    const productsSection = document.querySelector(".products-section");
    if (!productsSection) return;

    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    productsSection.classList.add("visible");
                    observer.unobserve(productsSection);
                }
            });
        },
        {
            threshold: 0.2
        }
    );

    observer.observe(productsSection);

    // Fade-in shop ad when it scrolls into view (toggle)
    const shopAd = document.querySelector('.shop-ad');
    if (shopAd) {
        const adObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    shopAd.classList.add('visible');
                } else {
                    shopAd.classList.remove('visible');
                }
            });
        }, { threshold: 0.15 });

        adObserver.observe(shopAd);
    }

    // Overlay hide on scroll (header helper)
    const overlay = document.querySelector('.hero-overlay');
    if (overlay) {
        let lastY = window.scrollY;
        window.addEventListener('scroll', () => {
            const currentY = window.scrollY;
            if (Math.abs(currentY - lastY) < 5) return;

            if (currentY > lastY && currentY > 30) {
                overlay.classList.add('hide-on-scroll');
                document.body.classList.add('scrolled');
            } else if (currentY < lastY) {
                overlay.classList.remove('hide-on-scroll');
                if (currentY <= 30) document.body.classList.remove('scrolled');
            }

            lastY = currentY;
        }, { passive: true });
    }

    // Product title and card animations on scroll
    const productTitles = document.querySelectorAll('.products-title');
    const productCards = document.querySelectorAll('.product-card');

    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.3 });

    productTitles.forEach(title => titleObserver.observe(title));

    // Card stagger observer: trigger animation when visible
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                // trigger animation by re-flowing the element
                entry.target.style.animation = 'none';
                setTimeout(() => {
                    entry.target.style.animation = '';
                }, 10);
            }
        });
    }, { threshold: 0.2 });

    productCards.forEach(card => cardObserver.observe(card));
}
