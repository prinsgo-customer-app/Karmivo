import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { ErrorState } from '../components/ErrorState';
import apiClient from '../api/client';
import { colors, spacing, radius } from '../theme/colors';

export const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchNotifications = async () => {
    try {
      setError(false);
      const res = await apiClient.get('/api/v1/notifications');
      if (res.data?.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (error && !notifications.length) {
    return (
      <ScreenWrapper>
        <ErrorState onRetry={fetchNotifications} fullScreen />
      </ScreenWrapper>
    );
  }

  const renderItem = ({ item }: any) => (
    <View style={[styles.card, !item.read && styles.unread]}>
      <Typography variant="label" style={styles.title}>{item.title}</Typography>
      <Typography variant="body" color={colors.text.secondary}>{item.body}</Typography>
      <Typography variant="caption" color={colors.text.secondary} style={styles.date}>
        {new Date(item.createdAt).toLocaleString()}
      </Typography>
    </View>
  );

  return (
    <ScreenWrapper>
      <FlatList
        contentContainerStyle={styles.container}
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchNotifications} />}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Typography color={colors.text.secondary}>No new notifications.</Typography>
            </View>
          ) : null
        }
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  unread: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  title: {
    marginBottom: spacing.xs,
  },
  date: {
    marginTop: spacing.sm,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.xxl,
  }
});
