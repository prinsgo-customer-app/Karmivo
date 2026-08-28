import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { useAuthStore, useAppStore } from '../store';
import apiClient from '../api/client';
import { colors, spacing, radius } from '../theme/colors';

export const LoginScreen = ({ navigation }: any) => {
  const { setAuth } = useAuthStore();
  const { config } = useAppStore();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If backend CMS config disables OTP, we'd adapt here. For now, defaulting to standard flow
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
      setIsOtpSent(true);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter a valid OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/api/v1/auth/verify-otp', { mobile, otp });
      if (response.data?.success) {
        setAuth(response.data.data.token, response.data.data.user);
        navigation.replace('MainTabs');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      if (errorMessage.toLowerCase().includes('not found') || errorMessage.toLowerCase().includes('register first')) {
        setNeedsRegistration(true);
      } else {
        Alert.alert('Verification Failed', errorMessage || 'Invalid OTP');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!firstName.trim()) {
      Alert.alert('Required', 'Please enter your first name.');
      return;
    }

    setIsLoading(true);
    try {
      const registerResponse = await apiClient.post('/api/v1/auth/register', {
        mobile,
        firstName,
        lastName
      });

      if (registerResponse.data?.success) {
        setAuth(registerResponse.data.data.token, registerResponse.data.data.user);
        navigation.replace('MainTabs');
      }
    } catch (regErr: any) {
      Alert.alert('Registration Failed', regErr.response?.data?.message || 'Could not register user.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography variant="h1" color={colors.primary}>
            Welcome to Karmivo
          </Typography>
          <Typography variant="body" color={colors.text.secondary} style={styles.subtitle}>
            Enter your mobile number to get started.
          </Typography>
        </View>

        {!isOtpSent ? (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
              maxLength={15}
            />
            <Button
              title="Send OTP"
              onPress={handleSendOtp}
              isLoading={isLoading}
              disabled={!otpEnabled}
            />
            {!otpEnabled && (
              <Typography variant="caption" color={colors.error} style={{ marginTop: spacing.sm }}>
                OTP Login is currently disabled by admin.
              </Typography>
            )}
          </View>
        ) : needsRegistration ? (
          <View style={styles.form}>
            <Typography variant="label" style={styles.otpLabel}>
              Create Account
            </Typography>
            <TextInput
              style={styles.input}
              placeholder="First Name *"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
            />
            <Button
              title="Register & Login"
              onPress={handleRegister}
              isLoading={isLoading}
            />
            <Button
              title="Back"
              variant="ghost"
              onPress={() => setNeedsRegistration(false)}
              style={{ marginTop: spacing.md }}
              disabled={isLoading}
            />
          </View>
        ) : (
          <View style={styles.form}>
            <Typography variant="label" style={styles.otpLabel}>
              Enter OTP sent to {mobile}
            </Typography>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
              maxLength={6}
            />
            <Button
              title="Verify & Login"
              onPress={handleVerifyOtp}
              isLoading={isLoading}
            />
            <Button
              title="Back"
              variant="ghost"
              onPress={() => setIsOtpSent(false)}
              style={{ marginTop: spacing.md }}
              disabled={isLoading}
            />
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
    marginBottom: spacing.xxl,
  },
  subtitle: {
    marginTop: spacing.sm,
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
  otpLabel: {
    marginBottom: spacing.sm,
  },
});
