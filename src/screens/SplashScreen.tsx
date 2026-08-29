import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { ErrorState } from '../components/ErrorState';
import { useAppStore, useAuthStore } from '../store';
import apiClient from '../api/client';
import { colors, spacing } from '../theme/colors';

// We mock navigation prop generically here for simplicity
export const SplashScreen = ({ navigation }: any) => {
  const { setConfig, setConfigLoading, setBackendAvailable } = useAppStore();
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const [error, setError] = useState<boolean>(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  const initApp = async () => {
    try {
      setError(false);
      setConfigLoading(true);

      // Ping backend configuration
      const response = await apiClient.get('/api/v1/config');

      if (response.data && response.data.success) {
        setConfig(response.data.data);
        setBackendAvailable(true);
        await initializeAuth();

        // --- TEMPORARY TEST MODE START ---
        if (__DEV__ && process.env.EXPO_PUBLIC_TEST_MODE === 'true' && !useAuthStore.getState().isAuthenticated) {
          const testToken = process.env.EXPO_PUBLIC_TEST_TOKEN;
          if (testToken && testToken !== 'dummy-token') {
             const testUser = {
               id: '60d5ecb54cb7c133c8b45678',
               role: '60d5ecb54cb7c133c8b45679', // valid ObjectId format to avoid casting errors
               mobile: '9999999999',
               firstName: 'Test Customer',
               status: 'ACTIVE'
             } as any; // Cast as any because type expects literal 'CUSTOMER' | 'PARTNER' | 'ADMIN'
             await useAuthStore.getState().setAuth(testToken, 'test-refresh-token', testUser);
          } else {
            try {
              let authResponse;
              try {
                authResponse = await apiClient.post('/api/v1/auth/register', {
                  mobile: '9999999999',
                  phone: '9999999999',
                  firstName: 'Test',
                  lastName: 'Customer',
                  password: 'password',
                  otp: '123456'
                });
              } catch (registerErr: any) {
                const isUserExists = registerErr.response?.data?.errorCode === 'USER_EXISTS' || registerErr.response?.status === 409 || registerErr.response?.data?.message?.toLowerCase()?.includes('already exists');
                if (isUserExists) {
                  authResponse = await apiClient.post('/api/v1/auth/verify-otp', { mobile: '9999999999', otp: '123456' });
                } else {
                  throw registerErr;
                }
              }

              if (authResponse?.data?.success) {
                const tokens = authResponse.data.data.tokens || {};
                const accessToken = tokens.accessToken || authResponse.data.data.token;
                const refreshToken = tokens.refreshToken || null;
                await useAuthStore.getState().setAuth(accessToken, refreshToken, authResponse.data.data.user);
              }
            } catch (authError) {
              console.warn('Test mode backend authentication failed:', authError);
            }
          }
        }
        // --- TEMPORARY TEST MODE END ---

        setAuthInitialized(true);
      } else {
        throw new Error('Invalid config response');
      }
    } catch (err: any) {
      console.warn('Splash initialization error:', err.message);
      setBackendAvailable(false);
      setError(true);
      setConfigLoading(false);
    }
  };

  useEffect(() => {
    initApp();
  }, []);

  useEffect(() => {
    if (authInitialized) {
      setTimeout(() => {
        if (isAuthenticated) {
          navigation.replace('MainTabs');
        } else {
          navigation.replace('Login');
        }
      }, 1000);
    }
  }, [authInitialized, isAuthenticated]);

  if (error) {
    return (
      <ScreenWrapper fullScreen>
        <ErrorState
          title="Service Unavailable"
          message="We couldn't connect to Karmivo servers. Please check your internet connection and try again."
          onRetry={initApp}
          fullScreen
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper backgroundColor={colors.primary} style={styles.container}>
      <View style={styles.content}>
        <Typography variant="h1" color={colors.text.inverse} style={styles.brand}>
          KARMIVO
        </Typography>
        <Typography variant="body" color={colors.text.inverse} style={styles.tagline}>
          One Platform. Every Service.
        </Typography>

        <ActivityIndicator color={colors.text.inverse} size="large" style={styles.loader} />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  brand: {
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  tagline: {
    opacity: 0.8,
  },
  loader: {
    marginTop: spacing.xxl,
  },
});
