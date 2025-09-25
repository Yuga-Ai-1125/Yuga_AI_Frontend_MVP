import axios from "axios";

// Use your Render backend URL
const API_BASE_URL = "https://yuga-ai-backend-mvp.onrender.com/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
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

export { API_BASE_URL };

// Add interceptors for better debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 Making API request to: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response received: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error);
    
    // Provide better error messages
    if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
      error.message = 'Cannot connect to backend server. Please check if the server is running.';
    } else if (error.response?.status === 502) {
      error.message = 'Backend server is temporarily unavailable. Please try again later.';
    }
    
    return Promise.reject(error);
  }
);
