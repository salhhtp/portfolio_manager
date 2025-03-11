import AuthService from './AuthService';

const API_BASE_URL = 'http://127.0.0.1:5000';

async function getRecommendation(tickers, period, budget) {
    const token = await AuthService.getToken();
    const response = await fetch(`${API_BASE_URL}/api/portfolio`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ tickers, period, budget })
    });
    const data = await response.json();
    if (data.recommendation) {
        return data;
    } else {
        throw new Error(data.error || 'Failed to fetch recommendation');
    }
}

async function getHistory() {
    const token = await AuthService.getToken();
    const response = await fetch(`${API_BASE_URL}/api/get_history`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const data = await response.json();
    if (data.history) {
        return data.history;
    } else {
        throw new Error(data.error || 'Failed to load history');
    }
}

export default {
    getRecommendation,
    getHistory
};
