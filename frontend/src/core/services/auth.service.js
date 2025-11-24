import api from './api';

const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.success) {
      api.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    return response;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.success) {
      api.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    return response;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      api.clearTokens();
    }
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/refresh-token', { refreshToken });
    if (response.success) {
      api.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    return response;
  },

  async getProfile() {
    return api.get('/auth/me');
  },

  isAuthenticated() {
    return !!api.getToken();
  },
};

export default authService;
