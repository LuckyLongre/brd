/**
 * brd.js - Step 4: BRD Generation Module
 */

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function generateAcceptanceCriteria() {
    return [
        'Functionality meets specified requirement completely',
        'No critical or high-severity defects present',
        'Performance meets defined benchmarks',
        'Stakeholder approval obtained',
    ];
}

function generateContingency(severity) {
    if (severity === 'High') return 'Escalate immediately to project sponsor; activate contingency resources';
    if (severity === 'Medium') return 'Monitor closely; implement mitigation plan within 48 hours';
    return 'Document and review in next status meeting';
}

export function generateBRD(summaryData, projectName, userData) {
    return {
        metadata: {
            projectName,
            author: userData.name,
            role: userData.role,
            generatedDate: new Date().toISOString(),
            version: '1.0',
        },
        executiveSummary: generateExecutiveSummary(summaryData, projectName),
        businessObjectives: generateBusinessObjectives(summaryData),
        stakeholderAnalysis: generateStakeholderAnalysis(summaryData.stakeholders),
        functionalRequirements: generateFunctionalRequirements(summaryData.requirements),
        nonFunctionalRequirements: generateNonFunctionalRequirements(summaryData.requirements),
        assumptions: generateAssumptions(),
        timeline: generateTimeline(),
        successMetrics: generateSuccessMetrics(),
        riskManagement: generateRiskManagement(summaryData.risks),
    };
}

function generateExecutiveSummary(summaryData, projectName) {
    const decisions = summaryData.keyDecisions || [];
    const requirements = summaryData.requirements || [];
    return {
        title: 'Executive Summary',
        content: `This Business Requirements Document outlines the requirements, decisions, and strategic direction for ${projectName}. 

Based on comprehensive stakeholder input from across the organization, this document captures the key decisions, technical requirements, and business objectives that will guide project execution.

${decisions.length > 0 ? `Key strategic decisions have been made regarding ${decisions.slice(0, 3).map((d) => d.title.toLowerCase()).join(', ')}.` : ''}

${requirements.length > 0 ? `The project encompasses ${requirements.length} core requirements spanning functional, non-functional, and compliance needs.` : ''}

This document serves as the authoritative source for project scope, priorities, and success criteria.`,
    };
}

function generateBusinessObjectives(summaryData) {
    const decisions = summaryData.keyDecisions || [];
    return {
        title: 'Business Objectives',
        primaryGoals: decisions.slice(0, 3).map((d, i) => ({
            goal: d.title,
            description: d.description,
            priority: i === 0 ? 'Critical' : 'High',
        })),
        successCriteria: [
            'Successful implementation of all critical requirements',
            'Stakeholder alignment on key technical decisions',
            'Compliance with all regulatory and security standards',
            'On-time delivery within approved budget constraints',
        ],
        expectedOutcomes: [
            'Enhanced operational efficiency',
            'Improved stakeholder satisfaction',
            'Reduced technical debt and operational risk',
            'Scalable foundation for future enhancements',
        ],
    };
}

function generateStakeholderAnalysis(stakeholders) {
    return {
        title: 'Stakeholder Analysis',
        stakeholders: stakeholders.map((s) => ({
            name: s.name,
            role: s.role,
            responsibility: s.responsibility,
            communicationFrequency:
                s.role.toLowerCase().includes('ceo') || s.role.toLowerCase().includes('lead') ? 'Weekly' : 'Bi-weekly',
        })),
        communicationPlan:
            'Regular status updates will be provided through weekly stakeholder meetings and bi-weekly project reports. Critical decisions will be escalated immediately to executive stakeholders.',
    };
}

function generateFunctionalRequirements(requirements) {
    const functional = requirements.filter((r) => r.type === 'Functional' || r.type === 'Business');
    return {
        title: 'Functional Requirements',
        requirements: functional.map((r, i) => ({
            id: `FR-${String(i + 1).padStart(3, '0')}`,
            description: r.description,
            priority: r.priority,
            acceptanceCriteria: generateAcceptanceCriteria(),
        })),
    };
}

function generateNonFunctionalRequirements(requirements) {
    const nonFunctional = requirements.filter((r) => r.type === 'Security' || r.type === 'Compliance');
    return {
        title: 'Non-Functional Requirements',
        performance: [
            'System must handle concurrent user load with response time < 2 seconds',
            '99.9% uptime availability during business hours',
        ],
        security: nonFunctional.filter((r) => r.type === 'Security').map((r) => r.description),
        compliance: nonFunctional.filter((r) => r.type === 'Compliance').map((r) => r.description),
        scalability: [
            'Architecture must support 3x growth in user base',
            'Database design must accommodate future feature expansion',
        ],
    };
}

function generateAssumptions() {
    return {
        title: 'Assumptions',
        business: [
            'Stakeholder availability for timely decision-making',
            'Budget allocation remains stable throughout project lifecycle',
            'Market conditions remain favorable for project objectives',
        ],
        technical: [
            'Current technology stack is adequate for requirements',
            'Third-party integrations will remain stable and supported',
            'Development team has necessary expertise',
        ],
        resource: [
            'Key personnel will remain available throughout project',
            'Required infrastructure and tools are accessible',
            'External dependencies will be delivered on schedule',
        ],
    };
}

function generateTimeline() {
    return {
        title: 'Timeline',
        phases: [
            {
                phase: 'Phase 1: Requirements & Design',
                duration: '2-3 weeks',
                deliverables: ['Detailed technical specifications', 'Architecture diagrams', 'Database schema'],
            },
            {
                phase: 'Phase 2: Development',
                duration: '6-8 weeks',
                deliverables: [
                    'Core functionality implementation',
                    'Integration with external systems',
                    'Unit and integration tests',
                ],
            },
            {
                phase: 'Phase 3: Testing & QA',
                duration: '2-3 weeks',
                deliverables: ['Comprehensive test execution', 'Bug fixes and optimization', 'Performance testing'],
            },
            {
                phase: 'Phase 4: Deployment & Launch',
                duration: '1-2 weeks',
                deliverables: ['Production deployment', 'User training', 'Go-live support'],
            },
        ],
        milestones: [
            { milestone: 'Requirements sign-off', date: 'Week 2' },
            { milestone: 'Development checkpoint', date: 'Week 6' },
            { milestone: 'UAT completion', date: 'Week 11' },
            { milestone: 'Production launch', date: 'Week 13' },
        ],
    };
}

function generateSuccessMetrics() {
    return {
        title: 'Success Metrics',
        kpis: [
            { metric: 'Project Completion', target: '100% of critical requirements delivered', measurement: 'Acceptance testing results' },
            { metric: 'Budget Adherence', target: 'Within 10% of approved budget', measurement: 'Monthly financial reports' },
            { metric: 'Schedule Adherence', target: 'Launch within 2 weeks of planned date', measurement: 'Project timeline tracking' },
            { metric: 'Stakeholder Satisfaction', target: 'Average rating > 4.0/5.0', measurement: 'Post-project stakeholder survey' },
        ],
    };
}

function generateRiskManagement(risks) {
    return {
        title: 'Risk Management',
        risks: risks.map((r, i) => ({
            id: `RISK-${String(i + 1).padStart(3, '0')}`,
            title: r.title,
            description: r.description,
            severity: r.severity,
            probability: r.severity === 'High' ? 'Medium' : 'Low',
            mitigation: r.mitigation,
            contingency: generateContingency(r.severity),
        })),
    };
}

export function generateMDXContent(brd) {
    const formatDateStr = (d) => formatDate(d);
    let mdx = '';

    mdx += `# ${brd.metadata.projectName}\n\n`;
    mdx += `**Version:** ${brd.metadata.version} | **Author:** ${brd.metadata.author} | **Date:** ${formatDateStr(brd.metadata.generatedDate)}\n\n`;
    mdx += `---\n\n`;

    // Executive Summary
    mdx += `## Executive Summary\n\n${brd.executiveSummary.content}\n\n`;

    // Business Objectives (repeated once, original had a bug duplicating it)
    const obj = brd.businessObjectives;
    mdx += `## Business Objectives\n\n`;
    if (obj.primaryGoals?.length > 0) {
        mdx += `### Primary Goals\n\n`;
        obj.primaryGoals.forEach((g) => {
            mdx += `- **${g.goal}** (Priority: ${g.priority})\n  - ${g.description}\n\n`;
        });
    }
    if (obj.successCriteria?.length > 0) {
        mdx += `### Success Criteria\n\n`;
        obj.successCriteria.forEach((c) => { mdx += `- ${c}\n`; });
        mdx += `\n`;
    }
    if (obj.expectedOutcomes?.length > 0) {
        mdx += `### Expected Outcomes\n\n`;
        obj.expectedOutcomes.forEach((o) => { mdx += `- ${o}\n`; });
        mdx += `\n`;
    }

    // Stakeholder Analysis
    const sa = brd.stakeholderAnalysis;
    mdx += `## Stakeholder Analysis\n\n`;
    if (sa.stakeholders?.length > 0) {
        mdx += `### Stakeholders\n\n`;
        mdx += `| Name | Role | Responsibility | Communication Frequency |\n`;
        mdx += `|------|------|-----------------|------------------------|\n`;
        sa.stakeholders.forEach((s) => {
            mdx += `| ${s.name} | ${s.role} | ${s.responsibility} | ${s.communicationFrequency} |\n`;
        });
        mdx += `\n`;
    }
    if (sa.communicationPlan) {
        mdx += `### Communication Plan\n\n${sa.communicationPlan}\n\n`;
    }

    // Functional Requirements
    const fr = brd.functionalRequirements;
    mdx += `## Functional Requirements\n\n`;
    fr.requirements?.forEach((req) => {
        mdx += `### ${req.id} - ${req.description}\n\n**Priority:** ${req.priority}\n\n`;
        if (req.acceptanceCriteria?.length > 0) {
            mdx += `**Acceptance Criteria:**\n`;
            req.acceptanceCriteria.forEach((c) => { mdx += `- ${c}\n`; });
            mdx += `\n`;
        }
    });

    // Non-Functional Requirements
    const nfr = brd.nonFunctionalRequirements;
    mdx += `## Non-Functional Requirements\n\n`;
    if (nfr.performance?.length > 0) {
        mdx += `### Performance Requirements\n\n`;
        nfr.performance.forEach((p) => { mdx += `- ${p}\n`; });
        mdx += `\n`;
    }
    if (nfr.security?.length > 0) {
        mdx += `### Security Requirements\n\n`;
        nfr.security.forEach((s) => { mdx += `- ${s}\n`; });
        mdx += `\n`;
    }
    if (nfr.compliance?.length > 0) {
        mdx += `### Compliance Requirements\n\n`;
        nfr.compliance.forEach((c) => { mdx += `- ${c}\n`; });
        mdx += `\n`;
    }
    if (nfr.scalability?.length > 0) {
        mdx += `### Scalability Requirements\n\n`;
        nfr.scalability.forEach((s) => { mdx += `- ${s}\n`; });
        mdx += `\n`;
    }

    // Assumptions
    const ass = brd.assumptions;
    mdx += `## Assumptions\n\n`;
    if (ass.business?.length > 0) {
        mdx += `### Business Assumptions\n\n`;
        ass.business.forEach((a) => { mdx += `- ${a}\n`; });
        mdx += `\n`;
    }
    if (ass.technical?.length > 0) {
        mdx += `### Technical Assumptions\n\n`;
        ass.technical.forEach((a) => { mdx += `- ${a}\n`; });
        mdx += `\n`;
    }
    if (ass.resource?.length > 0) {
        mdx += `### Resource Assumptions\n\n`;
        ass.resource.forEach((a) => { mdx += `- ${a}\n`; });
        mdx += `\n`;
    }

    // Timeline
    const tl = brd.timeline;
    mdx += `## Timeline\n\n`;
    if (tl.phases?.length > 0) {
        mdx += `### Project Phases\n\n`;
        tl.phases.forEach((p) => {
            mdx += `#### ${p.phase}\n\n**Duration:** ${p.duration}\n\n**Deliverables:**\n`;
            p.deliverables.forEach((d) => { mdx += `- ${d}\n`; });
            mdx += `\n`;
        });
    }
    if (tl.milestones?.length > 0) {
        mdx += `### Milestones\n\n| Milestone | Target Date |\n|-----------|-------------|\n`;
        tl.milestones.forEach((m) => { mdx += `| ${m.milestone} | ${m.date} |\n`; });
        mdx += `\n`;
    }

    // Success Metrics
    const sm = brd.successMetrics;
    mdx += `## Success Metrics\n\n`;
    if (sm.kpis?.length > 0) {
        mdx += `### Key Performance Indicators\n\n| Metric | Target | Measurement |\n|--------|--------|-------------|\n`;
        sm.kpis.forEach((kpi) => { mdx += `| ${kpi.metric} | ${kpi.target} | ${kpi.measurement} |\n`; });
        mdx += `\n`;
    }

    // Risk Management
    const rm = brd.riskManagement;
    mdx += `## Risk Management\n\n`;
    if (rm.risks?.length > 0) {
        mdx += `### Identified Risks\n\n`;
        rm.risks.forEach((risk) => {
            const icon = risk.severity === 'High' ? '🔴' : risk.severity === 'Medium' ? '🟠' : '🟡';
            mdx += `### ${risk.id} - ${risk.title} ${icon}\n\n`;
            mdx += `**Severity:** ${risk.severity} | **Probability:** ${risk.probability}\n\n`;
            mdx += `**Description:** ${risk.description}\n\n`;
            mdx += `**Mitigation Plan:** ${risk.mitigation}\n\n`;
            mdx += `**Contingency Plan:** ${risk.contingency}\n\n`;
            mdx += `---\n\n`;
        });
    }

    return mdx;
}

export function renderMDXAsHTML(mdxContent) {
    let html = mdxContent
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Headings
    html = html.replace(/^### (.*?)$/gm, '<h4 class="mdx-h4">$1</h4>');
    html = html.replace(/^## (.*?)$/gm, '<h2 class="mdx-h2">$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1 class="mdx-h1">$1</h1>');

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr class="mdx-hr">');

    // Bold and Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="mdx-bold">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="mdx-italic">$1</em>');

    // Lines
    html = html.split('\n').map((line) => {
        line = line.trim();
        if (line === '') return '</p>';
        if (line.startsWith('<h') || line.startsWith('<hr') || line.startsWith('<table') || line.startsWith('<ul') || line.startsWith('<ol') || line.startsWith('</')) return line;
        if (line.startsWith('|')) return line;
        if (line.startsWith('-') || line.startsWith('*')) {
            return `<li class="mdx-li">${line.substring(1).trim()}</li>`;
        }
        return `<p class="mdx-p">${line}</p>`;
    }).join('\n');

    // Tables
    html = html.replace(/\|.*?\|.*?\|/gm, (match) => {
        return `<table class="mdx-table"><tr>${match.split('|').map((cell) => {
            const trimmed = cell.trim();
            if (!trimmed) return '';
            return `<td class="mdx-td">${trimmed}</td>`;
        }).join('')}</tr></table>`;
    });

    // Lists
    html = html.replace(/(<li[^>]*>.*?<\/li>)/gs, (match) => {
        return `<ul class="mdx-ul">${match}</ul>`;
    });

    return `<div class="mdx-content">${html}</div>`;
}
