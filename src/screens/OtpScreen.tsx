import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { useAuthStore } from '../store';
import apiClient from '../api/client';
import { colors, spacing, radius } from '../theme/colors';

export const OtpScreen = ({ navigation, route }: any) => {
  const { setAuth } = useAuthStore();
  const mobile = route.params?.mobile || '';
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isRegistering, setIsRegistering] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleRegister = async () => {
    if (!firstName.trim()) {
      Alert.alert('Validation Error', 'First name is required.');
      return;
    }
    if (!otp || otp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit code.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/api/v1/auth/register', {
        mobile,
        phone: mobile,
        otp,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password: 'password', // As required by standard payload
        role: 'CUSTOMER'
      });
      if (response.data?.success) {
        const tokens = response.data.data.tokens || {};
        const accessToken = tokens.accessToken || response.data.data.token;
        const refreshToken = tokens.refreshToken || null;
        setAuth(accessToken, refreshToken, response.data.data.user);
        navigation.replace('MainTabs');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration Failed. Please try again.';
      Alert.alert('Registration Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit code.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/api/v1/auth/verify-otp', { mobile, otp });
      if (response.data?.success) {
        const tokens = response.data.data.tokens || {};
        const accessToken = tokens.accessToken || response.data.data.token;
        const refreshToken = tokens.refreshToken || null;
        setAuth(accessToken, refreshToken, response.data.data.user);
        navigation.replace('MainTabs');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || '';
      if (
        errorMessage.toLowerCase().includes('not found') ||
        err.response?.status === 404
      ) {
        setIsRegistering(true);
      } else {
        Alert.alert('Verification Failed', errorMessage || 'Invalid OTP');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setIsLoading(true);
    try {
      await apiClient.post('/api/v1/auth/send-otp', { mobile });
      setCountdown(30);
      Alert.alert('Success', 'OTP has been resent.');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography variant="h1" color={colors.primary}>
            {isRegistering ? 'Register' : 'Verify OTP'}
          </Typography>
          <Typography variant="body" color={colors.text.secondary} style={styles.subtitle}>
            Enter 6 digit code sent to
          </Typography>
          <Typography variant="label" style={styles.mobileText}>
            {mobile}
          </Typography>
        </View>

        <View style={styles.form}>
          {isRegistering && (
            <View style={styles.registerContainer}>
              <TextInput
                style={[styles.input, styles.textInput]}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
              <TextInput
                style={[styles.input, styles.textInput]}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.otpContainer}>
             <TextInput
              style={styles.input}
              placeholder="Enter 6-digit OTP"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
              maxLength={6}
              textAlign="center"
            />
          </View>

          <Button
            title={isRegistering ? "Complete Registration" : "Verify OTP"}
            onPress={isRegistering ? handleRegister : handleVerifyOtp}
            isLoading={isLoading}
          />

          {!isRegistering && (
            <View style={styles.manualRegisterContainer}>
              <Typography variant="body" color={colors.text.secondary}>
                New User?{' '}
              </Typography>
              <TouchableOpacity onPress={() => setIsRegistering(true)}>
                <Typography variant="label" color={colors.primary}>Sign Up / Register</Typography>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.resendContainer}>
            <Typography variant="body" color={colors.text.secondary}>
              {countdown > 0 ? `Resend code in ${countdown}s` : "Didn't receive code? "}
            </Typography>
            {countdown === 0 && (
              <TouchableOpacity onPress={handleResendOtp} disabled={isLoading}>
                <Typography variant="label" color={colors.primary}>Resend</Typography>
              </TouchableOpacity>
            )}
          </View>
        </View>
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
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: spacing.md,
  },
  mobileText: {
    marginTop: spacing.xs,
    fontSize: 16,
  },
  form: {
    gap: spacing.lg,
  },
  otpContainer: {
    alignItems: 'center',
  },
  input: {
    height: 56,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: 24,
    letterSpacing: 8,
    color: colors.text.primary,
    backgroundColor: colors.surface,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  registerContainer: {
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  textInput: {
    letterSpacing: 0,
    fontSize: 16,
    textAlign: 'left',
  },
  manualRegisterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
});
