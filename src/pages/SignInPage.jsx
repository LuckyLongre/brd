import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingModal, ErrorModal } from '../components/Modals';

export default function SignInPage() {
    const [email, setEmail] = useState('test@example.com');
    const [password, setPassword] = useState('123456');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-12">
            {loading && <LoadingModal message="Signing in..." />}
            {error && <ErrorModal title="Sign In Failed" message={error} onClose={() => setError(null)} />}

            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold" style={{ color: '#2563EB' }}>BRD Generator</h1>
                    <p className="mt-2" style={{ color: '#6B7280' }}>Sign in to your account</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-sm p-8 border" style={{ borderColor: '#E5E7EB' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#111827' }}>
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="test@example.com"
                                required
                                className="w-full px-4 py-3 rounded-lg border text-sm transition-all duration-200 outline-none"
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
                                className="w-full px-4 py-3 rounded-lg border text-sm transition-all duration-200 outline-none"
                                style={{ borderColor: '#E5E7EB', color: '#111827' }}
                                onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                            />
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
                                Sign In
                            </button>
                        </div>

                        <div className="text-center">
                            <p style={{ color: '#6B7280' }}>
                                Don't have an account?{' '}
                                <Link to="/signup" className="font-medium hover:underline" style={{ color: '#2563EB' }}>
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E5E7EB' }}>
                        <p className="text-sm font-medium mb-1" style={{ color: '#111827' }}>Demo Credentials:</p>
                        <p className="text-sm" style={{ color: '#6B7280' }}>Email: test@example.com</p>
                        <p className="text-sm" style={{ color: '#6B7280' }}>Password: 123456</p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link
                        to="/"
                        className="transition-colors hover:text-gray-900"
                        style={{ color: '#6B7280' }}
                    >
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
