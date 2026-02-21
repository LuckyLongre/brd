/**
 * storage.js
 * LocalStorage wrapper for managing application data
 */

const KEYS = {
    AUTH_USER: 'auth_user',
    AUTH_TOKEN: 'auth_token',
    USER_PROJECTS: 'user_projects',
    PROJECT_PREFIX: 'project_',
    CURRENT_USER_ID: 'current_user_id',
};

function get(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error getting ${key} from storage:`, error);
        return null;
    }
}

function set(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error setting ${key} in storage:`, error);
    }
}

function remove(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing ${key} from storage:`, error);
    }
}

function has(key) {
    return localStorage.getItem(key) !== null;
}

function clear() {
    try {
        localStorage.clear();
    } catch (error) {
        console.error('Error clearing storage:', error);
    }
}

const Storage = { get, set, remove, has, clear, KEYS };
export default Storage;
