import { Link } from 'react-router-dom';

const steps = [
    { num: 1, title: 'Data Extraction', desc: 'Import conversations from WhatsApp, Slack, Gmail, and meeting transcripts. We extract relevant facts automatically.' },
    { num: 2, title: 'Conflict Detection', desc: 'AI identifies contradictions in budgets, timelines, and requirements. You resolve conflicts with a simple interface.' },
    { num: 3, title: 'Smart Summary', desc: 'Review and edit key decisions, risks, requirements, and stakeholders in a structured format.' },
    { num: 4, title: 'BRD Generated', desc: 'Export a professional, industry-standard Business Requirements Document ready for stakeholders.' },
];

const benefits = [
    { value: '10x', label: 'Faster Documentation', desc: 'Save hours of manual work collecting and organizing requirements' },
    { value: '95%', label: 'Accuracy Rate', desc: 'AI-powered conflict detection ensures nothing is missed' },
    { value: '100%', label: 'Compliant Format', desc: 'Industry-standard BRD format accepted by all stakeholders' },
];

export default function LandingPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold" style={{ color: '#2563EB' }}>BRD Generator</h1>
                        <div className="flex items-center gap-4">
                            <Link to="/signin" className="text-gray-700 hover:text-gray-900 font-medium">Sign In</Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 rounded-lg text-white font-medium transition-colors"
                                style={{ backgroundColor: '#2563EB' }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#1E40AF'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = '#2563EB'}
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="text-center">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: '#111827' }}>
                        Transform Conversations<br />into Business Requirements
                    </h2>
                    <p className="text-xl md:text-2xl mb-8" style={{ color: '#6B7280' }}>
                        Automatically extract, analyze, and generate professional BRDs from<br className="hidden md:block" />
                        WhatsApp, Slack, Gmail, and Meeting transcripts
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/signup"
                            className="px-8 py-4 rounded-xl text-white text-lg font-medium shadow-sm w-full sm:w-auto transition-colors"
                            style={{ backgroundColor: '#2563EB' }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#1E40AF'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = '#2563EB'}
                        >
                            Start Free Trial
                        </Link>
                        <Link
                            to="/signin"
                            className="px-8 py-4 rounded-xl text-lg font-medium border-2 w-full sm:w-auto transition-colors"
                            style={{ color: '#2563EB', borderColor: '#2563EB', backgroundColor: 'transparent' }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" style={{ backgroundColor: '#F8FAFC' }}>
                <div className="text-center mb-12">
                    <h3 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#111827' }}>How It Works</h3>
                    <p className="text-lg" style={{ color: '#6B7280' }}>Four simple steps to generate your Business Requirements Document</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step) => (
                        <div key={step.num} className="bg-white rounded-xl shadow-sm p-6 border" style={{ borderColor: '#E5E7EB' }}>
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#2563EB' }}>
                                <span className="text-white text-2xl font-bold">{step.num}</span>
                            </div>
                            <h4 className="text-xl font-bold mb-2" style={{ color: '#111827' }}>{step.title}</h4>
                            <p style={{ color: '#6B7280' }}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {benefits.map((b) => (
                        <div key={b.value} className="text-center">
                            <div className="text-4xl font-bold mb-2" style={{ color: '#2563EB' }}>{b.value}</div>
                            <p className="text-lg font-medium mb-1" style={{ color: '#111827' }}>{b.label}</p>
                            <p style={{ color: '#6B7280' }}>{b.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 text-center border" style={{ borderColor: '#E5E7EB' }}>
                    <h3 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#111827' }}>Ready to Get Started?</h3>
                    <p className="text-lg mb-8" style={{ color: '#6B7280' }}>Join thousands of teams streamlining their documentation process</p>
                    <Link
                        to="/signup"
                        className="inline-block px-8 py-4 rounded-xl text-white text-lg font-medium shadow-sm transition-colors"
                        style={{ backgroundColor: '#2563EB' }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#1E40AF'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = '#2563EB'}
                    >
                        Create Free Account
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t mt-16" style={{ borderColor: '#E5E7EB' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center" style={{ color: '#6B7280' }}>
                        <p>© 2024 BRD Generator. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
