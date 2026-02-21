import { useMemo, useState } from 'react';
import { generateMDXContent, renderMDXAsHTML } from '../../utils/brd';
import { SuccessModal, ErrorModal, ConfirmModal } from '../Modals';

export default function Step4BRD({ brd, projectName, onBackToStep3, onFinalize }) {
    const [copySuccess, setCopySuccess] = useState(false);
    const [copyError, setCopyError] = useState(false);
    const [showFinalize, setShowFinalize] = useState(false);

    const mdxContent = useMemo(() => generateMDXContent(brd), [brd]);
    const htmlContent = useMemo(() => renderMDXAsHTML(mdxContent), [mdxContent]);

    const downloadFile = (content, filename, mimeType) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    const slugName = projectName.replace(/\s+/g, '-').toLowerCase();

    const handleDownloadPDF = async () => {
        try {
            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 20;
            const maxWidth = pageWidth - margin * 2;
            let y = margin;

            const addText = (text, fontSize, isBold, color) => {
                doc.setFontSize(fontSize || 11);
                doc.setFont('helvetica', isBold ? 'bold' : 'normal');
                if (color) doc.setTextColor(...color);
                else doc.setTextColor(0, 0, 0);

                const lines = doc.splitTextToSize(text, maxWidth);
                lines.forEach((line) => {
                    if (y > 270) { doc.addPage(); y = margin; }
                    doc.text(line, margin, y);
                    y += fontSize ? fontSize * 0.5 : 6;
                });
                y += 3;
            };

            addText(brd.metadata.projectName, 20, true, [37, 99, 235]);
            y += 2;
            addText(`Version: ${brd.metadata.version} | Author: ${brd.metadata.author}`, 10, false, [107, 114, 128]);
            y += 5;

            addText('Executive Summary', 14, true);
            addText(brd.executiveSummary.content, 10);
            y += 3;

            const sections = [
                { title: 'Stakeholders', items: brd.stakeholderAnalysis?.stakeholders?.map(s => `${s.name} (${s.role}) - ${s.responsibility}`) },
                { title: 'Business Goals', items: brd.businessObjectives?.primaryGoals?.map(g => `${g.goal}: ${g.description}`) },
                { title: 'Functional Requirements', items: brd.functionalRequirements?.requirements?.map(r => `[${r.priority}] ${r.description}`) },
                { title: 'Risk Management', items: brd.riskManagement?.risks?.map(r => `[${r.severity}] ${r.title}: ${r.description}`) },
            ];

            sections.forEach(({ title, items }) => {
                if (!items?.length) return;
                addText(title, 13, true, [17, 24, 39]);
                items.forEach(item => addText(`• ${item}`, 10));
                y += 2;
            });

            doc.save(`${slugName}-brd.pdf`);
        } catch (err) {
            console.error('PDF generation error', err);
        }
    };

    const handleCopyMDX = () => {
        navigator.clipboard.writeText(mdxContent)
            .then(() => setCopySuccess(true))
            .catch(() => setCopyError(true));
    };

    return (
        <div className="max-w-6xl mx-auto">
            {copySuccess && <SuccessModal title="Copied" message="MDX content copied to clipboard!" onClose={() => setCopySuccess(false)} />}
            {copyError && <ErrorModal title="Error" message="Failed to copy to clipboard." onClose={() => setCopyError(false)} />}
            {showFinalize && (
                <ConfirmModal
                    title="Complete Project"
                    message="Are you sure you want to mark this project as complete? You can still edit and export the BRD later."
                    onConfirm={() => { setShowFinalize(false); onFinalize(); }}
                    onCancel={() => setShowFinalize(false)}
                />
            )}

            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#111827' }}>Step 4: BRD Document</h2>
                <p className="mb-4" style={{ color: '#6B7280' }}>Your Business Requirements Document is ready. View, edit, or export it below.</p>

                <div className="flex flex-wrap gap-3 mb-4">
                    <button
                        onClick={handleDownloadPDF}
                        className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#DC2626' }}
                    >
                        📊 Download as PDF
                    </button>
                    <button
                        onClick={() => downloadFile(mdxContent, `${slugName}-brd.mdx`, 'text/markdown')}
                        className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#2563EB' }}
                    >
                        📥 Download as MDX
                    </button>
                    <button
                        onClick={() => downloadFile(mdxContent, `${slugName}-brd.md`, 'text/markdown')}
                        className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#0891b2' }}
                    >
                        📄 Download as Markdown
                    </button>
                    <button
                        onClick={handleCopyMDX}
                        className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#16A34A' }}
                    >
                        📋 Copy MDX
                    </button>
                </div>
            </div>

            {/* MDX Preview */}
            <div className="bg-white rounded-lg shadow-sm border p-8 mb-8" style={{ borderColor: '#E5E7EB' }}>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>

            <div className="flex justify-center gap-3 mb-8">
                <button
                    onClick={onBackToStep3}
                    className="px-5 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-gray-50"
                    style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
                >
                    ← Back to Summary
                </button>
                <button
                    onClick={() => setShowFinalize(true)}
                    className="px-5 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#16A34A' }}
                >
                    ✓ Complete Project
                </button>
            </div>
        </div>
    );
}
