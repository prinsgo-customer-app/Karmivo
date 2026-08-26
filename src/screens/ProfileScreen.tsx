import React from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { useAuthStore } from '../store';
import { colors, spacing, radius } from '../theme/colors';
import { UserCircle, Settings, HelpCircle, FileText, LogOut } from 'lucide-react-native';

export const ProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          // Adjust for stack nav reset behavior
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
      }
    ]);
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.header}>
          <UserCircle size={80} color={colors.text.secondary} />
          <Typography variant="h2" style={styles.name}>
            {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Guest User'}
          </Typography>
          <Typography variant="body" color={colors.text.secondary}>
            {user?.mobile || '+1 234 567 8900'}
          </Typography>
        </View>

        <View style={styles.section}>
          <MenuItem
            icon={<Settings size={24} color={colors.text.primary} />}
            title="Account Settings"
            onPress={() => navigation.navigate('Settings')}
          />
          <MenuItem
            icon={<FileText size={24} color={colors.text.primary} />}
            title="Orders History"
            onPress={() => navigation.navigate('Orders')} // or jump to tab depending on config
          />
          <MenuItem
            icon={<HelpCircle size={24} color={colors.text.primary} />}
            title="Help Center"
            onPress={() => navigation.navigate('HelpCenter')}
          />
        </View>

        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            variant="outline"
            onPress={handleLogout}
            style={styles.logoutButton}
          />
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
};

const MenuItem = ({ icon, title, onPress }: { icon: React.ReactNode, title: string, onPress: () => void }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuIconContainer}>{icon}</View>
    <Typography variant="label" style={styles.menuTitle}>{title}</Typography>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    marginTop: spacing.xl,
  },
  name: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIconContainer: {
    marginRight: spacing.md,
  },
  menuTitle: {
    flex: 1,
  },
  logoutContainer: {
    marginTop: spacing.xl,
  },
  logoutButton: {
    borderColor: colors.error,
  }
});
