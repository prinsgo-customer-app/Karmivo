import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { ErrorState } from '../components/ErrorState';
import { colors, spacing, radius } from '../theme/colors';
import { Gift, Copy, Share2 } from 'lucide-react-native';
import { useAppStore, useAuthStore } from '../store';

export const ReferralScreen = () => {
  const { config } = useAppStore();

  const { user } = useAuthStore();
  const referralEnabled = config?.features?.referral !== false;

  const referralCode = user?.id ? `KARMI${user.id.slice(0, 4).toUpperCase()}` : 'KARMI2024';
  const rewardAmount = config?.referralRewardAmount ? `₹${config.referralRewardAmount}` : '₹50';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Use my code ${referralCode} to sign up on Karmivo and get ${rewardAmount} in your wallet!`,
      });
    } catch (error) {
      console.log('Error sharing code', error);
    }
  };

  if (!referralEnabled) {
    return (
      <ScreenWrapper>
        <ErrorState
          title="Feature Disabled"
          message="The Refer & Earn program is currently paused."
          fullScreen
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.heroContainer}>
          <View style={styles.iconCircle}>
            <Gift size={48} color={colors.primary} />
          </View>
          <Typography variant="h2" align="center" style={styles.heroTitle}>
            Refer & Earn {rewardAmount}
          </Typography>
          <Typography variant="body" color={colors.text.secondary} align="center" style={styles.heroSubtitle}>
            Invite your friends to Karmivo. They get {rewardAmount} off their first booking, and you get {rewardAmount} in your wallet!
          </Typography>
        </View>

        <View style={styles.codeCard}>
          <Typography variant="label" color={colors.text.secondary} style={styles.codeLabel}>
            Your Referral Code
          </Typography>
          <View style={styles.codeRow}>
            <Typography variant="h1" style={styles.codeText}>{referralCode}</Typography>
            <TouchableOpacity style={styles.copyButton}>
              <Copy size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="Share Code"
          onPress={handleShare}
          style={styles.shareButton}
          // @ts-ignore - Assuming icon prop might not be explicitly typed in our simple Button, but if we need an icon we'll just leave it out to be safe with TypeScript.
          // We'll stick to the title prop for now based on our Button implementation.
        />

        <View style={styles.termsContainer}>
          <Typography variant="h3" style={styles.termsTitle}>How it works</Typography>

          <View style={styles.stepRow}>
            <View style={styles.stepNumber}><Typography variant="caption" color={colors.text.inverse}>1</Typography></View>
            <Typography variant="body" style={styles.stepText}>Share your code with friends</Typography>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepNumber}><Typography variant="caption" color={colors.text.inverse}>2</Typography></View>
            <Typography variant="body" style={styles.stepText}>Friend signs up using your code</Typography>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepNumber}><Typography variant="caption" color={colors.text.inverse}>3</Typography></View>
            <Typography variant="body" style={styles.stepText}>You both get {rewardAmount} in your wallets after their first completed service</Typography>
          </View>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: radius.round,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  heroTitle: {
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    paddingHorizontal: spacing.md,
  },
  codeCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  codeLabel: {
    marginBottom: spacing.sm,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  codeText: {
    letterSpacing: 2,
    color: colors.primary,
  },
  copyButton: {
    padding: spacing.sm,
  },
  shareButton: {
    marginBottom: spacing.xxl,
  },
  termsContainer: {
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  termsTitle: {
    marginBottom: spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: radius.round,
    backgroundColor: colors.text.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepText: {
    flex: 1,
    color: colors.text.secondary,
  }
});
