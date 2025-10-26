import axios from "axios";

// Dynamic base URL based on environment
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use relative URL for production, localhost for development
    if (window.location.hostname === 'yugaai.app' || window.location.hostname === '66.116.198.191') {
      return '/api'; // Relative URL for same domain
    } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    } else {
      // For other environments, use relative URL
      return '/api';
    }
  }
  // Server-side: default to production
  return '/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 30000,
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

// Dynamic API base URL
export const API_BASE_URL = getBaseURL();