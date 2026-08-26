import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '../store';

// For this project, we must read from the EXPO environment config (or fallback if missing in build)
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://karmivo-backend.onrender.com';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 seconds robust timeout for cold starts on backend
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for injecting auth token dynamically from Zustand
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // dynamically get the token to ensure it's always up to date
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors (timeout, 401, etc.)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.warn('API request timed out (cold start likely):', error.config?.url);
    }
    if (error.response?.status === 401) {
      console.warn('Unauthorized access. Token expired.');
      // Handle logout/session expiry here securely
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
