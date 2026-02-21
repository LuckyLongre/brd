import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Storage from '../utils/storage';
import { ConfirmModal } from '../components/Modals';

const PLATFORM_META = [
    { id: 'gmail', name: 'Gmail', icon: '📧', color: '#DC2626', items: ['Inbox', 'Sent', 'Drafts'] },
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: '#16A34A', items: ['Executive Sync', 'Team Chat', 'General'] },
    { id: 'slack', name: 'Slack', icon: '💼', color: '#2563EB', items: ['#general', '#random', '#dev'] },
    { id: 'meetings', name: 'Meetings', icon: '🎤', color: '#EAB308', items: ['Weekly Sync', 'Planning', 'Review'] },
    { id: 'proposal', name: 'Proposal', icon: '📄', color: '#6B7280', items: [] },
];

const INITIAL_CONNECTIONS = {
    gmail: { connected: true, expanded: false },
    whatsapp: { connected: true, expanded: false },
    slack: { connected: true, expanded: false },
    meetings: { connected: true, expanded: false },
    proposal: { connected: false, expanded: false },
};

export default function UserDashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [platformConnections, setPlatformConnections] = useState(INITIAL_CONNECTIONS);
    const [projects, setProjects] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        const stored = Storage.get(Storage.KEYS.USER_PROJECTS) || [];
        setProjects(stored);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    const toggleExpand = (id) => {
        setPlatformConnections((prev) => ({
            ...prev,
            [id]: { ...prev[id], expanded: !prev[id].expanded },
        }));
    };

    const toggleConnection = (id) => {
        // Only "proposal" can be toggled in this demo
        if (id === 'proposal') {
            setPlatformConnections((prev) => ({
                ...prev,
                [id]: { ...prev[id], connected: !prev[id].connected },
            }));
        }
    };

    const confirmDelete = (projectId) => {
        setDeleteTarget(projectId);
    };

    const doDelete = () => {
        if (!deleteTarget) return;
        let stored = Storage.get(Storage.KEYS.USER_PROJECTS) || [];
        stored = stored.filter((p) => p.id !== deleteTarget);
        Storage.set(Storage.KEYS.USER_PROJECTS, stored);
        Storage.remove(Storage.KEYS.PROJECT_PREFIX + deleteTarget);
        setProjects(stored);
        setDeleteTarget(null);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {deleteTarget && (
                <ConfirmModal
                    title="Delete Project"
                    message="Delete this project?"
                    onConfirm={doDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {/* Navigation */}
            <nav className="bg-white border-b" style={{ borderColor: '#E5E7EB' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-xl font-bold" style={{ color: '#2563EB' }}>BRD Generator</h1>
                        <div className="flex items-center gap-4">
                            <span style={{ color: '#6B7280' }}>{user?.name}</span>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 text-sm border rounded transition-colors hover:bg-gray-50"
                                style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left - Platforms */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border p-4" style={{ borderColor: '#E5E7EB' }}>
                            <h3 className="text-sm font-semibold mb-3" style={{ color: '#111827' }}>Connected Platforms</h3>
                            <div>
                                {PLATFORM_META.map((platform) => {
                                    const conn = platformConnections[platform.id];
                                    return (
                                        <div
                                            key={platform.id}
                                            className="border rounded-lg mb-2 overflow-hidden"
                                            style={{ borderColor: '#E5E7EB' }}
                                        >
                                            {/* Platform Header Row */}
                                            <div
                                                className="px-3 py-2.5 flex items-center gap-3 cursor-pointer select-none hover:bg-gray-50 transition-colors"
                                                onClick={() => toggleExpand(platform.id)}
                                            >
                                                <div
                                                    className="w-7 h-7 rounded-md flex items-center justify-center text-sm flex-shrink-0"
                                                    style={{ backgroundColor: platform.color + '20', color: platform.color }}
                                                >
                                                    {platform.icon}
                                                </div>
                                                <span className="text-sm font-medium flex-1" style={{ color: '#111827' }}>
                                                    {platform.name}
                                                </span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleConnection(platform.id); }}
                                                    className={`text-xs px-3 py-1 rounded-full font-medium border transition-all ${conn.connected
                                                            ? 'cursor-default'
                                                            : 'cursor-pointer hover:bg-gray-200'
                                                        }`}
                                                    style={
                                                        conn.connected
                                                            ? { backgroundColor: '#D1FAE5', color: '#065F46', borderColor: '#A7F3D0' }
                                                            : { backgroundColor: '#F3F4F6', color: '#6B7280', borderColor: '#E5E7EB' }
                                                    }
                                                >
                                                    {conn.connected ? 'Connected' : 'Connect'}
                                                </button>
                                                <svg
                                                    className={`w-4 h-4 transition-transform flex-shrink-0 ${conn.expanded ? 'rotate-180' : ''}`}
                                                    style={{ color: '#9CA3AF' }}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                            {/* Expanded Items */}
                                            {conn.expanded && platform.items.length > 0 && (
                                                <div>
                                                    {platform.items.map((item) => (
                                                        <div
                                                            key={item}
                                                            className="text-xs py-2 pl-14 pr-4 border-t"
                                                            style={{ borderColor: '#F3F4F6', color: '#4B5563' }}
                                                        >
                                                            {item}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right - Projects */}
                    <div className="lg:col-span-3">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold" style={{ color: '#111827' }}>My Projects</h2>
                            <Link
                                to="/new-project"
                                className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
                                style={{ backgroundColor: '#2563EB' }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#1E40AF'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = '#2563EB'}
                            >
                                + New Project
                            </Link>
                        </div>

                        {projects.length === 0 ? (
                            <div className="text-center py-12">
                                <p style={{ color: '#6B7280' }}>No projects yet. Create your first project to get started.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {projects.map((project) => {
                                    const isCompleted = project.currentStep >= 4 && project.completedSteps?.includes(4);
                                    return (
                                        <div key={project.id} className="bg-white rounded-lg shadow-sm border p-4" style={{ borderColor: '#E5E7EB' }}>
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="font-medium" style={{ color: '#111827' }}>{project.name}</h3>
                                                <span
                                                    className="text-xs px-2 py-1 rounded-full"
                                                    style={{
                                                        backgroundColor: isCompleted ? '#D1FAE5' : '#FEF3C7',
                                                        color: isCompleted ? '#065F46' : '#92400E',
                                                    }}
                                                >
                                                    {isCompleted ? 'Completed' : `Step ${project.currentStep}/4`}
                                                </span>
                                            </div>
                                            <p className="text-xs mb-3" style={{ color: '#6B7280' }}>
                                                Created: {new Date(project.createdAt).toLocaleDateString()}
                                            </p>
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/project/${project.id}`}
                                                    className="flex-1 px-3 py-1.5 text-xs text-white rounded text-center transition-colors"
                                                    style={{ backgroundColor: '#2563EB' }}
                                                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#1E40AF'}
                                                    onMouseOut={e => e.currentTarget.style.backgroundColor = '#2563EB'}
                                                >
                                                    Open
                                                </Link>
                                                <button
                                                    onClick={() => confirmDelete(project.id)}
                                                    className="px-3 py-1.5 text-xs border rounded transition-colors hover:bg-red-50"
                                                    style={{ borderColor: '#E5E7EB', color: '#DC2626' }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
