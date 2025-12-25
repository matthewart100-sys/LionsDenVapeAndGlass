/**
 * Auto-Reload Script for Development
 * Add this to your browser console to enable auto-reload on file changes
 * 
 * Usage:
 * 1. Open browser DevTools (F12)
 * 2. Go to Console tab
 * 3. Paste this script and press Enter
 * 4. Changes will auto-reload every 1 second
 */

(function() {
    console.log('🔄 Auto-Reload enabled! Changes will reload automatically...');
    
    let lastContent = document.documentElement.innerHTML;
    let checkInterval = 1000; // Check every 1 second
    
    setInterval(() => {
        fetch(window.location.href, { 
            cache: 'no-store',
            headers: { 'Pragma': 'no-cache' }
        })
        .then(response => response.text())
        .then(newContent => {
            // Remove timestamp-based markers before comparison
            const oldMarker = lastContent.match(/<!--\s*\d+\s*-->/);
            const newMarker = newContent.match(/<!--\s*\d+\s*-->/);
            
            const oldClean = lastContent.replace(/<!--\s*\d+\s*-->/g, '');
            const newClean = newContent.replace(/<!--\s*\d+\s*-->/g, '');
            
            if (oldClean !== newClean) {
                console.log('✅ Changes detected! Reloading page...');
                lastContent = newContent;
                setTimeout(() => location.reload(), 300);
            }
        })
        .catch(error => console.log('⚠️ Check failed:', error.message));
    }, checkInterval);
    
    console.log('💡 Tip: Disable with F5 or close DevTools');
})();
