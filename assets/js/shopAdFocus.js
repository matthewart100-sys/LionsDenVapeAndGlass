export function initShopAdFocus(selector = '.shop-ad'){
    const shopAdEl = document.querySelector(selector);
    if (!shopAdEl) return;

    const fg = shopAdEl.querySelector('.shop-ad__fg');
    const bg = shopAdEl.querySelector('.shop-ad__bg');
    let lastY = window.scrollY || window.pageYOffset;
    let focus = 0.5; // 0 -> background focused, 1 -> foreground focused
    let target = focus;

    const clamp = (v, a=0, b=1) => Math.min(Math.max(v,a),b);

    const updateFocusStyles = (f) => {
        const fgBlur = 8 - 8 * f; // 8 -> 0
        const bgBlur = 4 + 4 * f; // 4 -> 8
        const fgOpacity = 0.6 + 0.4 * f; // 0.6 -> 1
        const bgOpacity = 1 - 0.5 * f; // 1 -> 0.5

        if (fg) fg.style.filter = `blur(${fgBlur}px) contrast(${1 + 0.02 * f})`;
        if (bg) bg.style.filter = `blur(${bgBlur}px) brightness(${0.9 - 0.1 * f})`;
        if (fg) fg.style.opacity = String(fgOpacity);
        if (bg) bg.style.opacity = String(bgOpacity);
    };

    const rafLoop = () => {
        focus += (target - focus) * 0.12;
        updateFocusStyles(focus);
        requestAnimationFrame(rafLoop);
    };
    requestAnimationFrame(rafLoop);

    const onScroll = () => {
        const rect = shopAdEl.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        const y = window.scrollY || window.pageYOffset;
        const dirDown = y > lastY;

        const center = (rect.top + rect.bottom) / 2 - window.innerHeight / 2;
        const progress = clamp(1 - Math.abs(center) / (window.innerHeight * 0.8));

        if (inView) {
            if (dirDown) target = clamp(0.35 + 0.65 * progress);
            else target = clamp(0.65 - 0.65 * progress);
        } else {
            target = 0.5;
        }

        lastY = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
}
