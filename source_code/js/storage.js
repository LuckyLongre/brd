/**
 * storage.js
 * LocalStorage wrapper for managing application data
 * Handles all localStorage operations with error handling
 */

const Storage = {
    /**
     * Get item from localStorage
     * @param {string} key - Storage key
     * @returns {any} Parsed value or null
     */
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error getting ${key} from storage:`, error);
            return null;
        }
    },

    /**
     * Set item in localStorage
     * @param {string} key - Storage key
     * @param {any} value - Value to store (will be JSON.stringify'd)
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting ${key} in storage:`, error);
            // Check if quota exceeded
            if (error.name === 'QuotaExceededError') {
                this.showQuotaExceededError();
            }
        }
    },

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing ${key} from storage:`, error);
        }
    },

    /**
     * Clear all localStorage
     */
    clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    },

    /**
     * Check if key exists in storage
     * @param {string} key - Storage key
     * @returns {boolean}
     */
    has(key) {
        return localStorage.getItem(key) !== null;
    },

    /**
     * Show quota exceeded error modal
     */
    showQuotaExceededError() {
        alert('Storage quota exceeded. Please clear some data or use a different browser.');
    },

    // Storage Keys
    KEYS: {
        AUTH_USER: 'auth_user',
        AUTH_TOKEN: 'auth_token',
        USER_PROJECTS: 'user_projects',
        PROJECT_PREFIX: 'project_',
        CURRENT_USER_ID: 'current_user_id'
    }
};

// Make Storage available globally
if (typeof window !== 'undefined') {
    window.Storage = Storage;
}
