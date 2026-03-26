import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials:true 
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const apiService = {
  // Auth
  signup: async (email, password, displayName) => {
    const response = await api.post('/auth/signup', { email, password, displayName });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  // Accounts
  getAccounts: async (userId) => {
    const response = await api.get(`/accounts/${userId}`);
    return response.data;
  },

  createAccount: async (accountData) => {
    const response = await api.post('/accounts', accountData);
    return response.data;
  },

  updateAccount: async (id, data) => {
    const response = await api.patch(`/accounts/${id}`, data);
    return response.data;
  },

  // Trades
  getTrades: async (accountId) => {
    const response = await api.get(`/trades/${accountId}`);
    return response.data;
  },

  createTrade: async (tradeData) => {
    const response = await api.post('/trades', tradeData);
    return response.data;
  },

  updateTrade: async (id, data) => {
    const response = await api.patch(`/trades/${id}`, data);
    return response.data;
  },

  // Withdrawals
  getWithdrawals: async (userId) => {
    const response = await api.get(`/withdrawals/${userId}`);
    return response.data;
  },

  createWithdrawal: async (withdrawalData) => {
    const response = await api.post('/withdrawals', withdrawalData);
    return response.data;
  },
};
