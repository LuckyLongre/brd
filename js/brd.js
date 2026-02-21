/**
 * brd.js
 * Step 4: BRD Generation Module
 * Generates industry-standard Business Requirements Document
 */

const BRD = {
    /**
     * Generate complete BRD from summary data
     * @param {object} summaryData - Structured summary
     * @param {string} projectName - Project name
     * @param {object} userData - User data
     * @returns {object} BRD document
     */
    generateBRD(summaryData, projectName, userData) {
        return {
            metadata: {
                projectName: projectName,
                author: userData.name,
                role: userData.role,
                generatedDate: new Date().toISOString(),
                version: '1.0'
            },
            executiveSummary: this.generateExecutiveSummary(summaryData, projectName),
            businessObjectives: this.generateBusinessObjectives(summaryData),
            stakeholderAnalysis: this.generateStakeholderAnalysis(summaryData.stakeholders),
            functionalRequirements: this.generateFunctionalRequirements(summaryData.requirements),
            nonFunctionalRequirements: this.generateNonFunctionalRequirements(summaryData.requirements),
            assumptions: this.generateAssumptions(summaryData),
            timeline: this.generateTimeline(summaryData),
            successMetrics: this.generateSuccessMetrics(summaryData),
            riskManagement: this.generateRiskManagement(summaryData.risks)
        };
    },

    generateExecutiveSummary(summaryData, projectName) {
        const decisions = summaryData.keyDecisions || [];
        const requirements = summaryData.requirements || [];
        
        return {
            title: "Executive Summary",
            content: `This Business Requirements Document outlines the requirements, decisions, and strategic direction for ${projectName}. 

Based on comprehensive stakeholder input from across the organization, this document captures the key decisions, technical requirements, and business objectives that will guide project execution.

${decisions.length > 0 ? `Key strategic decisions have been made regarding ${decisions.slice(0, 3).map(d => d.title.toLowerCase()).join(', ')}.` : ''}

${requirements.length > 0 ? `The project encompasses ${requirements.length} core requirements spanning functional, non-functional, and compliance needs.` : ''}

This document serves as the authoritative source for project scope, priorities, and success criteria.`
        };
    },

    generateBusinessObjectives(summaryData) {
        const decisions = summaryData.keyDecisions || [];
        return {
            title: "Business Objectives",
            primaryGoals: decisions.slice(0, 3).map((d, i) => ({
                goal: d.title,
                description: d.description,
                priority: i === 0 ? 'Critical' : 'High'
            })),
            successCriteria: [
                "Successful implementation of all critical requirements",
                "Stakeholder alignment on key technical decisions",
                "Compliance with all regulatory and security standards",
                "On-time delivery within approved budget constraints"
            ],
            expectedOutcomes: [
                "Enhanced operational efficiency",
                "Improved stakeholder satisfaction",
                "Reduced technical debt and operational risk",
                "Scalable foundation for future enhancements"
            ]
        };
    },

    generateStakeholderAnalysis(stakeholders) {
        return {
            title: "Stakeholder Analysis",
            stakeholders: stakeholders.map(s => ({
                name: s.name,
                role: s.role,
                responsibility: s.responsibility,
                communicationFrequency: s.role.toLowerCase().includes('ceo') || s.role.toLowerCase().includes('lead') ? 'Weekly' : 'Bi-weekly'
            })),
            communicationPlan: "Regular status updates will be provided through weekly stakeholder meetings and bi-weekly project reports. Critical decisions will be escalated immediately to executive stakeholders."
        };
    },

    generateFunctionalRequirements(requirements) {
        const functional = requirements.filter(r => r.type === 'Functional' || r.type === 'Business');
        return {
            title: "Functional Requirements",
            requirements: functional.map((r, i) => ({
                id: `FR-${String(i + 1).padStart(3, '0')}`,
                description: r.description,
                priority: r.priority,
                acceptanceCriteria: this.generateAcceptanceCriteria(r.description)
            }))
        };
    },

    generateNonFunctionalRequirements(requirements) {
        const nonFunctional = requirements.filter(r => r.type === 'Security' || r.type === 'Compliance');
        return {
            title: "Non-Functional Requirements",
            performance: [
                "System must handle concurrent user load with response time < 2 seconds",
                "99.9% uptime availability during business hours"
            ],
            security: nonFunctional.filter(r => r.type === 'Security').map(r => r.description),
            compliance: nonFunctional.filter(r => r.type === 'Compliance').map(r => r.description),
            scalability: [
                "Architecture must support 3x growth in user base",
                "Database design must accommodate future feature expansion"
            ]
        };
    },

    generateAssumptions(summaryData) {
        return {
            title: "Assumptions",
            business: [
                "Stakeholder availability for timely decision-making",
                "Budget allocation remains stable throughout project lifecycle",
                "Market conditions remain favorable for project objectives"
            ],
            technical: [
                "Current technology stack is adequate for requirements",
                "Third-party integrations will remain stable and supported",
                "Development team has necessary expertise"
            ],
            resource: [
                "Key personnel will remain available throughout project",
                "Required infrastructure and tools are accessible",
                "External dependencies will be delivered on schedule"
            ]
        };
    },

    generateTimeline(summaryData) {
        return {
            title: "Timeline",
            phases: [
                {
                    phase: "Phase 1: Requirements & Design",
                    duration: "2-3 weeks",
                    deliverables: ["Detailed technical specifications", "Architecture diagrams", "Database schema"]
                },
                {
                    phase: "Phase 2: Development",
                    duration: "6-8 weeks",
                    deliverables: ["Core functionality implementation", "Integration with external systems", "Unit and integration tests"]
                },
                {
                    phase: "Phase 3: Testing & QA",
                    duration: "2-3 weeks",
                    deliverables: ["Comprehensive test execution", "Bug fixes and optimization", "Performance testing"]
                },
                {
                    phase: "Phase 4: Deployment & Launch",
                    duration: "1-2 weeks",
                    deliverables: ["Production deployment", "User training", "Go-live support"]
                }
            ],
            milestones: [
                { milestone: "Requirements sign-off", date: "Week 2" },
                { milestone: "Development checkpoint", date: "Week 6" },
                { milestone: "UAT completion", date: "Week 11" },
                { milestone: "Production launch", date: "Week 13" }
            ]
        };
    },

    generateSuccessMetrics(summaryData) {
        return {
            title: "Success Metrics",
            kpis: [
                {
                    metric: "Project Completion",
                    target: "100% of critical requirements delivered",
                    measurement: "Acceptance testing results"
                },
                {
                    metric: "Budget Adherence",
                    target: "Within 10% of approved budget",
                    measurement: "Monthly financial reports"
                },
                {
                    metric: "Schedule Adherence",
                    target: "Launch within 2 weeks of planned date",
                    measurement: "Project timeline tracking"
                },
                {
                    metric: "Stakeholder Satisfaction",
                    target: "Average rating > 4.0/5.0",
                    measurement: "Post-project stakeholder survey"
                }
            ]
        };
    },

    generateRiskManagement(risks) {
        return {
            title: "Risk Management",
            risks: risks.map((r, i) => ({
                id: `RISK-${String(i + 1).padStart(3, '0')}`,
                title: r.title,
                description: r.description,
                severity: r.severity,
                probability: r.severity === 'High' ? 'Medium' : 'Low',
                mitigation: r.mitigation,
                contingency: this.generateContingency(r.severity)
            }))
        };
    },

    generateAcceptanceCriteria(requirement) {
        return [
            "Functionality meets specified requirement completely",
            "No critical or high-severity defects present",
            "Performance meets defined benchmarks",
            "Stakeholder approval obtained"
        ];
    },

    generateContingency(severity) {
        if (severity === 'High') {
            return "Escalate immediately to project sponsor; activate contingency resources";
        } else if (severity === 'Medium') {
            return "Monitor closely; implement mitigation plan within 48 hours";
        }
        return "Document and review in next status meeting";
    }
};

// Make BRD available globally
if (typeof window !== 'undefined') {
    window.BRD = BRD;
}
