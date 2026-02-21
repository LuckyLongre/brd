export default function Step3Summary({ summary, onUpdateDecision, onRemoveDecision, onAddDecision,
    onUpdateRisk, onRemoveRisk, onAddRisk,
    onUpdateRequirement, onRemoveRequirement, onAddRequirement,
    onUpdateStakeholder, onRemoveStakeholder, onAddStakeholder,
    onComplete }) {
    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#111827' }}>Step 3: Summary Review</h2>
            <p className="mb-6" style={{ color: '#6B7280' }}>Review and edit the structured summary.</p>

            {/* Key Decisions */}
            <EditableSection
                title="Key Decisions"
                onAdd={onAddDecision}
                addLabel="+ Add"
            >
                {(summary.keyDecisions || []).map((d, idx) => (
                    <div key={d.id || idx} className="p-3 rounded" style={{ backgroundColor: '#F9FAFB' }}>
                        <div className="flex justify-between items-start mb-2">
                            <input
                                type="text"
                                value={d.title}
                                onChange={(e) => onUpdateDecision(idx, 'title', e.target.value)}
                                className="text-sm font-medium bg-transparent border-0 p-0 w-full outline-none"
                                style={{ color: '#111827' }}
                            />
                            <button onClick={() => onRemoveDecision(idx)} className="text-xs ml-2 flex-shrink-0" style={{ color: '#DC2626' }}>×</button>
                        </div>
                        <textarea
                            value={d.description}
                            onChange={(e) => onUpdateDecision(idx, 'description', e.target.value)}
                            rows={2}
                            className="text-sm bg-transparent border-0 p-0 w-full outline-none resize-none"
                            style={{ color: '#6B7280' }}
                        />
                    </div>
                ))}
            </EditableSection>

            {/* Risks */}
            <EditableSection title="Risks" onAdd={onAddRisk} addLabel="+ Add">
                {(summary.risks || []).map((r, idx) => (
                    <div key={r.id || idx} className="p-3 rounded" style={{ backgroundColor: '#F9FAFB' }}>
                        <div className="flex justify-between items-start gap-2 mb-2">
                            <input
                                type="text"
                                value={r.title}
                                onChange={(e) => onUpdateRisk(idx, 'title', e.target.value)}
                                className="text-sm font-medium bg-transparent border-0 p-0 flex-1 outline-none"
                                style={{ color: '#111827' }}
                            />
                            <select
                                value={r.severity}
                                onChange={(e) => onUpdateRisk(idx, 'severity', e.target.value)}
                                className="text-xs border-0 bg-transparent p-0 outline-none"
                                style={{ color: r.severity === 'High' ? '#DC2626' : r.severity === 'Medium' ? '#EAB308' : '#6B7280' }}
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                            <button onClick={() => onRemoveRisk(idx)} className="text-xs flex-shrink-0" style={{ color: '#DC2626' }}>×</button>
                        </div>
                        <textarea
                            value={r.description}
                            onChange={(e) => onUpdateRisk(idx, 'description', e.target.value)}
                            rows={2}
                            className="text-sm bg-transparent border-0 p-0 w-full mb-2 outline-none resize-none"
                            style={{ color: '#6B7280' }}
                        />
                        <textarea
                            value={r.mitigation}
                            onChange={(e) => onUpdateRisk(idx, 'mitigation', e.target.value)}
                            rows={1}
                            className="text-sm bg-transparent border-0 p-0 w-full outline-none resize-none"
                            style={{ color: '#6B7280' }}
                        />
                    </div>
                ))}
            </EditableSection>

            {/* Requirements */}
            <EditableSection title="Requirements" onAdd={onAddRequirement} addLabel="+ Add">
                {(summary.requirements || []).map((r, idx) => (
                    <div key={r.id || idx} className="p-3 rounded" style={{ backgroundColor: '#F9FAFB' }}>
                        <div className="flex items-center gap-2 mb-2">
                            <select
                                value={r.type}
                                onChange={(e) => onUpdateRequirement(idx, 'type', e.target.value)}
                                className="text-xs border-0 bg-transparent p-0 outline-none"
                                style={{ color: '#6B7280' }}
                            >
                                <option value="Functional">Functional</option>
                                <option value="Security">Security</option>
                                <option value="Compliance">Compliance</option>
                                <option value="Business">Business</option>
                            </select>
                            <select
                                value={r.priority}
                                onChange={(e) => onUpdateRequirement(idx, 'priority', e.target.value)}
                                className="text-xs border-0 bg-transparent p-0 outline-none"
                                style={{ color: r.priority === 'High' ? '#DC2626' : r.priority === 'Medium' ? '#EAB308' : '#6B7280' }}
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                            <button onClick={() => onRemoveRequirement(idx)} className="ml-auto text-xs flex-shrink-0" style={{ color: '#DC2626' }}>×</button>
                        </div>
                        <textarea
                            value={r.description}
                            onChange={(e) => onUpdateRequirement(idx, 'description', e.target.value)}
                            rows={2}
                            className="text-sm bg-transparent border-0 p-0 w-full outline-none resize-none"
                            style={{ color: '#6B7280' }}
                        />
                    </div>
                ))}
            </EditableSection>

            {/* Stakeholders */}
            <EditableSection title="Stakeholders" onAdd={onAddStakeholder} addLabel="+ Add">
                {(summary.stakeholders || []).map((s, idx) => (
                    <div key={s.id || idx} className="p-3 rounded" style={{ backgroundColor: '#F9FAFB' }}>
                        <div className="flex justify-between items-start mb-2">
                            <input
                                type="text"
                                value={s.name}
                                onChange={(e) => onUpdateStakeholder(idx, 'name', e.target.value)}
                                className="text-sm font-medium bg-transparent border-0 p-0 flex-1 outline-none"
                                style={{ color: '#111827' }}
                            />
                            <button onClick={() => onRemoveStakeholder(idx)} className="text-xs ml-2 flex-shrink-0" style={{ color: '#DC2626' }}>×</button>
                        </div>
                        <input
                            type="text"
                            value={s.role}
                            onChange={(e) => onUpdateStakeholder(idx, 'role', e.target.value)}
                            className="text-sm bg-transparent border-0 p-0 w-full mb-1 outline-none block"
                            style={{ color: '#6B7280' }}
                        />
                        <textarea
                            value={s.responsibility}
                            onChange={(e) => onUpdateStakeholder(idx, 'responsibility', e.target.value)}
                            rows={1}
                            className="text-sm bg-transparent border-0 p-0 w-full outline-none resize-none"
                            style={{ color: '#6B7280' }}
                        />
                    </div>
                ))}
            </EditableSection>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={onComplete}
                    className="px-6 py-2.5 rounded-lg text-white text-sm font-medium transition-colors"
                    style={{ backgroundColor: '#2563EB' }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#1E40AF'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = '#2563EB'}
                >
                    Generate BRD →
                </button>
            </div>
        </div>
    );
}

function EditableSection({ title, onAdd, addLabel, children }) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-5 border mb-5" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold" style={{ color: '#111827' }}>{title}</h3>
                <button
                    onClick={onAdd}
                    className="text-xs px-2 py-1 border rounded transition-colors hover:bg-gray-50"
                    style={{ borderColor: '#E5E7EB', color: '#2563EB' }}
                >
                    {addLabel}
                </button>
            </div>
            <div className="space-y-3">{children}</div>
        </div>
    );
}
