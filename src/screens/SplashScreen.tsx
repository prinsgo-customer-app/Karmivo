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

      const configData = response.data?.data || response.data;

      if (configData) {
        setConfig(configData);
        setBackendAvailable(true);
        await initializeAuth();
        setAuthInitialized(true);
      } else {
        throw new Error('Invalid config response');
      }
    } catch (err: any) {
      console.warn('Splash initialization error:', err.message);
      setBackendAvailable(false);

      const { config: cachedConfig } = useAppStore.getState();
      if (cachedConfig) {
        await initializeAuth();
        setAuthInitialized(true);
      } else {
        setError(true);
      }
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
