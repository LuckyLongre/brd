import { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Storage from '../utils/storage';
import { getUserData } from '../data/dummyData';
import { extractFacts, deleteFact } from '../utils/extraction';
import { detectConflicts } from '../utils/conflicts';
import { generateSummary } from '../utils/summary';
import { generateBRD } from '../utils/brd';
import { LoadingModal, ErrorModal, SuccessModal } from '../components/Modals';
import Step1Extraction from '../components/steps/Step1Extraction';
import Step2Conflicts from '../components/steps/Step2Conflicts';
import Step3Summary from '../components/steps/Step3Summary';
import Step4BRD from '../components/steps/Step4BRD';

const STEPS = [
    { num: 1, title: 'Extraction', desc: 'Data Extraction', icon: '📊' },
    { num: 2, title: 'Conflicts', desc: 'Conflict Detection', icon: '⚔️' },
    { num: 3, title: 'Summary', desc: 'Summary Review', icon: '📝' },
    { num: 4, title: 'BRD', desc: 'BRD Document', icon: '📄' },
];

const PLATFORM_META = {
    gmail: { icon: '📧', color: '#DC2626', label: 'Gmail', idField: 'thread_id', nameField: 'subject' },
    whatsapp: { icon: '💬', color: '#16A34A', label: 'WhatsApp', idField: 'thread_id', nameField: 'name' },
    slack: { icon: '💼', color: '#2563EB', label: 'Slack', idField: 'channel_id', nameField: 'name' },
    meetings: { icon: '🎤', color: '#EAB308', label: 'Meetings', idField: 'meeting_id', nameField: 'title' },
};

export default function ProjectDashboardPage() {
    const { id: projectId } = useParams();
    const navigate = useNavigate();

    const [projectState, setProjectState] = useState(null);
    const [testUserData, setTestUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState('');
    const [error, setError] = useState(null);
    const [stepSuccess, setStepSuccess] = useState(null);
    const [initDone, setInitDone] = useState(false);

    // Save project state to localStorage
    const saveState = useCallback((state) => {
        const key = Storage.KEYS.PROJECT_PREFIX + projectId;
        const updated = {
            ...state,
            metadata: {
                ...state.metadata,
                lastModified: new Date().toISOString(),
                currentStep: state.currentStep,
                completedSteps: state.completedSteps,
            },
        };
        Storage.set(key, updated);

        // Also update in projects list
        let projects = Storage.get(Storage.KEYS.USER_PROJECTS) || [];
        const idx = projects.findIndex((p) => p.id === projectId);
        if (idx >= 0) {
            projects[idx] = { ...projects[idx], ...updated.metadata };
            Storage.set(Storage.KEYS.USER_PROJECTS, projects);
        }
        return updated;
    }, [projectId]);

    // Init: load project from storage
    useEffect(() => {
        if (!projectId) {
            setError('Project ID not found');
            return;
        }

        const state = Storage.get(Storage.KEYS.PROJECT_PREFIX + projectId);
        if (!state) {
            setError('Project not found');
            return;
        }

        const userData = getUserData(state.metadata.testUserId);
        if (!userData) {
            setError('Test user data not found');
            return;
        }

        setTestUserData(userData);

        // If extraction not done yet, run it
        if (!state.extractionData || state.extractionData.length === 0) {
            setLoadingMsg('Extracting relevant facts from conversations...');
            setLoading(true);

            setTimeout(() => {
                const facts = extractFacts(userData);
                const newState = {
                    ...state,
                    extractionData: facts,
                    completedSteps: [1],
                    currentStep: 1,
                };
                const saved = saveState(newState);
                setProjectState(saved);
                setLoading(false);
                setInitDone(true);
            }, 2000);
        } else {
            setProjectState(state);
            setInitDone(true);
        }
    }, [projectId, saveState]);

    if (error) {
        return (
            <ErrorModal
                title="Error"
                message={error}
                onClose={() => navigate('/dashboard')}
            />
        );
    }

    if (!initDone || !projectState) {
        return <LoadingModal message={loadingMsg || 'Loading project...'} />;
    }

    const currentStep = projectState.currentStep;
    const completedSteps = projectState.completedSteps || [];

    // Navigate to a step
    const viewStep = (stepNum) => {
        const isCompleted = completedSteps.includes(stepNum);
        const prevCompleted = completedSteps.includes(stepNum - 1);

        if (stepNum > currentStep && !prevCompleted) {
            setError('Please complete previous steps first.');
            return;
        }

        const newState = { ...projectState, currentStep: stepNum };
        const saved = saveState(newState);
        setProjectState(saved);
    };

    // ===== STEP 1 Handlers =====
    const handleDeleteFact = (factId) => {
        const newFacts = deleteFact(projectState.extractionData, factId);
        const newState = { ...projectState, extractionData: newFacts };
        const saved = saveState(newState);
        setProjectState(saved);
    };

    const handleCompleteStep1 = async () => {
        setLoadingMsg('Analyzing conversations and detecting conflicts...');
        setLoading(true);

        await new Promise((r) => setTimeout(r, 1500));

        const conflicts = detectConflicts(projectState.extractionData);
        const completedStepsNew = [...new Set([...completedSteps, 1])];
        const newState = {
            ...projectState,
            conflictsData: conflicts,
            completedSteps: completedStepsNew,
            currentStep: 2,
        };
        const saved = saveState(newState);
        setProjectState(saved);
        setLoading(false);
    };

    // ===== STEP 2 Handlers =====
    const handleSelectConflictOption = (conflictId, factId) => {
        const updatedConflicts = projectState.conflictsData.map((c) =>
            c.id === conflictId ? { ...c, selectedFactId: factId } : c
        );
        const newState = { ...projectState, conflictsData: updatedConflicts };
        const saved = saveState(newState);
        setProjectState(saved);
    };

    const handleResolveAllConflicts = async (comments) => {
        const updatedConflicts = projectState.conflictsData.map((c) => ({
            ...c,
            resolved: true,
            comment: comments[c.id] || '',
        }));

        const newState = { ...projectState, conflictsData: updatedConflicts };
        const saved = saveState(newState);
        setProjectState(saved);

        setStepSuccess({ title: 'Conflicts Resolved', message: 'All conflicts resolved successfully!' });

        setTimeout(async () => {
            setStepSuccess(null);
            setLoadingMsg('Generating structured summary...');
            setLoading(true);

            await new Promise((r) => setTimeout(r, 1500));

            const summary = generateSummary(saved.extractionData, saved.conflictsData);
            const completedStepsNew = [...new Set([...saved.completedSteps, 2])];
            const newState2 = { ...saved, summaryData: summary, completedSteps: completedStepsNew, currentStep: 3 };
            const saved2 = saveState(newState2);
            setProjectState(saved2);
            setLoading(false);
        }, 1000);
    };

    // ===== STEP 3 Handlers =====
    const updateSummaryField = (section, idx, field, value) => {
        const updatedSection = [...(projectState.summaryData[section] || [])];
        updatedSection[idx] = { ...updatedSection[idx], [field]: value };
        const newSummary = { ...projectState.summaryData, [section]: updatedSection };
        const newState = { ...projectState, summaryData: newSummary };
        const saved = saveState(newState);
        setProjectState(saved);
    };

    const removeSummaryItem = (section, idx) => {
        const updatedSection = (projectState.summaryData[section] || []).filter((_, i) => i !== idx);
        const newSummary = { ...projectState.summaryData, [section]: updatedSection };
        const newState = { ...projectState, summaryData: newSummary };
        const saved = saveState(newState);
        setProjectState(saved);
    };

    const addSummaryItem = (section, newItem) => {
        const updatedSection = [...(projectState.summaryData[section] || []), newItem];
        const newSummary = { ...projectState.summaryData, [section]: updatedSection };
        const newState = { ...projectState, summaryData: newSummary };
        const saved = saveState(newState);
        setProjectState(saved);
    };

    const handleCompleteStep3 = async () => {
        setLoadingMsg('Generating BRD...');
        setLoading(true);

        await new Promise((r) => setTimeout(r, 1500));

        const brd = generateBRD(projectState.summaryData, projectState.metadata.name, testUserData);
        const completedStepsNew = [...new Set([...completedSteps, 3])];
        const newState = { ...projectState, brdData: brd, completedSteps: completedStepsNew, currentStep: 4 };
        const saved = saveState(newState);
        setProjectState(saved);
        setLoading(false);
    };

    // ===== STEP 4 Handlers =====
    const handleBackToStep3 = () => {
        const newState = { ...projectState, currentStep: 3 };
        const saved = saveState(newState);
        setProjectState(saved);
    };

    const handleFinalize = () => {
        const completedStepsNew = [...new Set([...completedSteps, 4])];
        const newState = {
            ...projectState,
            completedSteps: completedStepsNew,
            metadata: { ...projectState.metadata, status: 'completed', completedDate: new Date().toISOString() },
        };
        const saved = saveState(newState);
        setProjectState(saved);
        setStepSuccess({ title: 'Project Complete', message: 'Your BRD has been finalized!' });
        setTimeout(() => { navigate('/dashboard'); }, 2000);
    };

    return (
        <div className="bg-gray-50 h-screen overflow-hidden flex flex-col">
            {loading && <LoadingModal message={loadingMsg} />}
            {error && <ErrorModal title="Error" message={error} onClose={() => setError(null)} />}
            {stepSuccess && <SuccessModal title={stepSuccess.title} message={stepSuccess.message} onClose={() => setStepSuccess(null)} />}

            {/* Top Navigation */}
            <nav className="bg-white border-b flex-shrink-0" style={{ borderColor: '#E5E7EB' }}>
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold" style={{ color: '#2563EB' }}>BRD Generator</h1>
                        <span className="text-sm hidden sm:inline" style={{ color: '#6B7280' }}>
                            {projectState.metadata.name}
                        </span>
                    </div>
                    <Link
                        to="/dashboard"
                        className="text-sm px-4 py-2 rounded-lg border transition-colors hover:bg-gray-50"
                        style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
                    >
                        ← Back
                    </Link>
                </div>

                {/* Steps Progress Bar */}
                <div className="border-t" style={{ borderColor: '#E5E7EB' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between gap-2 sm:gap-4">
                            {STEPS.map((step, index) => {
                                const isActive = currentStep === step.num;
                                const isCompleted = completedSteps.includes(step.num);
                                const isPending = !isActive && !isCompleted;

                                let circleStyle = 'flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm sm:text-base font-semibold flex-shrink-0 ';
                                let textStyle = 'text-xs sm:text-sm font-medium ';
                                let connectorBg;

                                if (isActive) {
                                    circleStyle += 'bg-blue-600 text-white';
                                    textStyle += 'text-blue-600';
                                    connectorBg = '#E5E7EB';
                                } else if (isCompleted) {
                                    circleStyle += 'bg-green-500 text-white';
                                    textStyle += 'text-green-600';
                                    connectorBg = '#22C55E';
                                } else {
                                    circleStyle += 'bg-gray-100 text-gray-400 border border-gray-200';
                                    textStyle += 'text-gray-400';
                                    connectorBg = '#E5E7EB';
                                }

                                return (
                                    <div
                                        key={step.num}
                                        className="flex items-center flex-1"
                                        onClick={() => viewStep(step.num)}
                                        style={{ cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.6 : 1 }}
                                    >
                                        <div className="flex flex-col items-center w-full">
                                            <div className="flex items-center w-full">
                                                <div className={circleStyle}>
                                                    {isCompleted ? '✓' : step.icon}
                                                </div>
                                                {index < STEPS.length - 1 && (
                                                    <div className="flex-1 h-0.5 mx-1 sm:mx-2" style={{ backgroundColor: connectorBg }} />
                                                )}
                                            </div>
                                            <div className="mt-2 text-center w-full">
                                                <div className={textStyle + ' hidden sm:block'}>{step.desc}</div>
                                                <div className={textStyle + ' sm:hidden'}>{step.title}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Layout */}
            <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
                {/* Platform Sidebar - Read Only */}
                <div
                    className="flex-shrink-0 bg-white border-b lg:border-b-0 lg:border-r overflow-y-auto"
                    style={{ borderColor: '#E5E7EB', width: undefined }}
                >
                    <div
                        className="lg:w-70"
                        style={{ minWidth: '220px', maxWidth: '280px' }}
                    >
                        <div className="p-4 border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
                            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>
                                DATA SOURCES
                            </h3>
                            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Connected platforms used in this project</p>
                        </div>

                        <div>
                            {['gmail', 'whatsapp', 'slack', 'meetings'].map((platform) => {
                                if (!testUserData?.data_vault[platform]) return null;
                                const meta = PLATFORM_META[platform];
                                const vault = testUserData.data_vault;
                                let items = [];
                                if (platform === 'gmail') items = vault.gmail.filter((g) => g.is_relevant);
                                if (platform === 'whatsapp') items = vault.whatsapp.filter((w) => w.is_relevant);
                                if (platform === 'slack') items = vault.slack.filter((s) => s.is_relevant);
                                if (platform === 'meetings') items = vault.meetings;

                                return (
                                    <div key={platform} className="border-b" style={{ borderColor: '#F3F4F6' }}>
                                        <div
                                            className="px-4 py-3 flex items-center gap-3"
                                            style={{ backgroundColor: '#F9FAFB' }}
                                        >
                                            <div
                                                className="w-7 h-7 rounded-md flex items-center justify-center text-sm flex-shrink-0"
                                                style={{ backgroundColor: meta.color + '20', color: meta.color }}
                                            >
                                                {meta.icon}
                                            </div>
                                            <span className="text-sm font-medium flex-1" style={{ color: '#111827' }}>{meta.label}</span>
                                            <span
                                                className="text-xs px-2 py-0.5 rounded-full"
                                                style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontSize: '11px' }}
                                            >
                                                Connected
                                            </span>
                                        </div>
                                        <div>
                                            {items.map((item) => (
                                                <div
                                                    key={item[meta.idField]}
                                                    className="flex items-center gap-2 bg-white border-b"
                                                    style={{ padding: '8px 16px 8px 56px', borderColor: '#F9FAFB', fontSize: '13px', color: '#4B5563' }}
                                                >
                                                    <span style={{ color: '#9CA3AF', fontSize: '12px' }}>●</span>
                                                    <span className="truncate">{item[meta.nameField] || 'Untitled'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {testUserData?.data_vault.proposal && (
                                <div className="border-b" style={{ borderColor: '#F3F4F6' }}>
                                    <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: '#F9FAFB' }}>
                                        <div className="w-7 h-7 rounded-md flex items-center justify-center text-sm flex-shrink-0" style={{ backgroundColor: '#6B728020', color: '#6B7280' }}>📄</div>
                                        <span className="text-sm font-medium flex-1" style={{ color: '#111827' }}>Proposal</span>
                                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontSize: '11px' }}>Connected</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    {currentStep === 1 && (
                        <Step1Extraction
                            facts={projectState.extractionData || []}
                            onDeleteFact={handleDeleteFact}
                            onComplete={handleCompleteStep1}
                        />
                    )}
                    {currentStep === 2 && (
                        <Step2Conflicts
                            conflicts={projectState.conflictsData || []}
                            onSelectOption={handleSelectConflictOption}
                            onResolveAll={handleResolveAllConflicts}
                        />
                    )}
                    {currentStep === 3 && (
                        <Step3Summary
                            summary={projectState.summaryData || {}}
                            onUpdateDecision={(idx, field, value) => updateSummaryField('keyDecisions', idx, field, value)}
                            onRemoveDecision={(idx) => removeSummaryItem('keyDecisions', idx)}
                            onAddDecision={() => addSummaryItem('keyDecisions', { id: 'decision_' + Date.now(), title: 'New Decision', description: 'Add description' })}
                            onUpdateRisk={(idx, field, value) => updateSummaryField('risks', idx, field, value)}
                            onRemoveRisk={(idx) => removeSummaryItem('risks', idx)}
                            onAddRisk={() => addSummaryItem('risks', { id: 'risk_' + Date.now(), title: 'New Risk', severity: 'Medium', description: 'Add description', mitigation: 'Add mitigation' })}
                            onUpdateRequirement={(idx, field, value) => updateSummaryField('requirements', idx, field, value)}
                            onRemoveRequirement={(idx) => removeSummaryItem('requirements', idx)}
                            onAddRequirement={() => addSummaryItem('requirements', { id: 'req_' + Date.now(), type: 'Functional', priority: 'Medium', description: 'Add requirement description' })}
                            onUpdateStakeholder={(idx, field, value) => updateSummaryField('stakeholders', idx, field, value)}
                            onRemoveStakeholder={(idx) => removeSummaryItem('stakeholders', idx)}
                            onAddStakeholder={() => addSummaryItem('stakeholders', { id: 'stakeholder_' + Date.now(), name: 'New Stakeholder', role: 'Role', responsibility: 'Responsibility' })}
                            onComplete={handleCompleteStep3}
                        />
                    )}
                    {currentStep === 4 && projectState.brdData && (
                        <Step4BRD
                            brd={projectState.brdData}
                            projectName={projectState.metadata.name}
                            onBackToStep3={handleBackToStep3}
                            onFinalize={handleFinalize}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
