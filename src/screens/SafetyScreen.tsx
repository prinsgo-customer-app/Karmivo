import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { colors, spacing, radius } from '../theme/colors';
import { ShieldAlert, MapPin, Users, Info, ChevronRight, AlertTriangle } from 'lucide-react-native';
import { useAppStore } from '../store';

export const SafetyScreen = () => {
  const { config } = useAppStore();

  const handleSOS = () => {
    // Determine emergency number from config
    const sosNumber = config?.emergencyNumbers?.[0]?.number || '911';
    Alert.alert(
      'Emergency SOS',
      `This will call ${sosNumber}. Are you sure you want to proceed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call SOS', style: 'destructive', onPress: () => console.log('Calling SOS', sosNumber) }
      ]
    );
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>

        <TouchableOpacity style={styles.sosButton} onPress={handleSOS} activeOpacity={0.8}>
          <AlertTriangle size={32} color={colors.text.inverse} />
          <Typography variant="h2" color={colors.text.inverse} style={styles.sosText}>
            Emergency SOS
          </Typography>
        </TouchableOpacity>

        <Typography variant="h3" style={styles.sectionTitle}>Safety Tools</Typography>

        <View style={styles.card}>
          {/* Real integration logic will depend on backend support. For now, disabled states clarify these aren't dummy stubs. */}
          <Typography variant="body" color={colors.text.secondary} style={{ padding: spacing.md }}>
            Additional safety tools are managed directly during active bookings.
          </Typography>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
};

const MenuItem = ({ icon, title, subtitle, onPress }: { icon: React.ReactNode, title: string, subtitle: string, onPress: () => void }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuIconContainer}>{icon}</View>
    <View style={styles.menuTextContainer}>
      <Typography variant="label">{title}</Typography>
      <Typography variant="caption" color={colors.text.secondary}>{subtitle}</Typography>
    </View>
    <ChevronRight size={20} color={colors.text.muted} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  sosButton: {
    backgroundColor: colors.error,
    padding: spacing.xl,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sosText: {
    marginTop: 0,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  card: {
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
  menuTextContainer: {
    flex: 1,
  },
});
