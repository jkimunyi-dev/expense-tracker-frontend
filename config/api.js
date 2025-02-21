// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://54.226.1.246:3001',
  ENDPOINTS: {
    LOGIN: '/api/auth/login',
    EXPENSES: '/api/expenses',
  }
};