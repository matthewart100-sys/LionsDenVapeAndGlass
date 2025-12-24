export function initParallax(){
    const bgOverlay = document.querySelector('.background-overlay');
    if (bgOverlay) {
        const maxFade = 800; // px scrolled until fully black (adjustable)
        const setBgOpacity = () => {
            const y = window.scrollY || window.pageYOffset;
            const t = Math.min(Math.max(y / maxFade, 0), 1);
            bgOverlay.style.opacity = String(t);
        };

        setBgOpacity();
        window.addEventListener('scroll', setBgOpacity, { passive: true });
        window.addEventListener('resize', setBgOpacity);
    }

    // Parallax depth effect (RAF-smoothed)
    const parallaxElements = Array.from(document.querySelectorAll('[data-parallax]'));
    if (parallaxElements.length > 0) {
        let lastScroll = window.scrollY || window.pageYOffset;
        let ticking = false;

        // initialize per-element state
        parallaxElements.forEach(el => {
            el._parallax = {
                speed: parseFloat(el.getAttribute('data-parallax')) || 0.5,
                current: 0,
                target: 0
            };
            // ensure will-change for smoother transforms
            el.style.willChange = 'transform';
        });

        const onScroll = () => {
            lastScroll = window.scrollY || window.pageYOffset;
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        };

        const lerp = (a, b, n) => (1 - n) * a + n * b;

        function update() {
            parallaxElements.forEach(el => {
                const s = el._parallax.speed;
                const target = lastScroll * s * -1; // invert motion subtlety for depth feel
                el._parallax.target = target;
                el._parallax.current = lerp(el._parallax.current, el._parallax.target, 0.12);
                el.style.transform = `translateY(${el._parallax.current}px)`;
            });

            // keep the RAF loop alive only while there's movement
            if (parallaxElements.some(el => Math.abs(el._parallax.target - el._parallax.current) > 0.1)) {
                requestAnimationFrame(update);
            } else {
                ticking = false;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        // initial tick
        onScroll();
    }
}
