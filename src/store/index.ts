import { create } from 'zustand';
import { User, AppConfig } from '../types';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true, // initial load state
  setAuth: async (token, user) => {
    try {
      await SecureStore.setItemAsync('auth_token', token);
      await SecureStore.setItemAsync('auth_user', JSON.stringify(user));
      set({ token, user, isAuthenticated: true, isLoading: false });
    } catch (e) {
      console.warn('Failed to save auth to secure store');
    }
  },
  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('auth_user');
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    } catch (e) {
      console.warn('Failed to delete auth from secure store');
    }
  },
  setLoading: (loading) => set({ isLoading: loading }),
  initializeAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const userStr = await SecureStore.getItemAsync('auth_user');

      if (token && userStr) {
        set({ token, user: JSON.parse(userStr), isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
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
