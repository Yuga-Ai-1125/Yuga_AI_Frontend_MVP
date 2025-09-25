import axios from "axios";

// Determine base URL based on environment
const getBaseURL = () => {
  // Use Render URL for production, localhost for development
  return process.env.NODE_ENV === 'production' 
    ? "https://yuga-ai-backend-mvp.onrender.com/api"
    : "http://localhost:5000/api";
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enhanced API request function with better error handling
export const apiRequest = async (endpoint: string, method: string = "GET", body?: any) => {
  try {
    const response = await api({
      url: endpoint,
      method,
      data: body,
      withCredentials: true,
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

// Optional: Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Optional: Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    // Handle specific error cases
    if (error.code === 'ECONNREFUSED') {
      error.message = 'Unable to connect to server. Please check your connection.';
    } else if (error.code === 'NETWORK_ERROR') {
      error.message = 'Network error. Please check your internet connection.';
    } else if (error.response?.status === 502) {
      error.message = 'Server is temporarily unavailable. Please try again later.';
    }
    
    return Promise.reject(error);
  }
);
