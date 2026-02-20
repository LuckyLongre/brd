/**
 * main.js
 * Application initialization and global setup
 */

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth
    if (typeof Auth !== 'undefined') {
        Auth.init();
    }

    // Add responsive handlers
    handleResponsive();
    window.addEventListener('resize', handleResponsive);
});

/**
 * Handle responsive behavior
 */
function handleResponsive() {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    // Add classes to body for responsive styling
    document.body.classList.toggle('mobile', isMobile);
    document.body.classList.toggle('tablet', isTablet);
    document.body.classList.toggle('desktop', window.innerWidth >= 1024);
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// Prevent localStorage quota exceeded errors
window.addEventListener('storage', function(e) {
    if (e.key === null) {
        // Storage was cleared
        console.log('LocalStorage was cleared');
    }
});
