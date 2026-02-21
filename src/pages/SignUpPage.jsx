import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SuccessModal } from '../components/Modals';

export default function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setPasswordError('');

        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        // Simulate account creation
        setTimeout(() => {
            setLoading(false);
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/signin');
            }, 1500);
        }, 1000);
    };

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-12">
            {showSuccess && (
                <SuccessModal
                    title="Account Created!"
                    message="Redirecting to your dashboard..."
                    onClose={() => { }}
                />
            )}

            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold" style={{ color: '#2563EB' }}>BRD Generator</h1>
                    <p className="mt-2" style={{ color: '#6B7280' }}>Create your free account</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-sm p-8 border" style={{ borderColor: '#E5E7EB' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#111827' }}>
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                                className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all duration-200"
                                style={{ borderColor: '#E5E7EB', color: '#111827' }}
                                onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#111827' }}>
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                required
                                className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all duration-200"
                                style={{ borderColor: '#E5E7EB', color: '#111827' }}
                                onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#111827' }}>
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••"
                                required
                                className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all duration-200"
                                style={{ borderColor: passwordError ? '#DC2626' : '#E5E7EB', color: '#111827' }}
                                onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                                onBlur={e => { e.target.style.borderColor = passwordError ? '#DC2626' : '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                            />
                            {passwordError ? (
                                <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{passwordError}</p>
                            ) : (
                                <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Must be at least 6 characters</p>
                            )}
                        </div>

                        <div className="mb-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-lg text-white font-medium shadow-sm transition-all duration-200"
                                style={{
                                    backgroundColor: '#2563EB',
                                    opacity: loading ? 0.5 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                }}
                                onMouseOver={e => { if (!loading) e.currentTarget.style.backgroundColor = '#1E40AF'; }}
                                onMouseOut={e => { e.currentTarget.style.backgroundColor = '#2563EB'; }}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>

                        <div className="text-center">
                            <p style={{ color: '#6B7280' }}>
                                Already have an account?{' '}
                                <Link to="/signin" className="font-medium hover:underline" style={{ color: '#2563EB' }}>
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link to="/" className="transition-colors hover:text-gray-900" style={{ color: '#6B7280' }}>
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
