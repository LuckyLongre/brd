/**
 * conflicts.js - Step 2: Conflict Detection Module
 */

function extractAmounts(text) {
    const amounts = [];
    const patterns = [/\$(\d+)k/gi, /\$(\d+,\d+)/g, /\$(\d+)/g];
    patterns.forEach((pattern) => {
        const matches = text.matchAll(pattern);
        for (const match of matches) {
            let amount = match[1].replace(',', '');
            if (text.toLowerCase().includes('k')) {
                amount = parseFloat(amount) * 1000;
            } else {
                amount = parseFloat(amount);
            }
            amounts.push(amount);
        }
    });
    return amounts;
}

export function formatCurrency(amount) {
    if (amount >= 1000) {
        return '$' + amount / 1000 + 'k';
    }
    return '$' + amount.toLocaleString();
}

export function detectConflicts(facts) {
    const conflicts = [];
    const processedPairs = new Set();
    let conflictId = 1;

    const getPairKey = (id1, id2) => [id1, id2].sort().join('_');

    // Budget conflicts
    const budgetFacts = facts.filter(
        (f) =>
            f.content.toLowerCase().includes('$') ||
            f.content.toLowerCase().includes('budget') ||
            f.content.toLowerCase().includes('cost')
    );
    for (let i = 0; i < budgetFacts.length; i++) {
        for (let j = i + 1; j < budgetFacts.length; j++) {
            const pairKey = getPairKey(budgetFacts[i].id, budgetFacts[j].id);
            if (processedPairs.has(pairKey)) continue;
            const amounts1 = extractAmounts(budgetFacts[i].content);
            const amounts2 = extractAmounts(budgetFacts[j].content);
            if (amounts1.length > 0 && amounts2.length > 0) {
                if (Math.abs(amounts1[0] - amounts2[0]) > 5000) {
                    conflicts.push({
                        id: `conflict_${conflictId++}`,
                        type: 'budget',
                        factA: budgetFacts[i],
                        factB: budgetFacts[j],
                        resolved: false,
                        selectedFactId: null,
                        comment: '',
                        description: `Budget discrepancy: ${formatCurrency(amounts1[0])} vs ${formatCurrency(amounts2[0])}`,
                    });
                    processedPairs.add(pairKey);
                    break;
                }
            }
        }
    }

    // Audit/Security conflicts
    const auditFacts = facts.filter(
        (f) =>
            f.content.toLowerCase().includes('audit') ||
            f.content.toLowerCase().includes('security') ||
            f.content.toLowerCase().includes('compliance')
    );
    let auditConflictFound = false;
    for (let i = 0; i < auditFacts.length && !auditConflictFound; i++) {
        for (let j = i + 1; j < auditFacts.length && !auditConflictFound; j++) {
            const pairKey = getPairKey(auditFacts[i].id, auditFacts[j].id);
            if (processedPairs.has(pairKey)) continue;
            const hasSkip1 =
                auditFacts[i].content.toLowerCase().includes('skip') ||
                auditFacts[i].content.toLowerCase().includes('cut') ||
                auditFacts[i].content.toLowerCase().includes('no audit');
            const hasRequired2 =
                auditFacts[j].content.toLowerCase().includes('critical') ||
                auditFacts[j].content.toLowerCase().includes('required') ||
                auditFacts[j].content.toLowerCase().includes('must');
            const hasSkip2 =
                auditFacts[j].content.toLowerCase().includes('skip') ||
                auditFacts[j].content.toLowerCase().includes('cut') ||
                auditFacts[j].content.toLowerCase().includes('no audit');
            const hasRequired1 =
                auditFacts[i].content.toLowerCase().includes('critical') ||
                auditFacts[i].content.toLowerCase().includes('required') ||
                auditFacts[i].content.toLowerCase().includes('must');
            if ((hasSkip1 && hasRequired2) || (hasSkip2 && hasRequired1)) {
                conflicts.push({
                    id: `conflict_${conflictId++}`,
                    type: 'compliance',
                    factA: auditFacts[i],
                    factB: auditFacts[j],
                    resolved: false,
                    selectedFactId: null,
                    comment: '',
                    description: 'Security audit requirement conflict',
                });
                processedPairs.add(pairKey);
                auditConflictFound = true;
            }
        }
    }

    // Timeline conflicts
    const timelineFacts = facts.filter(
        (f) =>
            f.content.toLowerCase().includes('launch') ||
            f.content.toLowerCase().includes('deadline') ||
            f.content.toLowerCase().includes('friday') ||
            f.content.toLowerCase().includes('delay') ||
            f.content.toLowerCase().includes('refactor') ||
            f.content.toLowerCase().includes('unstable')
    );
    let timelineConflictFound = false;
    for (let i = 0; i < timelineFacts.length && !timelineConflictFound; i++) {
        for (let j = i + 1; j < timelineFacts.length && !timelineConflictFound; j++) {
            const pairKey = getPairKey(timelineFacts[i].id, timelineFacts[j].id);
            if (processedPairs.has(pairKey)) continue;
            const hasUrgent1 =
                timelineFacts[i].content.toLowerCase().includes('non-negotiable') ||
                timelineFacts[i].content.toLowerCase().includes('locked') ||
                timelineFacts[i].content.toLowerCase().includes('friday');
            const hasDelay2 =
                (timelineFacts[j].content.toLowerCase().includes('need') &&
                    timelineFacts[j].content.toLowerCase().includes('days')) ||
                timelineFacts[j].content.toLowerCase().includes('refactor') ||
                timelineFacts[j].content.toLowerCase().includes('unstable') ||
                timelineFacts[j].content.toLowerCase().includes('crash');
            if (hasUrgent1 && hasDelay2) {
                conflicts.push({
                    id: `conflict_${conflictId++}`,
                    type: 'timeline',
                    factA: timelineFacts[i],
                    factB: timelineFacts[j],
                    resolved: false,
                    selectedFactId: null,
                    comment: '',
                    description: 'Launch timeline vs technical readiness conflict',
                });
                processedPairs.add(pairKey);
                timelineConflictFound = true;
            }
        }
    }

    // Feature priority conflicts
    const featureFacts = facts.filter(
        (f) =>
            f.content.toLowerCase().includes('feature') ||
            f.content.toLowerCase().includes('dark mode') ||
            f.content.toLowerCase().includes('ui') ||
            f.content.toLowerCase().includes('hipaa') ||
            f.content.toLowerCase().includes('sprint')
    );
    let featureConflictFound = false;
    for (let i = 0; i < featureFacts.length && !featureConflictFound; i++) {
        for (let j = i + 1; j < featureFacts.length && !featureConflictFound; j++) {
            const pairKey = getPairKey(featureFacts[i].id, featureFacts[j].id);
            if (processedPairs.has(pairKey)) continue;
            const hasPriority1 =
                featureFacts[i].content.toLowerCase().includes('priority') ||
                featureFacts[i].content.toLowerCase().includes('dealbreaker') ||
                featureFacts[i].content.toLowerCase().includes('top');
            const hasSecondary2 =
                featureFacts[j].content.toLowerCase().includes('secondary') ||
                featureFacts[j].content.toLowerCase().includes('packed') ||
                featureFacts[j].content.toLowerCase().includes('capacity') ||
                featureFacts[j].content.toLowerCase().includes('locking');
            if (hasPriority1 && hasSecondary2) {
                conflicts.push({
                    id: `conflict_${conflictId++}`,
                    type: 'priority',
                    factA: featureFacts[i],
                    factB: featureFacts[j],
                    resolved: false,
                    selectedFactId: null,
                    comment: '',
                    description: 'Feature priority conflict',
                });
                processedPairs.add(pairKey);
                featureConflictFound = true;
            }
        }
    }

    // Technology choice conflicts
    const techFacts = facts.filter(
        (f) =>
            f.content.toLowerCase().includes('ffmpeg') ||
            f.content.toLowerCase().includes('google maps') ||
            f.content.toLowerCase().includes('openstreetmap') ||
            f.content.toLowerCase().includes('cve') ||
            f.content.toLowerCase().includes('vulnerability')
    );
    let techConflictFound = false;
    for (let i = 0; i < techFacts.length && !techConflictFound; i++) {
        for (let j = i + 1; j < techFacts.length && !techConflictFound; j++) {
            const pairKey = getPairKey(techFacts[i].id, techFacts[j].id);
            if (processedPairs.has(pairKey)) continue;
            const hasPerformance1 =
                techFacts[i].content.toLowerCase().includes('faster') ||
                techFacts[i].content.toLowerCase().includes('10x') ||
                techFacts[i].content.toLowerCase().includes('free');
            const hasSecurity2 =
                techFacts[j].content.toLowerCase().includes('cve') ||
                techFacts[j].content.toLowerCase().includes('breach') ||
                techFacts[j].content.toLowerCase().includes('vulnerability');
            if (hasPerformance1 && hasSecurity2) {
                conflicts.push({
                    id: `conflict_${conflictId++}`,
                    type: 'technology',
                    factA: techFacts[i],
                    factB: techFacts[j],
                    resolved: false,
                    selectedFactId: null,
                    comment: '',
                    description: 'Technology choice: Performance vs Security',
                });
                processedPairs.add(pairKey);
                techConflictFound = true;
            }
        }
    }

    return conflicts;
}

export function allResolved(conflicts) {
    return conflicts.every((c) => c.resolved === true);
}

export function getConflictTypeColor(type) {
    const colors = {
        budget: '#DC2626',
        compliance: '#EAB308',
        timeline: '#2563EB',
        priority: '#6B7280',
        technology: '#16A34A',
    };
    return colors[type] || '#6B7280';
}
