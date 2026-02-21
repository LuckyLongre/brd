import Storage from './storage';

const DEMO_EMAIL = 'test@example.com';
const DEMO_PASSWORD = '123456';

function login(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
                const user = {
                    id: 'user_demo_123',
                    email,
                    name: 'Demo User',
                    createdAt: new Date().toISOString(),
                };
                Storage.set(Storage.KEYS.AUTH_USER, user);
                Storage.set(Storage.KEYS.AUTH_TOKEN, 'demo_token_' + Date.now());
                Storage.set(Storage.KEYS.CURRENT_USER_ID, user.id);
                resolve(user);
            } else {
                reject(new Error('Invalid email or password. Please use the demo credentials.'));
            }
        }, 1500);
    });
}

function logout() {
    Storage.remove(Storage.KEYS.AUTH_USER);
    Storage.remove(Storage.KEYS.AUTH_TOKEN);
    Storage.remove(Storage.KEYS.CURRENT_USER_ID);
}

function isAuthenticated() {
    return Storage.has(Storage.KEYS.AUTH_TOKEN) && Storage.has(Storage.KEYS.AUTH_USER);
}

function getCurrentUser() {
    return Storage.get(Storage.KEYS.AUTH_USER);
}

const Auth = { login, logout, isAuthenticated, getCurrentUser, DEMO_EMAIL, DEMO_PASSWORD };
export default Auth;
