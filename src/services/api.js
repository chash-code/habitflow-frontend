import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const signupAPI = (data) => API.post('/auth/signup', data);
export const loginAPI = (data) => API.post('/auth/login', data);
export const logoutAPI = () => API.post('/auth/logout');

// Habits
export const getHabitsAPI = () => API.get('/habits');
export const createHabitAPI = (data) => API.post('/habits', data);
export const updateHabitAPI = (id, data) => API.put(`/habits/${id}`, data);
export const deleteHabitAPI = (id) => API.delete(`/habits/${id}`);

// Logs
export const getLogsAPI = () => API.get('/logs');
export const logHabitAPI = (data) => API.post('/logs', data);
export const deleteLogAPI = (id) => API.delete(`/logs/${id}`);
