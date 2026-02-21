import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserList, getUserData } from '../data/dummyData';
import Storage from '../utils/storage';

const PLATFORM_ICONS = {
    gmail: { icon: '📧', color: '#DC2626', label: 'Gmail', idField: 'thread_id', nameField: 'subject' },
    whatsapp: { icon: '💬', color: '#16A34A', label: 'WhatsApp', idField: 'thread_id', nameField: 'name' },
    slack: { icon: '💼', color: '#2563EB', label: 'Slack', idField: 'channel_id', nameField: 'name' },
    meetings: { icon: '🎤', color: '#EAB308', label: 'Meetings', idField: 'meeting_id', nameField: 'title' },
};

const INITIAL_PLATFORM_SELECTIONS = {
    gmail: { selected: true, items: {} },
    whatsapp: { selected: true, items: {} },
    slack: { selected: true, items: {} },
    meetings: { selected: true, items: {} },
};

export default function NewProjectPage() {
    const navigate = useNavigate();
    const testUsers = getUserList();

    const [projectName, setProjectName] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [userData, setUserData] = useState(null);
    const [platformSelections, setPlatformSelections] = useState(INITIAL_PLATFORM_SELECTIONS);

    // Load platforms when user changes
    useEffect(() => {
        if (!selectedUserId) {
            setUserData(null);
            return;
        }
        const user = getUserData(selectedUserId);
        if (!user) return;
        setUserData(user);

        // Initialize selections from user data
        const vault = user.data_vault;
        const newSel = {
            gmail: { selected: true, items: {} },
            whatsapp: { selected: true, items: {} },
            slack: { selected: true, items: {} },
            meetings: { selected: true, items: {} },
        };

        vault.gmail?.forEach((item) => { if (item.is_relevant) newSel.gmail.items[item.thread_id] = true; });
        vault.whatsapp?.forEach((item) => { if (item.is_relevant) newSel.whatsapp.items[item.thread_id] = true; });
        vault.slack?.forEach((item) => { if (item.is_relevant) newSel.slack.items[item.channel_id] = true; });
        vault.meetings?.forEach((item) => { newSel.meetings.items[item.meeting_id] = true; });

        setPlatformSelections(newSel);
    }, [selectedUserId]);

    const togglePlatformMaster = (platform) => {
        setPlatformSelections((prev) => {
            const currentSelected = prev[platform].selected;
            const newItems = {};
            Object.keys(prev[platform].items).forEach((k) => { newItems[k] = !currentSelected; });
            return { ...prev, [platform]: { selected: !currentSelected, items: newItems } };
        });
    };

    const togglePlatformItem = (platform, itemId) => {
        setPlatformSelections((prev) => {
            const updatedItems = { ...prev[platform].items, [itemId]: !prev[platform].items[itemId] };
            const allSelected = Object.values(updatedItems).every((v) => v === true);
            return { ...prev, [platform]: { selected: allSelected, items: updatedItems } };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!projectName.trim() || !selectedUserId) {
            alert('Please fill in all fields');
            return;
        }

        const projectId = 'proj_' + Date.now();
        const user = testUsers.find((u) => u.user_id === selectedUserId);

        const project = {
            id: projectId,
            name: projectName.trim(),
            testUserId: selectedUserId,
            testUserName: user.name,
            testUserProject: user.project,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            currentStep: 1,
            completedSteps: [],
        };

        let projects = Storage.get(Storage.KEYS.USER_PROJECTS) || [];
        projects.push(project);
        Storage.set(Storage.KEYS.USER_PROJECTS, projects);

        const projectState = {
            metadata: project,
            currentStep: 1,
            completedSteps: [],
            extractionData: [],
            conflictsData: [],
            summaryData: {},
            brdData: {},
            editCount: 0,
        };
        Storage.set(Storage.KEYS.PROJECT_PREFIX + projectId, projectState);

        navigate(`/project/${projectId}`);
    };

    const renderPlatformSection = (platform) => {
        if (!userData) return null;
        const vault = userData.data_vault;
        const meta = PLATFORM_ICONS[platform];
        if (!meta) return null;

        let items = [];
        if (platform === 'gmail') items = vault.gmail?.filter((g) => g.is_relevant) || [];
        if (platform === 'whatsapp') items = vault.whatsapp?.filter((w) => w.is_relevant) || [];
        if (platform === 'slack') items = vault.slack?.filter((s) => s.is_relevant) || [];
        if (platform === 'meetings') items = vault.meetings || [];

        if (items.length === 0) return null;

        const sel = platformSelections[platform];
        const allSelected = Object.values(sel.items).every((v) => v === true);

        return (
            <div key={platform} className="border rounded-lg mb-3 overflow-hidden" style={{ borderColor: '#E5E7EB' }}>
                {/* Platform Header */}
                <div
                    className="px-4 py-3 flex items-center gap-3"
                    style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}
                >
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => togglePlatformMaster(platform)}
                        className="w-4 h-4 rounded cursor-pointer"
                        style={{ accentColor: '#2563EB' }}
                    />
                    <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-sm flex-shrink-0"
                        style={{ backgroundColor: meta.color + '20', color: meta.color }}
                    >
                        {meta.icon}
                    </div>
                    <span className="text-sm font-medium flex-1" style={{ color: '#111827' }}>{meta.label}</span>
                    <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
                    >
                        {items.length}
                    </span>
                </div>

                {/* Items */}
                <div>
                    {items.map((item) => {
                        const itemId = item[meta.idField];
                        const label = item[meta.nameField] || 'Untitled';
                        return (
                            <div
                                key={itemId}
                                className="flex items-center gap-3 px-4 py-2.5 border-b last:border-b-0"
                                style={{ borderColor: '#F3F4F6', paddingLeft: '56px' }}
                            >
                                <input
                                    type="checkbox"
                                    checked={!!sel.items[itemId]}
                                    onChange={() => togglePlatformItem(platform, itemId)}
                                    className="w-3.5 h-3.5 rounded cursor-pointer flex-shrink-0"
                                    style={{ accentColor: '#2563EB' }}
                                />
                                <span className="text-xs truncate" style={{ color: '#374151' }}>{label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Navigation */}
            <nav className="bg-white border-b" style={{ borderColor: '#E5E7EB' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 h-16">
                        <Link to="/dashboard" style={{ color: '#6B7280' }} className="hover:text-gray-900 text-lg">←</Link>
                        <h1 className="text-xl font-bold" style={{ color: '#2563EB' }}>BRD Generator</h1>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#111827' }}>Create New Project</h2>
                <p className="mb-8" style={{ color: '#6B7280' }}>Select data sources and create your project</p>

                <div className="bg-white rounded-lg shadow-sm p-6 border mb-6" style={{ borderColor: '#E5E7EB' }}>
                    <form onSubmit={handleSubmit}>
                        {/* Project Name */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2" style={{ color: '#111827' }}>
                                Project Name
                            </label>
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="Enter project name"
                                required
                                className="w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-all"
                                style={{ borderColor: '#E5E7EB' }}
                                onFocus={e => { e.target.style.borderColor = '#2563EB'; }}
                                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; }}
                            />
                        </div>

                        {/* Test User Select */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2" style={{ color: '#111827' }}>
                                Test User
                            </label>
                            <select
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 border rounded-lg text-sm outline-none"
                                style={{ borderColor: '#E5E7EB' }}
                            >
                                <option value="">Select a test user</option>
                                {testUsers.map((u) => (
                                    <option key={u.user_id} value={u.user_id}>
                                        {u.name} ({u.role}) - {u.project}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Platform Selection */}
                        {userData && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium mb-3" style={{ color: '#111827' }}>Select Data Sources</h3>
                                {['gmail', 'whatsapp', 'slack', 'meetings'].map(renderPlatformSection)}

                                {/* Proposal section if exists */}
                                {userData.data_vault.proposal && (
                                    <div className="border rounded-lg mb-3 overflow-hidden" style={{ borderColor: '#E5E7EB' }}>
                                        <div
                                            className="px-4 py-3 flex items-center gap-3"
                                            style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}
                                        >
                                            <input type="checkbox" checked disabled className="w-4 h-4 rounded" style={{ accentColor: '#2563EB' }} />
                                            <div className="w-7 h-7 rounded-md flex items-center justify-center text-sm" style={{ backgroundColor: '#6B728020', color: '#6B7280' }}>
                                                📄
                                            </div>
                                            <span className="text-sm font-medium" style={{ color: '#111827' }}>Proposal</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
                            <Link
                                to="/dashboard"
                                className="flex-1 px-4 py-2.5 border rounded-lg text-center text-sm transition-colors hover:bg-gray-50"
                                style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-colors"
                                style={{ backgroundColor: '#2563EB' }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#1E40AF'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = '#2563EB'}
                            >
                                Create Project
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
