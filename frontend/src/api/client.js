// OlympiadHub API Client
const API_BASE = '/api';

export const apiClient = {
  getToken() {
    return localStorage.getItem('olympiadhub_token');
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('olympiadhub_token', token);
    } else {
      localStorage.removeItem('olympiadhub_token');
    }
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      const data = await response.json().catch(() => ({
        success: false,
        message: 'Invalid JSON response from server'
      }));

      if (!response.ok) {
        if (response.status === 401 && !endpoint.includes('/auth/login')) {
          this.setToken(null);
          localStorage.removeItem('olympiadhub_user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login?expired=1';
          }
        }
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  get(endpoint, params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request(`${endpoint}${queryString}`, { method: 'GET' });
  },

  post(endpoint, body = {}) {
    const isFormData = body instanceof FormData;
    return this.request(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body)
    });
  },

  put(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};
