import axios from "axios";

// Determine base URL based on environment
const getBaseURL = () => {
  if (typeof window === 'undefined') return ''; // SSR safety
  
  // Use environment variable if set, otherwise determine based on current host
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // If we're on the production frontend, use production backend
  if (window.location.hostname === 'yugaai.vercel.app') {
    return 'https://yuga-ai-backend-mvp.onrender.com/api';
  }
  
  // Default to local development
  return 'http://localhost:5000/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to handle auth tokens
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/auth?mode=login';
    }
    return Promise.reject(error);
  }
);

// Enhanced API request function with better error handling
export const apiRequest = async (endpoint: string, method: string = "GET", body?: any) => {
  try {
    const response = await api({
      url: endpoint,
      method,
      data: body,
    });
    
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      statusText: response.statusText,
      json: async () => response.data
    };
  } catch (error: any) {
    console.error("API request failed:", error);
    
    // Create a mock response object to maintain compatibility
    const errorResponse = {
      ok: false,
      status: error.response?.status || 500,
      statusText: error.response?.statusText || "Network Error",
      json: async () => ({ 
        error: error.response?.data?.error || error.message,
        details: error.response?.data?.details || ''
      }),
    };
    
    return errorResponse;
  }
};

export const API_BASE_URL = getBaseURL();
