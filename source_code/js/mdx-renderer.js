/**
 * mdx-renderer.js
 * Converts BRD data to MDX format and renders it with markdown highlighting
 */

const MDXRenderer = {
    /**
     * Convert BRD object to MDX markdown format
     * @param {object} brd - The BRD data object
     * @returns {string} MDX formatted markdown
     */
    generateMDXContent(brd) {
        let mdx = '';

        // Title and Metadata
        mdx += `# ${brd.metadata.projectName}\n\n`;
        mdx += `**Version:** ${brd.metadata.version} | **Author:** ${brd.metadata.author} | **Date:** ${UI.formatDate(brd.metadata.generatedDate)}\n\n`;
        mdx += `---\n\n`;

        // Executive Summary
        mdx += this.generateMDXSection('Executive Summary', brd.executiveSummary);

        // Business Objectives
        mdx += this.generateBusinessObjectivesMDX(brd.businessObjectives);

        // Business Objectives
        mdx += this.generateBusinessObjectivesMDX(brd.businessObjectives);

        // Stakeholder Analysis
        mdx += this.generateStakeholderAnalysisMDX(brd.stakeholderAnalysis);

        // Functional Requirements
        mdx += this.generateFunctionalRequirementsMDX(brd.functionalRequirements);

        // Non-Functional Requirements
        mdx += this.generateNonFunctionalRequirementsMDX(brd.nonFunctionalRequirements);

        // Assumptions
        mdx += this.generateAssumptionsMDX(brd.assumptions);

        // Timeline
        mdx += this.generateTimelineMDX(brd.timeline);

        // Success Metrics
        mdx += this.generateSuccessMetricsMDX(brd.successMetrics);

        // Risk Management
        mdx += this.generateRiskManagementMDX(brd.riskManagement);

        return mdx;
    },

    generateMDXSection(title, section) {
        let mdx = `## ${title}\n\n`;
        if (section.content) {
            mdx += `${section.content}\n\n`;
        }
        return mdx;
    },

    generateBusinessObjectivesMDX(objectives) {
        let mdx = `## Business Objectives\n\n`;

        if (objectives.primaryGoals && objectives.primaryGoals.length > 0) {
            mdx += `### Primary Goals\n\n`;
            objectives.primaryGoals.forEach(goal => {
                mdx += `- **${goal.goal}** (Priority: ${goal.priority})\n`;
                mdx += `  - ${goal.description}\n\n`;
            });
        }

        if (objectives.successCriteria && objectives.successCriteria.length > 0) {
            mdx += `### Success Criteria\n\n`;
            objectives.successCriteria.forEach(criteria => {
                mdx += `- ${criteria}\n`;
            });
            mdx += `\n`;
        }

        if (objectives.expectedOutcomes && objectives.expectedOutcomes.length > 0) {
            mdx += `### Expected Outcomes\n\n`;
            objectives.expectedOutcomes.forEach(outcome => {
                mdx += `- ${outcome}\n`;
            });
            mdx += `\n`;
        }

        return mdx;
    },

    generateStakeholderAnalysisMDX(analysis) {
        let mdx = `## Stakeholder Analysis\n\n`;

        if (analysis.stakeholders && analysis.stakeholders.length > 0) {
            mdx += `### Stakeholders\n\n`;
            mdx += `| Name | Role | Responsibility | Communication Frequency |\n`;
            mdx += `|------|------|-----------------|------------------------|\n`;
            analysis.stakeholders.forEach(s => {
                mdx += `| ${s.name} | ${s.role} | ${s.responsibility} | ${s.communicationFrequency} |\n`;
            });
            mdx += `\n`;
        }

        if (analysis.communicationPlan) {
            mdx += `### Communication Plan\n\n`;
            mdx += `${analysis.communicationPlan}\n\n`;
        }

        return mdx;
    },

    generateFunctionalRequirementsMDX(requirements) {
        let mdx = `## Functional Requirements\n\n`;

        if (requirements.requirements && requirements.requirements.length > 0) {
            requirements.requirements.forEach(req => {
                mdx += `### ${req.id} - ${req.description}\n\n`;
                mdx += `**Priority:** ${req.priority}\n\n`;
                
                if (req.acceptanceCriteria && req.acceptanceCriteria.length > 0) {
                    mdx += `**Acceptance Criteria:**\n`;
                    req.acceptanceCriteria.forEach(criteria => {
                        mdx += `- ${criteria}\n`;
                    });
                    mdx += `\n`;
                }
            });
        }

        return mdx;
    },

    generateNonFunctionalRequirementsMDX(requirements) {
        let mdx = `## Non-Functional Requirements\n\n`;

        if (requirements.performance && requirements.performance.length > 0) {
            mdx += `### Performance Requirements\n\n`;
            requirements.performance.forEach(perf => {
                mdx += `- ${perf}\n`;
            });
            mdx += `\n`;
        }

        if (requirements.security && requirements.security.length > 0) {
            mdx += `### Security Requirements\n\n`;
            requirements.security.forEach(sec => {
                mdx += `- ${sec}\n`;
            });
            mdx += `\n`;
        }

        if (requirements.compliance && requirements.compliance.length > 0) {
            mdx += `### Compliance Requirements\n\n`;
            requirements.compliance.forEach(comp => {
                mdx += `- ${comp}\n`;
            });
            mdx += `\n`;
        }

        if (requirements.scalability && requirements.scalability.length > 0) {
            mdx += `### Scalability Requirements\n\n`;
            requirements.scalability.forEach(scale => {
                mdx += `- ${scale}\n`;
            });
            mdx += `\n`;
        }

        return mdx;
    },

    generateAssumptionsMDX(assumptions) {
        let mdx = `## Assumptions\n\n`;

        if (assumptions.business && assumptions.business.length > 0) {
            mdx += `### Business Assumptions\n\n`;
            assumptions.business.forEach(assumption => {
                mdx += `- ${assumption}\n`;
            });
            mdx += `\n`;
        }

        if (assumptions.technical && assumptions.technical.length > 0) {
            mdx += `### Technical Assumptions\n\n`;
            assumptions.technical.forEach(assumption => {
                mdx += `- ${assumption}\n`;
            });
            mdx += `\n`;
        }

        if (assumptions.resource && assumptions.resource.length > 0) {
            mdx += `### Resource Assumptions\n\n`;
            assumptions.resource.forEach(assumption => {
                mdx += `- ${assumption}\n`;
            });
            mdx += `\n`;
        }

        return mdx;
    },

    generateTimelineMDX(timeline) {
        let mdx = `## Timeline\n\n`;

        if (timeline.phases && timeline.phases.length > 0) {
            mdx += `### Project Phases\n\n`;
            timeline.phases.forEach(phase => {
                mdx += `#### ${phase.phase}\n\n`;
                mdx += `**Duration:** ${phase.duration}\n\n`;
                mdx += `**Deliverables:**\n`;
                phase.deliverables.forEach(d => {
                    mdx += `- ${d}\n`;
                });
                mdx += `\n`;
            });
        }

        if (timeline.milestones && timeline.milestones.length > 0) {
            mdx += `### Milestones\n\n`;
            mdx += `| Milestone | Target Date |\n`;
            mdx += `|-----------|-------------|\n`;
            timeline.milestones.forEach(m => {
                mdx += `| ${m.milestone} | ${m.date} |\n`;
            });
            mdx += `\n`;
        }

        return mdx;
    },

    generateSuccessMetricsMDX(metrics) {
        let mdx = `## Success Metrics\n\n`;

        if (metrics.kpis && metrics.kpis.length > 0) {
            mdx += `### Key Performance Indicators\n\n`;
            mdx += `| Metric | Target | Measurement |\n`;
            mdx += `|--------|--------|-------------|\n`;
            metrics.kpis.forEach(kpi => {
                mdx += `| ${kpi.metric} | ${kpi.target} | ${kpi.measurement} |\n`;
            });
            mdx += `\n`;
        }

        return mdx;
    },

    generateRiskManagementMDX(riskManagement) {
        let mdx = `## Risk Management\n\n`;

        if (riskManagement.risks && riskManagement.risks.length > 0) {
            mdx += `### Identified Risks\n\n`;
            riskManagement.risks.forEach(risk => {
                const severityColor = risk.severity === 'High' ? '🔴' : risk.severity === 'Medium' ? '🟠' : '🟡';
                mdx += `### ${risk.id} - ${risk.title} ${severityColor}\n\n`;
                mdx += `**Severity:** ${risk.severity} | **Probability:** ${risk.probability}\n\n`;
                mdx += `**Description:** ${risk.description}\n\n`;
                mdx += `**Mitigation Plan:** ${risk.mitigation}\n\n`;
                mdx += `**Contingency Plan:** ${risk.contingency}\n\n`;
                mdx += `---\n\n`;
            });
        }

        return mdx;
    },

    /**
     * Render MDX content as HTML with syntax highlighting
     * @param {string} mdxContent - The MDX markdown content
     * @returns {string} HTML representation
     */
    renderMDXAsHTML(mdxContent) {
        // Escape HTML special characters
        let html = mdxContent
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Process markdown formatting
        html = this.applyMarkdownFormatting(html);

        return `<div class="mdx-content">${html}</div>`;
    },

    applyMarkdownFormatting(content) {
        let html = content;

        // Headings
        html = html.replace(/^### (.*?)$/gm, '<h4 class="mdx-h4">$1</h4>');
        html = html.replace(/^## (.*?)$/gm, '<h2 class="mdx-h2">$1</h2>');
        html = html.replace(/^# (.*?)$/gm, '<h1 class="mdx-h1">$1</h1>');

        // Horizontal rule
        html = html.replace(/^---$/gm, '<hr class="mdx-hr">');

        // Bold and Italic
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="mdx-bold">$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em class="mdx-italic">$1</em>');

        // Line breaks and paragraphs
        html = html.split('\n').map(line => {
            line = line.trim();
            if (line === '') return '</p>';
            if (line.startsWith('<h') || line.startsWith('<hr') || line.startsWith('<table') || line.startsWith('<ul') || line.startsWith('<ol') || line.startsWith('</')) return line;
            if (line.startsWith('|')) return line; // Table content
            if (line.startsWith('-') || line.startsWith('*')) {
                return `<li class="mdx-li">${line.substring(1).trim()}</li>`;
            }
            return `<p class="mdx-p">${line}</p>`;
        }).join('\n');

        // Tables
        html = html.replace(/\|.*?\|.*?\|/gm, (match) => {
            return `<table class="mdx-table"><tr>${match.split('|').map(cell => {
                const trimmed = cell.trim();
                if (!trimmed) return '';
                return `<td class="mdx-td">${trimmed}</td>`;
            }).join('')}</tr></table>`;
        });

        // Convert list items to proper list
        html = html.replace(/(<li[^>]*>.*?<\/li>)/gs, (match) => {
            return `<ul class="mdx-ul">${match}</ul>`;
        });

        return html;
    },

    /**
     * Get MDX content as downloadable text
     * @param {string} mdxContent - The MDX content
     * @returns {Blob} Blob object for download
     */
    getMDXBlob(mdxContent) {
        return new Blob([mdxContent], { type: 'text/markdown' });
    }
};

// Make MDXRenderer available globally
if (typeof window !== 'undefined') {
    window.MDXRenderer = MDXRenderer;
}
