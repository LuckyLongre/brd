import { getSourceColor, getSourceIcon } from '../../utils/extraction';
import { ConfirmModal, SuccessModal } from '../Modals';
import { useState } from 'react';

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export default function Step1Extraction({ facts, onDeleteFact, onComplete }) {
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleDelete = (factId) => {
        setConfirmDeleteId(factId);
    };

    const confirmDelete = () => {
        onDeleteFact(confirmDeleteId);
        setConfirmDeleteId(null);
        setShowSuccess(true);
    };

    return (
        <div className="max-w-4xl mx-auto">
            {confirmDeleteId && (
                <ConfirmModal
                    title="Delete Fact"
                    message="Are you sure you want to delete this fact?"
                    onConfirm={confirmDelete}
                    onCancel={() => setConfirmDeleteId(null)}
                />
            )}
            {showSuccess && (
                <SuccessModal
                    title="Deleted"
                    message="Fact has been removed."
                    onClose={() => setShowSuccess(false)}
                />
            )}

            <h2 className="text-2xl font-bold mb-2" style={{ color: '#111827' }}>Step 1: Data Extraction</h2>
            <p className="mb-6" style={{ color: '#6B7280' }}>
                {facts.length} relevant facts extracted from conversations. Review and delete any incorrect facts.
            </p>

            <div className="space-y-4">
                {facts.map((fact) => {
                    const srcColor = getSourceColor(fact.source);
                    const srcIcon = getSourceIcon(fact.source);
                    return (
                        <div key={fact.id} className="bg-white rounded-lg shadow-sm p-5 border" style={{ borderColor: '#E5E7EB' }}>
                            <div className="flex justify-between items-start mb-2">
                                <span
                                    className="text-xs px-2 py-1 rounded-full"
                                    style={{ backgroundColor: srcColor + '20', color: srcColor }}
                                >
                                    {srcIcon} {fact.sourceLabel}
                                </span>
                                <button
                                    onClick={() => handleDelete(fact.id)}
                                    className="text-xs hover:opacity-70 transition-opacity"
                                    style={{ color: '#DC2626' }}
                                >
                                    Delete
                                </button>
                            </div>
                            <p className="mb-2 text-sm" style={{ color: '#111827' }}>{fact.content}</p>
                            <p className="text-xs" style={{ color: '#6B7280' }}>— {fact.speaker}</p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={onComplete}
                    className="px-6 py-2.5 rounded-lg text-white text-sm font-medium transition-colors"
                    style={{ backgroundColor: '#2563EB' }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#1E40AF'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = '#2563EB'}
                >
                    Continue to Conflict Detection →
                </button>
            </div>
        </div>
    );
}
