/**
 * ui.js
 * UI utility functions for modals, loaders, and interactive elements
 */

const UI = {
    /**
     * Show loading modal
     * @param {string} message - Loading message
     */
    showLoader(message = 'Processing...') {
        const existing = document.getElementById('globalLoader');
        if (existing) existing.remove();

        const loader = document.createElement('div');
        loader.id = 'globalLoader';
        loader.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        loader.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm p-8 max-w-sm w-full mx-4">
                <div class="flex flex-col items-center">
                    <div class="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-4" style="border-color: #2563EB; border-top-color: transparent;"></div>
                    <p class="text-lg font-medium" style="color: #111827;">${message}</p>
                </div>
            </div>
        `;
        document.body.appendChild(loader);
    },

    /**
     * Hide loading modal
     */
    hideLoader() {
        const loader = document.getElementById('globalLoader');
        if (loader) loader.remove();
    },

    /**
     * Show confirmation modal
     * @param {string} title - Modal title
     * @param {string} message - Modal message
     * @param {function} onConfirm - Callback on confirm
     * @param {function} onCancel - Callback on cancel
     */
    showConfirmation(title, message, onConfirm, onCancel = null) {
        const existing = document.getElementById('confirmModal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'confirmModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm p-8 max-w-md w-full mx-4">
                <h3 class="text-xl font-bold mb-4" style="color: #111827;">${title}</h3>
                <p class="mb-6" style="color: #6B7280;">${message}</p>
                <div class="flex gap-3 justify-end">
                    <button id="confirmCancel" class="px-6 py-2 rounded-lg border font-medium" style="border-color: #E5E7EB; color: #6B7280;">
                        Cancel
                    </button>
                    <button id="confirmOk" class="px-6 py-2 rounded-lg text-white font-medium" style="background-color: #2563EB;">
                        Confirm
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('confirmOk').onclick = () => {
            modal.remove();
            if (onConfirm) onConfirm();
        };

        document.getElementById('confirmCancel').onclick = () => {
            modal.remove();
            if (onCancel) onCancel();
        };
    },

    /**
     * Show error modal
     * @param {string} title - Error title
     * @param {string} message - Error message
     */
    showError(title, message) {
        const existing = document.getElementById('errorModal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'errorModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm p-8 max-w-sm w-full mx-4">
                <div class="flex flex-col items-center text-center">
                    <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4" style="background-color: #FEE2E2;">
                        <svg class="w-8 h-8" style="color: #DC2626;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-bold mb-2" style="color: #111827;">${title}</h3>
                    <p class="mb-6" style="color: #6B7280;">${message}</p>
                    <button onclick="this.closest('#errorModal').remove()" class="px-6 py-2 rounded-lg text-white font-medium" style="background-color: #2563EB;">
                        OK
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    /**
     * Show success modal
     * @param {string} title - Success title
     * @param {string} message - Success message
     */
    showSuccess(title, message) {
        const existing = document.getElementById('successModal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'successModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm p-8 max-w-sm w-full mx-4">
                <div class="flex flex-col items-center text-center">
                    <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4" style="background-color: #D1FAE5;">
                        <svg class="w-8 h-8" style="color: #16A34A;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-bold mb-2" style="color: #111827;">${title}</h3>
                    <p class="mb-6" style="color: #6B7280;">${message}</p>
                    <button onclick="this.closest('#successModal').remove()" class="px-6 py-2 rounded-lg text-white font-medium" style="background-color: #2563EB;">
                        OK
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    /**
     * Format date for display
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    /**
     * Truncate text
     * @param {string} text - Text to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} Truncated text
     */
    truncate(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    /**
     * Escape HTML
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Make UI available globally
if (typeof window !== 'undefined') {
    window.UI = UI;
}
