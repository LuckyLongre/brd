/**
 * extraction.js
 * Step 1: Data Extraction Module
 * Extracts relevant facts from user conversations (WhatsApp, Slack, Gmail, Meetings)
 */

const Extraction = {
    /**
     * Extract all relevant facts from user data
     * @param {object} userData - User data vault containing conversations
     * @returns {array} Array of extracted facts
     */
    extractFacts(userData) {
        const facts = [];
        let factId = 1;

        // Extract from WhatsApp (only is_relevant: true)
        if (userData.data_vault.whatsapp) {
            userData.data_vault.whatsapp.forEach(thread => {
                if (thread.is_relevant === true) {
                    thread.messages.forEach(msg => {
                        facts.push({
                            id: `fact_${factId++}`,
                            content: msg.text,
                            source: 'whatsapp',
                            sourceLabel: thread.name || 'WhatsApp',
                            date: new Date().toISOString(),
                            speaker: msg.sender
                        });
                    });
                }
            });
        }

        // Extract from Slack (only is_relevant: true)
        if (userData.data_vault.slack) {
            userData.data_vault.slack.forEach(channel => {
                if (channel.is_relevant === true) {
                    channel.messages.forEach(msg => {
                        facts.push({
                            id: `fact_${factId++}`,
                            content: msg.text,
                            source: 'slack',
                            sourceLabel: channel.name || 'Slack',
                            date: new Date().toISOString(),
                            speaker: msg.sender
                        });
                    });
                }
            });
        }

        // Extract from Gmail (only is_relevant: true)
        if (userData.data_vault.gmail) {
            userData.data_vault.gmail.forEach(email => {
                if (email.is_relevant === true) {
                    facts.push({
                        id: `fact_${factId++}`,
                        content: email.content,
                        source: 'gmail',
                        sourceLabel: email.subject || 'Email',
                        date: new Date().toISOString(),
                        speaker: email.from
                    });
                }
            });
        }

        // Extract from Meetings (all meetings are relevant)
        if (userData.data_vault.meetings) {
            userData.data_vault.meetings.forEach(meeting => {
                meeting.minutes.forEach(minute => {
                    facts.push({
                        id: `fact_${factId++}`,
                        content: minute.text,
                        source: 'meeting',
                        sourceLabel: meeting.title || 'Meeting',
                        date: meeting.date || new Date().toISOString(),
                        speaker: minute.speaker
                    });
                });
            });
        }

        // Extract from Proposal if exists
        if (userData.data_vault.proposal) {
            const proposal = userData.data_vault.proposal;
            facts.push({
                id: `fact_${factId++}`,
                content: `${proposal.vendor} proposal for ${proposal.project}: ${proposal.cost}, timeline: ${proposal.timeline}`,
                source: 'proposal',
                sourceLabel: 'Proposal Document',
                date: new Date().toISOString(),
                speaker: proposal.authorized_by
            });
            
            // Add compliance note
            if (proposal.mandatory_compliance) {
                facts.push({
                    id: `fact_${factId++}`,
                    content: proposal.mandatory_compliance,
                    source: 'proposal',
                    sourceLabel: 'Compliance Note',
                    date: new Date().toISOString(),
                    speaker: proposal.authorized_by
                });
            }
        }

        return facts;
    },

    /**
     * Get source badge color
     * @param {string} source - Source type
     * @returns {string} Tailwind color class
     */
    getSourceColor(source) {
        const colors = {
            'whatsapp': '#16A34A',
            'slack': '#2563EB',
            'gmail': '#DC2626',
            'meeting': '#EAB308',
            'proposal': '#6B7280'
        };
        return colors[source] || '#6B7280';
    },

    /**
     * Get source icon
     * @param {string} source - Source type
     * @returns {string} Icon HTML
     */
    getSourceIcon(source) {
        const icons = {
            'whatsapp': '💬',
            'slack': '💼',
            'gmail': '📧',
            'meeting': '🎤',
            'proposal': '📄'
        };
        return icons[source] || '📝';
    },

    /**
     * Delete a fact from extraction data
     * @param {array} facts - Array of facts
     * @param {string} factId - ID of fact to delete
     * @returns {array} Updated facts array
     */
    deleteFact(facts, factId) {
        return facts.filter(fact => fact.id !== factId);
    },

    /**
     * Format date for display
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    }
};

// Make Extraction available globally
if (typeof window !== 'undefined') {
    window.Extraction = Extraction;
}
