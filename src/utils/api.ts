import axios from "axios";

// Base URL for deployed backend
export const api = axios.create({
  baseURL: "https://yuga-ai-backend-mvp.onrender.com/api",
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
      json: async () => response.data,
    };
  } catch (error: any) {
    console.error("API request failed:", error);
    
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

export const API_BASE_URL = "https://yuga-ai-backend-mvp.onrender.com/api";
