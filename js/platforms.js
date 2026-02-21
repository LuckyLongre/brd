/**
 * platforms.js
 * Platform management module for handling platform connections and data sources
 */

const Platforms = {
    // Platform connection states
    connections: {
        gmail: false,
        whatsapp: false,
        slack: false,
        meetings: false,
        proposal: false
    },

    // Platform metadata
    platformData: [
        { id: 'gmail', name: 'Gmail', icon: '📧', color: '#DC2626' },
        { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: '#16A34A' },
        { id: 'slack', name: 'Slack', icon: '💼', color: '#2563EB' },
        { id: 'meetings', name: 'Meetings', icon: '🎤', color: '#EAB308' },
        { id: 'proposal', name: 'Proposal', icon: '📄', color: '#6B7280' }
    ],

    /**
     * Connect a platform
     * @param {string} platformId - Platform ID
     */
    connect(platformId) {
        this.connections[platformId] = true;
        this.saveConnections();
    },

    /**
     * Disconnect a platform
     * @param {string} platformId - Platform ID
     */
    disconnect(platformId) {
        this.connections[platformId] = false;
        this.saveConnections();
    },

    /**
     * Toggle platform connection
     * @param {string} platformId - Platform ID
     */
    toggle(platformId) {
        this.connections[platformId] = !this.connections[platformId];
        this.saveConnections();
    },

    /**
     * Check if platform is connected
     * @param {string} platformId - Platform ID
     * @returns {boolean}
     */
    isConnected(platformId) {
        return this.connections[platformId] || false;
    },

    /**
     * Save connections to storage
     */
    saveConnections() {
        Storage.set('platform_connections', this.connections);
    },

    /**
     * Load connections from storage
     */
    loadConnections() {
        const saved = Storage.get('platform_connections');
        if (saved) {
            this.connections = { ...this.connections, ...saved };
        }
    },

    /**
     * Get platform by ID
     * @param {string} platformId - Platform ID
     * @returns {object|null}
     */
    getPlatform(platformId) {
        return this.platformData.find(p => p.id === platformId) || null;
    },

    /**
     * Get all platforms
     * @returns {array}
     */
    getAllPlatforms() {
        return this.platformData;
    },

    /**
     * Get connected platforms
     * @returns {array}
     */
    getConnectedPlatforms() {
        return this.platformData.filter(p => this.connections[p.id]);
    },

    /**
     * Get platform color
     * @param {string} platformId - Platform ID
     * @returns {string}
     */
    getPlatformColor(platformId) {
        const platform = this.getPlatform(platformId);
        return platform ? platform.color : '#6B7280';
    },

    /**
     * Get platform icon
     * @param {string} platformId - Platform ID
     * @returns {string}
     */
    getPlatformIcon(platformId) {
        const platform = this.getPlatform(platformId);
        return platform ? platform.icon : '📁';
    }
};

// Initialize
Platforms.loadConnections();

// Make Platforms available globally
if (typeof window !== 'undefined') {
    window.Platforms = Platforms;
}
