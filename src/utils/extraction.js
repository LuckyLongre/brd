/**
 * extraction.js
 * Step 1: Data Extraction Module
 */

export function extractFacts(userData) {
    const facts = [];
    let factId = 1;

    if (userData.data_vault.whatsapp) {
        userData.data_vault.whatsapp.forEach((thread) => {
            if (thread.is_relevant === true) {
                thread.messages.forEach((msg) => {
                    facts.push({
                        id: `fact_${factId++}`,
                        content: msg.text,
                        source: 'whatsapp',
                        sourceLabel: thread.name || 'WhatsApp',
                        date: new Date().toISOString(),
                        speaker: msg.sender,
                    });
                });
            }
        });
    }

    if (userData.data_vault.slack) {
        userData.data_vault.slack.forEach((channel) => {
            if (channel.is_relevant === true) {
                channel.messages.forEach((msg) => {
                    facts.push({
                        id: `fact_${factId++}`,
                        content: msg.text,
                        source: 'slack',
                        sourceLabel: channel.name || 'Slack',
                        date: new Date().toISOString(),
                        speaker: msg.sender,
                    });
                });
            }
        });
    }

    if (userData.data_vault.gmail) {
        userData.data_vault.gmail.forEach((email) => {
            if (email.is_relevant === true) {
                facts.push({
                    id: `fact_${factId++}`,
                    content: email.content,
                    source: 'gmail',
                    sourceLabel: email.subject || 'Email',
                    date: new Date().toISOString(),
                    speaker: email.from,
                });
            }
        });
    }

    if (userData.data_vault.meetings) {
        userData.data_vault.meetings.forEach((meeting) => {
            meeting.minutes.forEach((minute) => {
                facts.push({
                    id: `fact_${factId++}`,
                    content: minute.text,
                    source: 'meeting',
                    sourceLabel: meeting.title || 'Meeting',
                    date: meeting.date || new Date().toISOString(),
                    speaker: minute.speaker,
                });
            });
        });
    }

    if (userData.data_vault.proposal) {
        const proposal = userData.data_vault.proposal;
        facts.push({
            id: `fact_${factId++}`,
            content: `${proposal.vendor} proposal for ${proposal.project}: ${proposal.cost}, timeline: ${proposal.timeline}`,
            source: 'proposal',
            sourceLabel: 'Proposal Document',
            date: new Date().toISOString(),
            speaker: proposal.authorized_by,
        });
        if (proposal.mandatory_compliance) {
            facts.push({
                id: `fact_${factId++}`,
                content: proposal.mandatory_compliance,
                source: 'proposal',
                sourceLabel: 'Compliance Note',
                date: new Date().toISOString(),
                speaker: proposal.authorized_by,
            });
        }
    }

    return facts;
}

export function getSourceColor(source) {
    const colors = {
        whatsapp: '#16A34A',
        slack: '#2563EB',
        gmail: '#DC2626',
        meeting: '#EAB308',
        proposal: '#6B7280',
    };
    return colors[source] || '#6B7280';
}

export function getSourceIcon(source) {
    const icons = {
        whatsapp: '💬',
        slack: '💼',
        gmail: '📧',
        meeting: '🎤',
        proposal: '📄',
    };
    return icons[source] || '📝';
}

export function deleteFact(facts, factId) {
    return facts.filter((fact) => fact.id !== factId);
}

export function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return dateString;
    }
}
