import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://127.0.0.1:5000';

async function login(username, password) {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (data.token) {
        await AsyncStorage.setItem('authToken', data.token);
        return data.token;
    } else {
        throw new Error(data.error || 'Login failed');
    }
}

async function registerUser(username, password) {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (data.status) {
        return true; // Registration success
    } else {
        throw new Error(data.error || 'Registration failed');
    }
}

async function getToken() {
    return await AsyncStorage.getItem('authToken');
}

async function logout() {
    await AsyncStorage.removeItem('authToken');
}

export default {
    login,
    registerUser,
    getToken,
    logout
};
