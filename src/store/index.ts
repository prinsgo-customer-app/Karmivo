import { create } from 'zustand';
import { User, AppConfig } from '../types';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (token: string, refreshToken: string | null, user: User) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true, // initial load state
  setAuth: async (token, refreshToken, user) => {
    try {
      await SecureStore.setItemAsync('auth_token', token);
      if (refreshToken) {
        await SecureStore.setItemAsync('refresh_token', refreshToken);
      }
      await SecureStore.setItemAsync('auth_user', JSON.stringify(user));
      set({ token, refreshToken, user, isAuthenticated: true, isLoading: false });
    } catch (e) {
      console.warn('Failed to save auth to secure store', e);
      // Fallback state if SecureStore fails
      set({ token, refreshToken, user, isAuthenticated: true, isLoading: false });
    }
  },
  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('refresh_token');
      await SecureStore.deleteItemAsync('auth_user');
    } catch (e) {
      console.warn('Failed to delete auth from secure store', e);
    } finally {
      set({ token: null, refreshToken: null, user: null, isAuthenticated: false, isLoading: false });
    }
  },
  setLoading: (loading) => set({ isLoading: loading }),
  initializeAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      const userStr = await SecureStore.getItemAsync('auth_user');

      if (token && userStr) {
        set({ token, refreshToken, user: JSON.parse(userStr), isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      console.warn('Failed to initialize auth from secure store', e);
      set({ isLoading: false });
    }
  },
}));

interface AppState {
  config: AppConfig | null;
  isConfigLoading: boolean;
  isBackendAvailable: boolean;
  setConfig: (config: AppConfig) => void;
  setConfigLoading: (loading: boolean) => void;
  setBackendAvailable: (available: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  config: null,
  isConfigLoading: true,
  isBackendAvailable: true,
  setConfig: (config) => set({ config, isConfigLoading: false }),
  setConfigLoading: (loading) => set({ isConfigLoading: loading }),
  setBackendAvailable: (available) => set({ isBackendAvailable: available }),
}));
