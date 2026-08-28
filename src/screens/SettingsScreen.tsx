import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { useAuthStore } from '../store';
import { colors, spacing, radius } from '../theme/colors';

export const SettingsScreen = () => {
  const { user, logout } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Ideally trigger API delete here
            Alert.alert('Account Deleted', 'Your account has been permanently removed.');
            logout();
          }
        }
      ]
    );
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>Preferences</Typography>

          <View style={styles.settingRow}>
            <Typography variant="body">Push Notifications</Typography>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ true: colors.primary, false: colors.border }}
            />
          </View>

          <View style={styles.settingRow}>
            <Typography variant="body">Dark Mode (Coming Soon)</Typography>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              disabled
              trackColor={{ true: colors.primary, false: colors.border }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>Account</Typography>

          <View style={styles.infoRow}>
            <Typography variant="label">Mobile</Typography>
            <Typography variant="body" color={colors.text.secondary}>{user?.mobile || 'N/A'}</Typography>
          </View>

          <Button
            title="Delete Account"
            variant="ghost"
            onPress={handleDeleteAccount}
            style={styles.deleteButton}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.xl,
  },
  section: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  deleteButton: {
    marginTop: spacing.md,
    borderColor: colors.error,
  }
});
