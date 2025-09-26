import axios from "axios";

/**
 * Determine base URL based on environment
 * Uses environment variables for flexibility across deployments
 */
const getBaseURL = () => {
  // Server-side rendering safety
  if (typeof window === 'undefined') return '';
  
  // Use environment variable if set (highest priority)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Determine based on current hostname
  const { hostname, protocol } = window.location;
  
  // Production environment - use Render backend
  if (hostname === 'yugaai.vercel.app' || hostname.includes('vercel.app')) {
    return 'https://yuga-ai-backend-mvp.onrender.com/api';
  }
  
  // Staging/development environments
  if (hostname === 'soft-longma-c0dc57.netlify.app') {
    return 'https://yuga-ai-backend-mvp.onrender.com/api';
  }
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // Fallback to current origin
  return `${protocol}//${hostname}${hostname.includes('localhost') ? ':5000' : ''}/api`;
};

// Create axios instance with optimized configuration
export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 45000, // Increased timeout for voice processing
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for auth tokens and headers
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        baseURL: config.baseURL,
        data: config.data
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log successful response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error);
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - backend may be unavailable');
      error.response = {
        status: 0,
        statusText: 'Network Error',
        data: { error: 'Cannot connect to server. Please check your connection.' }
      };
    }
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Use window.location for reliable redirect
      setTimeout(() => {
        window.location.href = '/?auth=login';
      }, 1000);
    }
    
    // Handle CORS errors specifically
    if (error.code === 'ERR_NETWORK' || error.response?.status === 0) {
      console.error('CORS/Network error detected');
      error.response = {
        status: 0,
        statusText: 'CORS/Network Error',
        data: { 
          error: 'Connection failed. Please check if the backend server is running and accessible.',
          details: `Tried to reach: ${error.config?.baseURL}${error.config?.url}`
        }
      };
    }
    
    return Promise.reject(error);
  }
);

/**
 * Enhanced API request function with better error handling and compatibility
 */
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
    
    // Create a standardized error response
    const errorResponse = {
      ok: false,
      status: error.response?.status || 0,
      statusText: error.response?.statusText || "Network Error",
      json: async () => ({ 
        error: error.response?.data?.error || error.message || 'Unknown error occurred',
        details: error.response?.data?.details || '',
        url: `${error.config?.baseURL}${error.config?.url}`
      }),
    };
    
    return errorResponse;
  }
};

// Export base URL for external use
export const API_BASE_URL = getBaseURL();

// Utility function to test backend connection
export const testBackendConnection = async () => {
  try {
    const response = await api.get('/health');
    return {
      connected: true,
      data: response.data,
      url: API_BASE_URL
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
      url: API_BASE_URL
    };
  }
};
