/**
 * summary.js
 * Step 3: Summary Generation Module
 * Generates structured summary from resolved conflicts and non-conflicted facts
 */

const Summary = {
    /**
     * Generate structured summary from facts and resolved conflicts
     * @param {array} facts - All extracted facts
     * @param {array} conflicts - Resolved conflicts
     * @returns {object} Structured summary
     */
    generateSummary(facts, conflicts) {
        // Get selected facts from resolved conflicts
        const selectedFactIds = conflicts
            .filter(c => c.resolved && c.selectedFactId)
            .map(c => c.selectedFactId);
        
        const selectedFacts = facts.filter(f => selectedFactIds.includes(f.id));
        
        // Get non-conflicted facts (facts not involved in any conflict)
        const conflictedFactIds = new Set();
        conflicts.forEach(c => {
            conflictedFactIds.add(c.factA.id);
            conflictedFactIds.add(c.factB.id);
        });
        const nonConflictedFacts = facts.filter(f => !conflictedFactIds.has(f.id));
        
        // Combine selected and non-conflicted facts
        const allRelevantFacts = [...selectedFacts, ...nonConflictedFacts];

        return {
            keyDecisions: this.extractKeyDecisions(allRelevantFacts, conflicts),
            risks: this.extractRisks(allRelevantFacts, conflicts),
            requirements: this.extractRequirements(allRelevantFacts),
            stakeholders: this.extractStakeholders(allRelevantFacts)
        };
    },

    /**
     * Extract key decisions from facts
     * @param {array} facts - Relevant facts
     * @param {array} conflicts - Resolved conflicts
     * @returns {array} Key decisions
     */
    extractKeyDecisions(facts, conflicts) {
        const decisions = [];
        let decisionId = 1;

        // Decisions from resolved conflicts
        conflicts.forEach(conflict => {
            if (conflict.resolved && conflict.selectedFactId) {
                const selectedFact = facts.find(f => f.id === conflict.selectedFactId);
                if (selectedFact) {
                    decisions.push({
                        id: `decision_${decisionId++}`,
                        title: this.getDecisionTitle(conflict.type),
                        description: selectedFact.content,
                        source: selectedFact.sourceLabel,
                        rationale: conflict.comment || `Resolved ${conflict.type} conflict`
                    });
                }
            }
        });

        // Other key decisions from facts
        const decisionKeywords = ['decided', 'final', 'locked', 'priority', 'must', 'will'];
        facts.forEach(fact => {
            const hasDecision = decisionKeywords.some(kw => 
                fact.content.toLowerCase().includes(kw)
            );
            if (hasDecision && decisions.length < 8) {
                decisions.push({
                    id: `decision_${decisionId++}`,
                    title: this.extractTitleFromContent(fact.content),
                    description: fact.content,
                    source: fact.sourceLabel
                });
            }
        });

        return decisions.slice(0, 6); // Return top 6 decisions
    },

    /**
     * Extract risks from facts
     * @param {array} facts - Relevant facts
     * @param {array} conflicts - Resolved conflicts
     * @returns {array} Risks
     */
    extractRisks(facts, conflicts) {
        const risks = [];
        let riskId = 1;

        // Risks from unselected conflict options
        conflicts.forEach(conflict => {
            if (conflict.resolved) {
                const unselectedFact = conflict.selectedFactId === conflict.factA.id 
                    ? conflict.factB 
                    : conflict.factA;
                
                if (unselectedFact.content.toLowerCase().includes('risk') ||
                    unselectedFact.content.toLowerCase().includes('breach') ||
                    unselectedFact.content.toLowerCase().includes('legal') ||
                    unselectedFact.content.toLowerCase().includes('crash') ||
                    unselectedFact.content.toLowerCase().includes('vulnerability')) {
                    
                    risks.push({
                        id: `risk_${riskId++}`,
                        title: this.getRiskTitle(conflict.type),
                        severity: this.getRiskSeverity(unselectedFact.content),
                        description: unselectedFact.content,
                        mitigation: conflict.comment || 'To be determined'
                    });
                }
            }
        });

        // Additional risks from facts
        const riskKeywords = ['risk', 'breach', 'crash', 'vulnerability', 'exposure', 'unstable'];
        facts.forEach(fact => {
            const hasRisk = riskKeywords.some(kw => 
                fact.content.toLowerCase().includes(kw)
            );
            if (hasRisk && risks.length < 8) {
                risks.push({
                    id: `risk_${riskId++}`,
                    title: this.extractTitleFromContent(fact.content),
                    severity: this.getRiskSeverity(fact.content),
                    description: fact.content,
                    mitigation: 'Requires assessment and mitigation planning'
                });
            }
        });

        return risks.slice(0, 5); // Return top 5 risks
    },

    /**
     * Extract requirements from facts
     * @param {array} facts - Relevant facts
     * @returns {array} Requirements
     */
    extractRequirements(facts) {
        const requirements = [];
        let reqId = 1;

        const reqKeywords = ['must', 'required', 'need', 'compliance', 'should', 'necessary'];
        
        facts.forEach(fact => {
            const hasRequirement = reqKeywords.some(kw => 
                fact.content.toLowerCase().includes(kw)
            );
            if (hasRequirement) {
                requirements.push({
                    id: `req_${reqId++}`,
                    type: this.getRequirementType(fact.content),
                    description: fact.content,
                    priority: this.getRequirementPriority(fact.content),
                    source: fact.sourceLabel
                });
            }
        });

        return requirements.slice(0, 8); // Return top 8 requirements
    },

    /**
     * Extract stakeholders from facts
     * @param {array} facts - Relevant facts
     * @returns {array} Stakeholders
     */
    extractStakeholders(facts) {
        const stakeholderMap = new Map();
        let stakeholderId = 1;

        facts.forEach(fact => {
            if (fact.speaker) {
                // Extract name and role
                const match = fact.speaker.match(/^([^(]+)(?:\(([^)]+)\))?/);
                if (match) {
                    const name = match[1].trim();
                    const role = match[2] || 'Team Member';
                    
                    if (!stakeholderMap.has(name)) {
                        stakeholderMap.set(name, {
                            id: `stakeholder_${stakeholderId++}`,
                            name: name,
                            role: role,
                            responsibility: this.getResponsibility(role, fact.content)
                        });
                    }
                }
            }
        });

        return Array.from(stakeholderMap.values()).slice(0, 8);
    },

    /**
     * Get decision title based on conflict type
     * @param {string} type - Conflict type
     * @returns {string} Title
     */
    getDecisionTitle(type) {
        const titles = {
            'budget': 'Budget Allocation Decision',
            'compliance': 'Compliance Approach',
            'timeline': 'Timeline Decision',
            'priority': 'Feature Priority',
            'technology': 'Technology Choice'
        };
        return titles[type] || 'Key Decision';
    },

    /**
     * Get risk title based on conflict type
     * @param {string} type - Conflict type
     * @returns {string} Title
     */
    getRiskTitle(type) {
        const titles = {
            'budget': 'Budget Constraint Risk',
            'compliance': 'Compliance Risk',
            'timeline': 'Schedule Risk',
            'priority': 'Scope Risk',
            'technology': 'Technical Risk'
        };
        return titles[type] || 'Project Risk';
    },

    /**
     * Determine risk severity
     * @param {string} content - Fact content
     * @returns {string} Severity level
     */
    getRiskSeverity(content) {
        const lowerContent = content.toLowerCase();
        if (lowerContent.includes('critical') || lowerContent.includes('breach') || 
            lowerContent.includes('violation') || lowerContent.includes('crash')) {
            return 'High';
        } else if (lowerContent.includes('risk') || lowerContent.includes('worry') || 
                   lowerContent.includes('exposure')) {
            return 'Medium';
        }
        return 'Low';
    },

    /**
     * Get requirement type
     * @param {string} content - Fact content
     * @returns {string} Requirement type
     */
    getRequirementType(content) {
        const lowerContent = content.toLowerCase();
        if (lowerContent.includes('compliance') || lowerContent.includes('hipaa') || 
            lowerContent.includes('pci') || lowerContent.includes('legal')) {
            return 'Compliance';
        } else if (lowerContent.includes('security') || lowerContent.includes('audit') || 
                   lowerContent.includes('encryption')) {
            return 'Security';
        } else if (lowerContent.includes('feature') || lowerContent.includes('ui') || 
                   lowerContent.includes('dark mode')) {
            return 'Functional';
        }
        return 'Business';
    },

    /**
     * Get requirement priority
     * @param {string} content - Fact content
     * @returns {string} Priority level
     */
    getRequirementPriority(content) {
        const lowerContent = content.toLowerCase();
        if (lowerContent.includes('must') || lowerContent.includes('critical') || 
            lowerContent.includes('required') || lowerContent.includes('non-negotiable')) {
            return 'High';
        } else if (lowerContent.includes('should') || lowerContent.includes('need')) {
            return 'Medium';
        }
        return 'Low';
    },

    /**
     * Get responsibility based on role
     * @param {string} role - Role
     * @param {string} content - Fact content
     * @returns {string} Responsibility
     */
    getResponsibility(role, content) {
        const roleLower = role.toLowerCase();
        if (roleLower.includes('ceo') || roleLower.includes('executive')) {
            return 'Strategic oversight and final decisions';
        } else if (roleLower.includes('cto') || roleLower.includes('tech')) {
            return 'Technical architecture and implementation';
        } else if (roleLower.includes('cfo') || roleLower.includes('finance')) {
            return 'Budget management and financial oversight';
        } else if (roleLower.includes('legal') || roleLower.includes('compliance')) {
            return 'Legal compliance and risk management';
        } else if (roleLower.includes('marketing')) {
            return 'Marketing strategy and launch coordination';
        } else if (roleLower.includes('operations')) {
            return 'Operational planning and execution';
        } else if (roleLower.includes('dev') || roleLower.includes('engineer')) {
            return 'Development and technical delivery';
        }
        return 'Project contribution and collaboration';
    },

    /**
     * Extract short title from content
     * @param {string} content - Content text
     * @returns {string} Title
     */
    extractTitleFromContent(content) {
        // Take first sentence or first 50 chars
        const firstSentence = content.split(/[.!?]/)[0];
        if (firstSentence.length <= 60) {
            return firstSentence;
        }
        return firstSentence.substring(0, 57) + '...';
    }
};

// Make Summary available globally
if (typeof window !== 'undefined') {
    window.Summary = Summary;
}
