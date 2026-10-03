import mockEngine from './mockEngine';

// OlympiadHub API Client
const API_BASE = '/api';

export const apiClient = {
  getToken() {
    return sessionStorage.getItem('olympiadhub_token') || 
           localStorage.getItem('olympiadhub_token') || 
           localStorage.getItem('token') || 
           sessionStorage.getItem('token');
  },

  setToken(token) {
    if (token) {
      sessionStorage.setItem('olympiadhub_token', token);
      localStorage.setItem('olympiadhub_token', token);
      localStorage.setItem('token', token);
    } else {
      sessionStorage.removeItem('olympiadhub_token');
      localStorage.removeItem('olympiadhub_token');
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
  },

  async request(endpoint, options = {}) {
    const method = options.method || 'GET';
    let body = {};
    if (options.body) {
      try {
        body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      } catch (e) {
        body = options.body;
      }
    }

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
      const data = await response.json().catch(() => null);

      if (response.ok && data) {
        return data;
      }

      // If backend responded with 401 on expired session
      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        this.setToken(null);
        sessionStorage.removeItem('olympiadhub_user');
        localStorage.removeItem('olympiadhub_user');
      }

      // Fallback to client mock engine if API returned error/HTML
      return mockEngine.handleRequest(method, endpoint, body);
    } catch (networkError) {
      // Fallback for Vercel / serverless / offline environment
      return mockEngine.handleRequest(method, endpoint, body);
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

export default apiClient;
