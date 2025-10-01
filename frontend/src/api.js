import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

export const createReminder = (data) => axios.post(`${API_BASE}/reminders`, data).then(r => r.data);
export const getReminders = (email) => axios.get(`${API_BASE}/reminders`, { params: { email } }).then(r => r.data);
export const saveSubscription = (subscription, userEmail) => axios.post(`${API_BASE}/subscriptions`, { subscription, userEmail }).then(r => r.data);
