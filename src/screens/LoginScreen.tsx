import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { useAuthStore, useAppStore } from '../store';
import apiClient from '../api/client';
import { colors, spacing, radius } from '../theme/colors';

export const LoginScreen = ({ navigation }: any) => {
  const { config } = useAppStore();
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'mobile' | 'email'>('mobile');

  const otpEnabled = config?.features?.otpLogin !== false;

  const handleSendOtp = async () => {
    if (!mobile || mobile.length < 10) {
      Alert.alert('Invalid Input', 'Please enter a valid mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      // API Call to real backend
      await apiClient.post('/api/v1/auth/send-otp', { mobile });
      navigation.navigate('Otp', { mobile });
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert(
      `${provider} Login`,
      `The native implementation for ${provider} authentication is required but not set up in the standalone project. You would be redirected to the provider's OAuth flow.`
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography variant="h1" color={colors.primary}>
            Welcome Back!
          </Typography>
          <Typography variant="body" color={colors.text.secondary} style={styles.subtitle}>
            Login to continue
          </Typography>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, loginMethod === 'mobile' && styles.activeTab]}
            onPress={() => setLoginMethod('mobile')}
          >
            <Typography variant="label" color={loginMethod === 'mobile' ? colors.primary : colors.text.secondary}>Mobile</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, loginMethod === 'email' && styles.activeTab]}
            onPress={() => setLoginMethod('email')}
          >
            <Typography variant="label" color={loginMethod === 'email' ? colors.primary : colors.text.secondary}>Email</Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {loginMethod === 'mobile' ? (
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
              maxLength={15}
            />
          ) : (
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}

          <Button
            title="Send OTP"
            onPress={handleSendOtp}
            isLoading={isLoading}
            disabled={!otpEnabled && loginMethod === 'mobile'}
          />
          {!otpEnabled && loginMethod === 'mobile' && (
            <Typography variant="caption" color={colors.error} style={{ marginTop: spacing.sm, textAlign: 'center' }}>
              OTP Login is currently disabled by admin.
            </Typography>
          )}
        </View>

        {(config?.features?.googleLogin || config?.features?.facebookLogin) && (
          <View style={styles.socialContainer}>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Typography variant="caption" color={colors.text.secondary} style={{ paddingHorizontal: spacing.sm }}>OR</Typography>
              <View style={styles.divider} />
            </View>

            {config.features.googleLogin && (
              <Button title="Continue with Google" variant="outline" onPress={() => handleSocialLogin('Google')} style={styles.socialButton} />
            )}
            {config.features.facebookLogin && (
              <Button title="Continue with Facebook" variant="outline" onPress={() => handleSocialLogin('Facebook')} style={styles.socialButton} />
            )}
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: spacing.sm,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  form: {
    gap: spacing.md,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.surface,
  },
  socialContainer: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  socialButton: {
    borderColor: colors.border,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xxl,
  }
});
