import { useState } from 'react';
import { getSourceColor, getSourceIcon } from '../../utils/extraction';
import { getConflictTypeColor } from '../../utils/conflicts';

export default function Step2Conflicts({ conflicts, onSelectOption, onResolveAll }) {
    // Local state for textarea comments - controlled
    const [comments, setComments] = useState(() => {
        const init = {};
        conflicts.forEach((c) => { init[c.id] = c.comment || ''; });
        return init;
    });

    const allSelected = conflicts.every((c) => c.selectedFactId !== null);

    const handleResolve = () => {
        // Pass comments up for saving
        onResolveAll(comments);
    };

    const handleCommentChange = (conflictId, value) => {
        setComments((prev) => ({ ...prev, [conflictId]: value }));
    };

    if (conflicts.length === 0) {
        return (
            <div className="max-w-4xl mx-auto text-center py-12">
                <p style={{ color: '#6B7280' }}>No conflicts detected.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#111827' }}>Step 2: Conflict Detection</h2>
            <p className="mb-6" style={{ color: '#6B7280' }}>
                {conflicts.length} conflict{conflicts.length !== 1 ? 's' : ''} detected. Select your preferred option for each.
            </p>

            <div className="space-y-5">
                {conflicts.map((conflict, index) => {
                    const typeColor = getConflictTypeColor(conflict.type);

                    return (
                        <div key={conflict.id} className="bg-white rounded-lg shadow-sm p-5 border" style={{ borderColor: '#E5E7EB' }}>
                            <div className="flex items-center justify-between mb-3">
                                <span
                                    className="text-xs px-2 py-1 rounded-full"
                                    style={{ backgroundColor: typeColor + '20', color: typeColor }}
                                >
                                    {conflict.description}
                                </span>
                                <span className="text-xs" style={{ color: '#6B7280' }}>
                                    {index + 1}/{conflicts.length}
                                </span>
                            </div>

                            {/* Option A */}
                            <ConflictOption
                                fact={conflict.factA}
                                isSelected={conflict.selectedFactId === conflict.factA.id}
                                onClick={() => onSelectOption(conflict.id, conflict.factA.id)}
                                name={`conflict_${conflict.id}`}
                            />

                            {/* Option B */}
                            <ConflictOption
                                fact={conflict.factB}
                                isSelected={conflict.selectedFactId === conflict.factB.id}
                                onClick={() => onSelectOption(conflict.id, conflict.factB.id)}
                                name={`conflict_${conflict.id}`}
                            />

                            {/* Comment */}
                            <div>
                                <textarea
                                    rows={2}
                                    value={comments[conflict.id] || ''}
                                    onChange={(e) => handleCommentChange(conflict.id, e.target.value)}
                                    className="w-full px-3 py-2 text-sm border rounded-lg outline-none transition-all"
                                    style={{ borderColor: '#E5E7EB' }}
                                    placeholder="Add reasoning (optional)"
                                    onFocus={e => e.target.style.borderColor = '#2563EB'}
                                    onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleResolve}
                    disabled={!allSelected}
                    className="px-6 py-2.5 rounded-lg text-white text-sm font-medium transition-all"
                    style={{
                        backgroundColor: allSelected ? '#16A34A' : '#9CA3AF',
                        opacity: allSelected ? 1 : 0.6,
                        cursor: allSelected ? 'pointer' : 'not-allowed',
                    }}
                >
                    {allSelected ? 'Resolve All & Continue →' : 'Select All Options First'}
                </button>
            </div>
        </div>
    );
}

function ConflictOption({ fact, isSelected, onClick, name }) {
    const srcColor = getSourceColor(fact.source);
    const srcIcon = getSourceIcon(fact.source);

    return (
        <div
            className="border rounded-lg p-4 mb-3 cursor-pointer transition-all"
            style={{
                borderColor: isSelected ? '#2563EB' : '#E5E7EB',
                borderWidth: isSelected ? '2px' : '1px',
                backgroundColor: isSelected ? '#EFF6FF' : 'white',
            }}
            onClick={onClick}
        >
            <div className="flex gap-3">
                <input
                    type="radio"
                    name={name}
                    checked={isSelected}
                    onChange={onClick}
                    className="mt-1 flex-shrink-0"
                    style={{ accentColor: '#2563EB' }}
                />
                <div>
                    <div className="text-xs mb-2" style={{ color: srcColor }}>
                        {srcIcon} {fact.sourceLabel}
                    </div>
                    <p className="text-sm mb-1" style={{ color: '#111827' }}>{fact.content}</p>
                    <p className="text-xs" style={{ color: '#6B7280' }}>— {fact.speaker}</p>
                </div>
            </div>
        </div>
    );
}
