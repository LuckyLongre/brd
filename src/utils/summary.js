/**
 * summary.js - Step 3: Summary Generation Module
 */

export function generateSummary(facts, conflicts) {
    const selectedFactIds = conflicts
        .filter((c) => c.resolved && c.selectedFactId)
        .map((c) => c.selectedFactId);

    const selectedFacts = facts.filter((f) => selectedFactIds.includes(f.id));

    const conflictedFactIds = new Set();
    conflicts.forEach((c) => {
        conflictedFactIds.add(c.factA.id);
        conflictedFactIds.add(c.factB.id);
    });
    const nonConflictedFacts = facts.filter((f) => !conflictedFactIds.has(f.id));

    const allRelevantFacts = [...selectedFacts, ...nonConflictedFacts];

    return {
        keyDecisions: extractKeyDecisions(allRelevantFacts, conflicts),
        risks: extractRisks(allRelevantFacts, conflicts),
        requirements: extractRequirements(allRelevantFacts),
        stakeholders: extractStakeholders(allRelevantFacts),
    };
}

function getDecisionTitle(type) {
    const titles = {
        budget: 'Budget Allocation Decision',
        compliance: 'Compliance Approach',
        timeline: 'Timeline Decision',
        priority: 'Feature Priority',
        technology: 'Technology Choice',
    };
    return titles[type] || 'Key Decision';
}

function getRiskTitle(type) {
    const titles = {
        budget: 'Budget Constraint Risk',
        compliance: 'Compliance Risk',
        timeline: 'Schedule Risk',
        priority: 'Scope Risk',
        technology: 'Technical Risk',
    };
    return titles[type] || 'Project Risk';
}

function getRiskSeverity(content) {
    const lc = content.toLowerCase();
    if (lc.includes('critical') || lc.includes('breach') || lc.includes('violation') || lc.includes('crash')) {
        return 'High';
    } else if (lc.includes('risk') || lc.includes('worry') || lc.includes('exposure')) {
        return 'Medium';
    }
    return 'Low';
}

function getRequirementType(content) {
    const lc = content.toLowerCase();
    if (lc.includes('compliance') || lc.includes('hipaa') || lc.includes('pci') || lc.includes('legal')) {
        return 'Compliance';
    } else if (lc.includes('security') || lc.includes('audit') || lc.includes('encryption')) {
        return 'Security';
    } else if (lc.includes('feature') || lc.includes('ui') || lc.includes('dark mode')) {
        return 'Functional';
    }
    return 'Business';
}

function getRequirementPriority(content) {
    const lc = content.toLowerCase();
    if (lc.includes('must') || lc.includes('critical') || lc.includes('required') || lc.includes('non-negotiable')) {
        return 'High';
    } else if (lc.includes('should') || lc.includes('need')) {
        return 'Medium';
    }
    return 'Low';
}

function getResponsibility(role) {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('ceo') || roleLower.includes('executive')) return 'Strategic oversight and final decisions';
    if (roleLower.includes('cto') || roleLower.includes('tech')) return 'Technical architecture and implementation';
    if (roleLower.includes('cfo') || roleLower.includes('finance')) return 'Budget management and financial oversight';
    if (roleLower.includes('legal') || roleLower.includes('compliance')) return 'Legal compliance and risk management';
    if (roleLower.includes('marketing')) return 'Marketing strategy and launch coordination';
    if (roleLower.includes('operations')) return 'Operational planning and execution';
    if (roleLower.includes('dev') || roleLower.includes('engineer')) return 'Development and technical delivery';
    return 'Project contribution and collaboration';
}

function extractTitleFromContent(content) {
    const firstSentence = content.split(/[.!?]/)[0];
    if (firstSentence.length <= 60) return firstSentence;
    return firstSentence.substring(0, 57) + '...';
}

function extractKeyDecisions(facts, conflicts) {
    const decisions = [];
    let decisionId = 1;

    conflicts.forEach((conflict) => {
        if (conflict.resolved && conflict.selectedFactId) {
            const selectedFact = facts.find((f) => f.id === conflict.selectedFactId);
            if (selectedFact) {
                decisions.push({
                    id: `decision_${decisionId++}`,
                    title: getDecisionTitle(conflict.type),
                    description: selectedFact.content,
                    source: selectedFact.sourceLabel,
                    rationale: conflict.comment || `Resolved ${conflict.type} conflict`,
                });
            }
        }
    });

    const decisionKeywords = ['decided', 'final', 'locked', 'priority', 'must', 'will'];
    facts.forEach((fact) => {
        const hasDecision = decisionKeywords.some((kw) => fact.content.toLowerCase().includes(kw));
        if (hasDecision && decisions.length < 8) {
            decisions.push({
                id: `decision_${decisionId++}`,
                title: extractTitleFromContent(fact.content),
                description: fact.content,
                source: fact.sourceLabel,
            });
        }
    });

    return decisions.slice(0, 6);
}

function extractRisks(facts, conflicts) {
    const risks = [];
    let riskId = 1;

    conflicts.forEach((conflict) => {
        if (conflict.resolved) {
            const unselectedFact =
                conflict.selectedFactId === conflict.factA.id ? conflict.factB : conflict.factA;
            if (
                unselectedFact.content.toLowerCase().includes('risk') ||
                unselectedFact.content.toLowerCase().includes('breach') ||
                unselectedFact.content.toLowerCase().includes('legal') ||
                unselectedFact.content.toLowerCase().includes('crash') ||
                unselectedFact.content.toLowerCase().includes('vulnerability')
            ) {
                risks.push({
                    id: `risk_${riskId++}`,
                    title: getRiskTitle(conflict.type),
                    severity: getRiskSeverity(unselectedFact.content),
                    description: unselectedFact.content,
                    mitigation: conflict.comment || 'To be determined',
                });
            }
        }
    });

    const riskKeywords = ['risk', 'breach', 'crash', 'vulnerability', 'exposure', 'unstable'];
    facts.forEach((fact) => {
        const hasRisk = riskKeywords.some((kw) => fact.content.toLowerCase().includes(kw));
        if (hasRisk && risks.length < 8) {
            risks.push({
                id: `risk_${riskId++}`,
                title: extractTitleFromContent(fact.content),
                severity: getRiskSeverity(fact.content),
                description: fact.content,
                mitigation: 'Requires assessment and mitigation planning',
            });
        }
    });

    return risks.slice(0, 5);
}

function extractRequirements(facts) {
    const requirements = [];
    let reqId = 1;

    const reqKeywords = ['must', 'required', 'need', 'compliance', 'should', 'necessary'];
    facts.forEach((fact) => {
        const hasRequirement = reqKeywords.some((kw) => fact.content.toLowerCase().includes(kw));
        if (hasRequirement) {
            requirements.push({
                id: `req_${reqId++}`,
                type: getRequirementType(fact.content),
                description: fact.content,
                priority: getRequirementPriority(fact.content),
                source: fact.sourceLabel,
            });
        }
    });

    return requirements.slice(0, 8);
}

function extractStakeholders(facts) {
    const stakeholderMap = new Map();
    let stakeholderId = 1;

    facts.forEach((fact) => {
        if (fact.speaker) {
            const match = fact.speaker.match(/^([^(]+)(?:\(([^)]+)\))?/);
            if (match) {
                const name = match[1].trim();
                const role = match[2] || 'Team Member';
                if (!stakeholderMap.has(name)) {
                    stakeholderMap.set(name, {
                        id: `stakeholder_${stakeholderId++}`,
                        name,
                        role,
                        responsibility: getResponsibility(role),
                    });
                }
            }
        }
    });

    return Array.from(stakeholderMap.values()).slice(0, 8);
}
