/**
 * pdf-exporter.js
 * Exports BRD document to PDF format using jsPDF
 */

const PDFExporter = {
    /**
     * Wait for jsPDF library to be available
     * @returns {Promise<boolean>}
     */
    async waitForLibrary() {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max wait
        
        while (attempts < maxAttempts) {
            if (window.jspdf && window.jspdf.jsPDF) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        return false;
    },

    /**
     * Safely render a table using jsPDF AutoTable plugin if available
     * Falls back to manual table rendering if plugin not available
     * @param {object} doc - jsPDF document
     * @param {object} tableConfig - Table configuration
     * @returns {object} Last table position info
     */
    renderTable(doc, tableConfig) {
        // Check if AutoTable plugin is available
        if (doc.autoTable && typeof doc.autoTable === 'function') {
            try {
                doc.autoTable(tableConfig);
                return doc.lastAutoTable;
            } catch (e) {
                console.warn('AutoTable plugin error, using fallback:', e);
                return this.renderTableFallback(doc, tableConfig);
            }
        }
        
        // Fallback to manual table rendering
        return this.renderTableFallback(doc, tableConfig);
    },

    /**
     * Fallback table rendering without AutoTable plugin
     * @param {object} doc - jsPDF document
     * @param {object} config - Table configuration
     * @returns {object} Table position info
     */
    renderTableFallback(doc, config) {
        const margin = config.margin || 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        const colWidth = (pageWidth - 2 * margin) / config.head[0].length;
        const rowHeight = 8;
        let yPosition = config.startY || margin;
        const pageHeight = doc.internal.pageSize.getHeight();

        // Draw header
        doc.setFillColor(37, 99, 235);
        doc.setTextColor(255, 255, 255);
        doc.setFont(undefined, 'bold');
        doc.setFontSize(9);

        config.head[0].forEach((header, colIndex) => {
            doc.rect(margin + colIndex * colWidth, yPosition, colWidth, rowHeight, 'F');
            doc.text(header, margin + colIndex * colWidth + 2, yPosition + 6, { maxWidth: colWidth - 4 });
        });

        yPosition += rowHeight;

        // Draw body rows
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);

        config.body.forEach((row, rowIndex) => {
            // Check for page break
            if (yPosition > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
            }

            // Alternate row colors
            if (rowIndex % 2 === 0) {
                doc.setFillColor(245, 245, 245);
            } else {
                doc.setFillColor(255, 255, 255);
            }

            row.forEach((cell, colIndex) => {
                doc.rect(margin + colIndex * colWidth, yPosition, colWidth, rowHeight, 'F');
                doc.text(String(cell).substring(0, 30), margin + colIndex * colWidth + 2, yPosition + 6, { maxWidth: colWidth - 4 });
            });

            yPosition += rowHeight;
        });

        return {
            finalY: yPosition,
            pageCount: doc.internal.pages.length
        };
    },

    /**
     * Export BRD to PDF file
     * @param {object} brd - The BRD data object
     * @param {string} projectName - Project name for filename
     */
    async exportBRDToPDF(brd, projectName) {
        try {
            UI.showLoader('Generating PDF document...');

            // Wait for jsPDF to be available
            const libraryReady = await this.waitForLibrary();
            if (!libraryReady) {
                UI.hideLoader();
                UI.showError('Error', 'PDF library failed to load. Please refresh the page and try again.');
                return;
            }

            // Create PDF document
            const jsPDFConstructor = window.jspdf.jsPDF;
            const doc = new jsPDFConstructor({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Document margins
            const margin = 15;
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const maxWidth = pageWidth - 2 * margin;
            let yPosition = margin;

            // Get current date
            const currentDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Set font for title
            doc.setFontSize(24);
            doc.setFont(undefined, 'bold');
            doc.text(brd.metadata.projectName, margin, yPosition);
            yPosition += 15;

            // Add metadata
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text(`Version: ${brd.metadata.version} | Author: ${brd.metadata.author} | Date: ${currentDate}`, margin, yPosition);
            yPosition += 10;

            // Add horizontal line
            doc.setDrawColor(200, 200, 200);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 8;

            // Reset text color
            doc.setTextColor(0, 0, 0);

            // Executive Summary
            yPosition = this.addSection(doc, 'Executive Summary', brd.executiveSummary.content, yPosition, margin, pageWidth, pageHeight);

            // Business Objectives
            yPosition = this.addBusinessObjectivesSection(doc, brd.businessObjectives, yPosition, margin, pageWidth, pageHeight);

            // Stakeholder Analysis
            yPosition = this.addStakeholderSection(doc, brd.stakeholderAnalysis, yPosition, margin, pageWidth, pageHeight);

            // Functional Requirements
            yPosition = this.addFunctionalRequirementsSection(doc, brd.functionalRequirements, yPosition, margin, pageWidth, pageHeight);

            // Non-Functional Requirements
            yPosition = this.addNonFunctionalRequirementsSection(doc, brd.nonFunctionalRequirements, yPosition, margin, pageWidth, pageHeight);

            // Assumptions
            yPosition = this.addAssumptionsSection(doc, brd.assumptions, yPosition, margin, pageWidth, pageHeight);

            // Timeline
            yPosition = this.addTimelineSection(doc, brd.timeline, yPosition, margin, pageWidth, pageHeight);

            // Success Metrics
            yPosition = this.addSuccessMetricsSection(doc, brd.successMetrics, yPosition, margin, pageWidth, pageHeight);

            // Risk Management
            yPosition = this.addRiskManagementSection(doc, brd.riskManagement, yPosition, margin, pageWidth, pageHeight);

            // Add footer with page numbers
            const totalPages = doc.internal.pages.length;
            for (let i = 1; i < totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(9);
                doc.setTextColor(150, 150, 150);
                doc.text(
                    `Page ${i} of ${totalPages - 1}`,
                    pageWidth / 2,
                    pageHeight - margin + 5,
                    { align: 'center' }
                );
            }

            // Save the PDF
            const filename = `${projectName.replace(/\s+/g, '-').toLowerCase()}-brd.pdf`;
            doc.save(filename);

            UI.hideLoader();
            UI.showSuccess('Success', `BRD exported as PDF: ${filename}`);

        } catch (error) {
            console.error('PDF Export Error:', error);
            UI.hideLoader();
            UI.showError('Export Failed', 'Error generating PDF: ' + error.message);
        }
    },

    addSection(doc, title, content, yPosition, margin, pageWidth, pageHeight) {
        const maxWidth = pageWidth - 2 * margin;
        const checkPageBreak = () => {
            if (yPosition > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
            }
        };

        // Section title
        checkPageBreak();
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text(title, margin, yPosition);
        yPosition += 8;

        // Section content
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);

        const lines = doc.splitTextToSize(content, maxWidth);
        lines.forEach(line => {
            checkPageBreak();
            doc.text(line, margin, yPosition);
            yPosition += 6;
        });

        yPosition += 5;
        return yPosition;
    },

    addBusinessObjectivesSection(doc, objectives, yPosition, margin, pageWidth, pageHeight) {
        const maxWidth = pageWidth - 2 * margin;

        const checkPageBreak = () => {
            if (yPosition > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
            }
        };

        // Title
        checkPageBreak();
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text('Business Objectives', margin, yPosition);
        yPosition += 8;

        // Primary Goals
        if (objectives.primaryGoals && objectives.primaryGoals.length > 0) {
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(50, 50, 50);
            checkPageBreak();
            doc.text('Primary Goals', margin, yPosition);
            yPosition += 6;

            objectives.primaryGoals.forEach(goal => {
                checkPageBreak();
                doc.setFontSize(11);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(0, 0, 0);
                doc.text(`• ${goal.goal}`, margin + 5, yPosition);
                yPosition += 5;

                doc.setFont(undefined, 'normal');
                doc.setTextColor(100, 100, 100);
                const descLines = doc.splitTextToSize(goal.description, maxWidth - 10);
                descLines.forEach(line => {
                    checkPageBreak();
                    doc.text(line, margin + 8, yPosition);
                    yPosition += 4;
                });
                yPosition += 2;
            });
        }

        // Success Criteria
        if (objectives.successCriteria && objectives.successCriteria.length > 0) {
            yPosition += 3;
            checkPageBreak();
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(50, 50, 50);
            doc.text('Success Criteria', margin, yPosition);
            yPosition += 6;

            objectives.successCriteria.forEach(criteria => {
                checkPageBreak();
                doc.setFontSize(11);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(0, 0, 0);
                const criteriaLines = doc.splitTextToSize(`• ${criteria}`, maxWidth - 5);
                criteriaLines.forEach(line => {
                    checkPageBreak();
                    doc.text(line, margin + 5, yPosition);
                    yPosition += 4;
                });
            });
        }

        yPosition += 5;
        return yPosition;
    },

    addStakeholderSection(doc, analysis, yPosition, margin, pageWidth, pageHeight) {
        const maxWidth = pageWidth - 2 * margin;

        const checkPageBreak = () => {
            if (yPosition > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
            }
        };

        checkPageBreak();
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text('Stakeholder Analysis', margin, yPosition);
        yPosition += 10;

        // Stakeholders table
        if (analysis.stakeholders && analysis.stakeholders.length > 0) {
            const tableData = analysis.stakeholders.map(s => [
                s.name,
                s.role,
                s.responsibility.substring(0, 30) + (s.responsibility.length > 30 ? '...' : ''),
                s.communicationFrequency
            ]);

            const tableResult = this.renderTable(doc, {
                head: [['Name', 'Role', 'Responsibility', 'Frequency']],
                body: tableData,
                startY: yPosition,
                margin: margin,
                theme: 'grid',
                headerStyles: {
                    fillColor: [37, 99, 235],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    fontSize: 10
                },
                bodyStyles: {
                    fontSize: 9,
                    textColor: [0, 0, 0]
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                columnWidth: 'auto'
            });

            yPosition = tableResult.finalY + 8;
        }

        return yPosition;
    },

    addFunctionalRequirementsSection(doc, requirements, yPosition, margin, pageWidth, pageHeight) {
        const maxWidth = pageWidth - 2 * margin;

        const checkPageBreak = () => {
            if (yPosition > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
            }
        };

        if (!requirements.requirements || requirements.requirements.length === 0) return yPosition;

        checkPageBreak();
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text('Functional Requirements', margin, yPosition);
        yPosition += 10;

        requirements.requirements.forEach((req, index) => {
            checkPageBreak();
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text(`${req.id}: ${req.description.substring(0, 50)}...`, margin, yPosition);
            yPosition += 5;

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text(`Priority: ${req.priority}`, margin + 5, yPosition);
            yPosition += 5;

            if (req.acceptanceCriteria && req.acceptanceCriteria.length > 0) {
                doc.setFontSize(9);
                doc.text('Acceptance Criteria:', margin + 5, yPosition);
                yPosition += 4;

                req.acceptanceCriteria.forEach(criteria => {
                    checkPageBreak();
                    const criLines = doc.splitTextToSize(`• ${criteria}`, maxWidth - 15);
                    criLines.forEach(line => {
                        doc.text(line, margin + 8, yPosition);
                        yPosition += 3;
                    });
                });
            }

            yPosition += 3;
        });

        return yPosition;
    },

    addNonFunctionalRequirementsSection(doc, requirements, yPosition, margin, pageWidth, pageHeight) {
        const maxWidth = pageWidth - 2 * margin;

        const checkPageBreak = () => {
            if (yPosition > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
            }
        };

        checkPageBreak();
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text('Non-Functional Requirements', margin, yPosition);
        yPosition += 10;

        // Performance
        if (requirements.performance && requirements.performance.length > 0) {
            checkPageBreak();
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(50, 50, 50);
            doc.text('Performance', margin, yPosition);
            yPosition += 5;

            requirements.performance.forEach(perf => {
                checkPageBreak();
                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(0, 0, 0);
                const perfLines = doc.splitTextToSize(`• ${perf}`, maxWidth - 5);
                perfLines.forEach(line => {
                    doc.text(line, margin + 5, yPosition);
                    yPosition += 4;
                });
            });
            yPosition += 3;
        }

        // Security
        if (requirements.security && requirements.security.length > 0) {
            checkPageBreak();
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(50, 50, 50);
            doc.text('Security', margin, yPosition);
            yPosition += 5;

            requirements.security.forEach(sec => {
                checkPageBreak();
                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(0, 0, 0);
                const secLines = doc.splitTextToSize(`• ${sec}`, maxWidth - 5);
                secLines.forEach(line => {
                    doc.text(line, margin + 5, yPosition);
                    yPosition += 4;
                });
            });
            yPosition += 3;
        }

        return yPosition;
    },

    addAssumptionsSection(doc, assumptions, yPosition, margin, pageWidth, pageHeight) {
        const maxWidth = pageWidth - 2 * margin;

        const checkPageBreak = () => {
            if (yPosition > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
            }
        };

        checkPageBreak();
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text('Assumptions', margin, yPosition);
        yPosition += 8;

        // Business Assumptions
        if (assumptions.business && assumptions.business.length > 0) {
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(50, 50, 50);
            doc.text('Business Assumptions', margin, yPosition);
            yPosition += 5;

            assumptions.business.forEach(assumption => {
                checkPageBreak();
                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(0, 0, 0);
                const assLines = doc.splitTextToSize(`• ${assumption}`, maxWidth - 5);
                assLines.forEach(line => {
                    doc.text(line, margin + 5, yPosition);
                    yPosition += 4;
                });
            });
            yPosition += 2;
        }

        return yPosition;
    },

    addTimelineSection(doc, timeline, yPosition, margin, pageWidth, pageHeight) {
        const maxWidth = pageWidth - 2 * margin;

        const checkPageBreak = () => {
            if (yPosition > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
            }
        };

        checkPageBreak();
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text('Timeline', margin, yPosition);
        yPosition += 10;

        // Milestones table
        if (timeline.milestones && timeline.milestones.length > 0) {
            const milestoneData = timeline.milestones.map(m => [m.milestone, m.date]);

            const tableResult = this.renderTable(doc, {
                head: [['Milestone', 'Target Date']],
                body: milestoneData,
                startY: yPosition,
                margin: margin,
                theme: 'grid',
                headerStyles: {
                    fillColor: [37, 99, 235],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold'
                },
                bodyStyles: {
                    fontSize: 10
                }
            });

            yPosition = tableResult.finalY + 8;
        }

        return yPosition;
    },

    addSuccessMetricsSection(doc, metrics, yPosition, margin, pageWidth, pageHeight) {
        const checkPageBreak = () => {
            if (yPosition > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
            }
        };

        checkPageBreak();
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text('Success Metrics', margin, yPosition);
        yPosition += 10;

        // KPI table
        if (metrics.kpis && metrics.kpis.length > 0) {
            const kpiData = metrics.kpis.map(kpi => [
                kpi.metric,
                kpi.target.substring(0, 30) + (kpi.target.length > 30 ? '...' : ''),
                kpi.measurement.substring(0, 25) + (kpi.measurement.length > 25 ? '...' : '')
            ]);

            const tableResult = this.renderTable(doc, {
                head: [['Metric', 'Target', 'Measurement']],
                body: kpiData,
                startY: yPosition,
                margin: margin,
                theme: 'grid',
                headerStyles: {
                    fillColor: [37, 99, 235],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    fontSize: 9
                },
                bodyStyles: {
                    fontSize: 8
                },
                columnWidth: 'auto'
            });

            yPosition = tableResult.finalY + 8;
        }

        return yPosition;
    },

    addRiskManagementSection(doc, riskManagement, yPosition, margin, pageWidth, pageHeight) {
        const maxWidth = pageWidth - 2 * margin;

        const checkPageBreak = () => {
            if (yPosition > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
            }
        };

        if (!riskManagement.risks || riskManagement.risks.length === 0) return yPosition;

        checkPageBreak();
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text('Risk Management', margin, yPosition);
        yPosition += 10;

        riskManagement.risks.forEach((risk, index) => {
            checkPageBreak();
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');

            const severityColor = risk.severity === 'High' ? [220, 38, 38] : risk.severity === 'Medium' ? [234, 179, 8] : [34, 197, 94];
            doc.setTextColor(...severityColor);
            doc.text(`${risk.id}: ${risk.title}`, margin, yPosition);
            yPosition += 5;

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text(`Severity: ${risk.severity} | Probability: ${risk.probability}`, margin + 5, yPosition);
            yPosition += 5;

            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, 'normal');
            const descLines = doc.splitTextToSize(`Description: ${risk.description}`, maxWidth - 10);
            descLines.forEach(line => {
                checkPageBreak();
                doc.text(line, margin + 5, yPosition);
                yPosition += 4;
            });

            const mitLines = doc.splitTextToSize(`Mitigation: ${risk.mitigation}`, maxWidth - 10);
            mitLines.forEach(line => {
                checkPageBreak();
                doc.text(line, margin + 5, yPosition);
                yPosition += 4;
            });

            yPosition += 3;
        });

        return yPosition;
    }
};

// Make PDFExporter available globally
if (typeof window !== 'undefined') {
    window.PDFExporter = PDFExporter;
}
