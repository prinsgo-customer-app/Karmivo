import React from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { useAuthStore } from '../store';
import { colors, spacing, radius } from '../theme/colors';
import {
  UserCircle,
  Settings,
  HelpCircle,
  FileText,
  MapPin,
  Star,
  ShieldAlert,
  Globe,
  Gift,
  ChevronRight
} from 'lucide-react-native';

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
          <Typography variant="h3" style={styles.sectionTitle}>Account</Typography>
          <View style={styles.menuCard}>
            <MenuItem
              icon={<UserCircle size={24} color={colors.text.primary} />}
              title="Personal Information"
              onPress={() => navigation.navigate('Settings')}
            />
            <MenuItem
              icon={<MapPin size={24} color={colors.text.primary} />}
              title="Saved Addresses"
              onPress={() => navigation.navigate('Addresses')}
            />
            <MenuItem
              icon={<Gift size={24} color={colors.text.primary} />}
              title="Refer & Earn"
              onPress={() => navigation.navigate('Referral')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>Preferences</Typography>
          <View style={styles.menuCard}>
            <MenuItem
              icon={<Star size={24} color={colors.text.primary} />}
              title="My Reviews"
              onPress={() => navigation.navigate('Reviews')}
            />
            <MenuItem
              icon={<Globe size={24} color={colors.text.primary} />}
              title="Language"
              onPress={() => navigation.navigate('Language')}
            />
            <MenuItem
              icon={<Settings size={24} color={colors.text.primary} />}
              title="Settings"
              onPress={() => navigation.navigate('Settings')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>Support & Safety</Typography>
          <View style={styles.menuCard}>
            <MenuItem
              icon={<ShieldAlert size={24} color={colors.text.primary} />}
              title="Safety & Emergency"
              onPress={() => navigation.navigate('Safety')}
            />
            <MenuItem
              icon={<HelpCircle size={24} color={colors.text.primary} />}
              title="Help & Support"
              onPress={() => navigation.navigate('HelpCenter')}
            />
          </View>
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
    <ChevronRight size={20} color={colors.text.muted} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  name: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
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
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  logoutButton: {
    borderColor: colors.error,
  }
});
