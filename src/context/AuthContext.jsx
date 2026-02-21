import { createContext, useContext, useState, useCallback } from 'react';
import Auth from '../utils/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => Auth.getCurrentUser());

    const login = useCallback(async (email, password) => {
        const loggedInUser = await Auth.login(email, password);
        setUser(loggedInUser);
        return loggedInUser;
    }, []);

    const logout = useCallback(() => {
        Auth.logout();
        setUser(null);
    }, []);

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
