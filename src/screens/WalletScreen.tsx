import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { ErrorState } from '../components/ErrorState';
import apiClient from '../api/client';
import { colors, spacing, radius } from '../theme/colors';
import { useAppStore } from '../store';

export const WalletScreen = () => {
  const { config } = useAppStore();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const walletEnabled = config?.features?.wallet !== false;

  const fetchWallet = async () => {
    try {
      setError(false);
      const res = await apiClient.get('/api/v1/wallet');
      if (res.data?.success) {
        setBalance(res.data.data.balance || 0);
        setTransactions(res.data.data.transactions || []);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletEnabled) fetchWallet();
    else setLoading(false);
  }, [walletEnabled]);

  if (!walletEnabled) {
    return (
      <ScreenWrapper>
        <ErrorState
          title="Feature Disabled"
          message="The Wallet feature is currently disabled by the administrator."
          fullScreen
        />
      </ScreenWrapper>
    );
  }

  if (error && !transactions.length) {
    return (
      <ScreenWrapper>
        <ErrorState onRetry={fetchWallet} fullScreen />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchWallet} />}
      >
        <View style={styles.balanceCard}>
          <Typography variant="body" color={colors.text.inverse}>Available Balance</Typography>
          <Typography variant="h1" color={colors.text.inverse} style={styles.balanceAmount}>
            ₹{balance.toFixed(2)}
          </Typography>
        </View>

        <Typography variant="h3" style={styles.sectionTitle}>Recent Transactions</Typography>

        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Typography color={colors.text.secondary}>No transactions found.</Typography>
          </View>
        ) : (
          transactions.map((t: any) => (
            <View key={t.id} style={styles.txCard}>
              <View>
                <Typography variant="label">{t.type}</Typography>
                <Typography variant="caption" color={colors.text.secondary}>{new Date(t.date).toLocaleDateString()}</Typography>
              </View>
              <Typography variant="label" color={t.amount > 0 ? colors.success : colors.text.primary}>
                {t.amount > 0 ? '+' : ''}₹{t.amount}
              </Typography>
            </View>
          ))
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  balanceCard: {
    backgroundColor: colors.primary,
    padding: spacing.xl,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  balanceAmount: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  txCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  }
});
