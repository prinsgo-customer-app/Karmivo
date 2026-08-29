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

// Mechanism to prevent multiple simultaneous refresh requests
let refreshPromise: Promise<string | null> | null = null;

// Response interceptor for handling common errors (timeout, 401, etc.)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.warn('API request timed out (cold start likely):', error.config?.url);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('Unauthorized access. Attempting to refresh token...');

      const authStore = useAuthStore.getState();
      const refreshToken = authStore.refreshToken;

      if (refreshToken) {
        if (!refreshPromise) {
          refreshPromise = (async () => {
            try {
              const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
                refreshToken
              });

              if (response.data?.success) {
                const tokens = response.data.data.tokens;
                const newAccessToken = tokens.accessToken;
                const newRefreshToken = tokens.refreshToken || refreshToken;

                await authStore.setAuth(newAccessToken, newRefreshToken, authStore.user!);
                return newAccessToken;
              }
            } catch (refreshError) {
              console.warn('Token refresh failed. Logging out.');
              authStore.logout();
            } finally {
              refreshPromise = null;
            }
            return null;
          })();
        }

        const newAccessToken = await refreshPromise;
        if (newAccessToken) {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return apiClient(originalRequest);
        }
      } else {
         authStore.logout();
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
