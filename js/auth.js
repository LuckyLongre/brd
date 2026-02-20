/**
 * auth.js
 * Authentication module for handling login/logout
 * Uses dummy credentials for prototype demonstration
 */

const Auth = {
    // Dummy credentials for prototype
    DEMO_EMAIL: 'test@example.com',
    DEMO_PASSWORD: '123456',

    /**
     * Login user with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} Resolves on success, rejects on failure
     */
    login(email, password) {
        return new Promise((resolve, reject) => {
            // Simulate async authentication with 1.5 second delay
            setTimeout(() => {
                if (email === this.DEMO_EMAIL && password === this.DEMO_PASSWORD) {
                    // Create user session
                    const user = {
                        id: 'user_demo_123',
                        email: email,
                        name: 'Demo User',
                        createdAt: new Date().toISOString()
                    };

                    // Store auth data
                    Storage.set(Storage.KEYS.AUTH_USER, user);
                    Storage.set(Storage.KEYS.AUTH_TOKEN, 'demo_token_' + Date.now());
                    Storage.set(Storage.KEYS.CURRENT_USER_ID, user.id);

                    resolve(user);
                } else {
                    reject(new Error('Invalid email or password. Please use the demo credentials.'));
                }
            }, 1500);
        });
    },

    /**
     * Logout current user
     */
    logout() {
        Storage.remove(Storage.KEYS.AUTH_USER);
        Storage.remove(Storage.KEYS.AUTH_TOKEN);
        Storage.remove(Storage.KEYS.CURRENT_USER_ID);
        window.location.href = 'signin.html';
    },

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return Storage.has(Storage.KEYS.AUTH_TOKEN) && Storage.has(Storage.KEYS.AUTH_USER);
    },

    /**
     * Get current user
     * @returns {object|null} User object or null
     */
    getCurrentUser() {
        return Storage.get(Storage.KEYS.AUTH_USER);
    },

    /**
     * Protect route - redirect to signin if not authenticated
     */
    protectRoute() {
        if (!this.isAuthenticated()) {
            window.location.href = 'signin.html';
        }
    },

    /**
     * Initialize auth state on page load
     */
    init() {
        // If on a protected page, check authentication
        const protectedPages = [
            'user-dashboard.html',
            'new-project.html',
            'project-dashboard.html'
        ];
        
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage)) {
            this.protectRoute();
        }
    }
};

// Make Auth available globally
if (typeof window !== 'undefined') {
    window.Auth = Auth;
}
