// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://54.226.1.246:3001',
  ENDPOINTS: {
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    EXPENSES: '/api/expenses',
  }
};

// API utility functions
export const api = {
  fetch: async (endpoint, options = {}) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  },

  // Auth endpoints
  auth: {
    signup: (userData) => api.fetch(API_CONFIG.ENDPOINTS.SIGNUP, {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

    login: (credentials) => api.fetch(API_CONFIG.ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  },

  // Expense endpoints
  expenses: {
    getAll: () => api.fetch(API_CONFIG.ENDPOINTS.EXPENSES),
    
    create: (expense) => api.fetch(API_CONFIG.ENDPOINTS.EXPENSES, {
      method: 'POST',
      body: JSON.stringify(expense),
    }),
    
    update: (id, expense) => api.fetch(`${API_CONFIG.ENDPOINTS.EXPENSES}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    }),
    
    delete: (id) => api.fetch(`${API_CONFIG.ENDPOINTS.EXPENSES}/${id}`, {
      method: 'DELETE',
    }),
  },
};
