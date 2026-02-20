/**
 * router.js
 * Route protection and navigation utilities
 */

const Router = {
    /**
     * Navigate to a page
     * @param {string} page - Page path
     */
    navigate(page) {
        window.location.href = page;
    },

    /**
     * Get URL parameter
     * @param {string} param - Parameter name
     * @returns {string|null} Parameter value
     */
    getParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    /**
     * Set URL parameter without reload
     * @param {string} param - Parameter name
     * @param {string} value - Parameter value
     */
    setParam(param, value) {
        const url = new URL(window.location);
        url.searchParams.set(param, value);
        window.history.pushState({}, '', url);
    },

    /**
     * Check if on mobile device
     * @returns {boolean} True if mobile
     */
    isMobile() {
        return window.innerWidth < 768;
    },

    /**
     * Check if on tablet device
     * @returns {boolean} True if tablet
     */
    isTablet() {
        return window.innerWidth >= 768 && window.innerWidth < 1024;
    },

    /**
     * Check if on desktop
     * @returns {boolean} True if desktop
     */
    isDesktop() {
        return window.innerWidth >= 1024;
    }
};

// Make Router available globally
if (typeof window !== 'undefined') {
    window.Router = Router;
}
