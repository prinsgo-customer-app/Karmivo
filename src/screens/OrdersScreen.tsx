import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { ErrorState } from '../components/ErrorState';
import apiClient from '../api/client';
import { Order } from '../types';
import { colors, spacing, radius } from '../theme/colors';
import { ChevronRight } from 'lucide-react-native';

export const OrdersScreen = ({ navigation }: any) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchOrders = async () => {
    try {
      setError(false);
      const res = await apiClient.get('/api/v1/orders');
      if (res.data?.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (error && !orders.length) {
    return (
      <ScreenWrapper>
        <ErrorState onRetry={fetchOrders} fullScreen />
      </ScreenWrapper>
    );
  }

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Typography variant="label">Order #{item.id.slice(0, 8).toUpperCase()}</Typography>
          <View style={styles.statusBadge}>
            <Typography variant="caption" color={colors.primary}>{item.status}</Typography>
          </View>
        </View>
        <Typography variant="body" color={colors.text.secondary} style={styles.date}>
          {new Date(item.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="label">₹{item.finalAmount}</Typography>
      </View>
      <ChevronRight size={20} color={colors.text.muted} />
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <FlatList
        contentContainerStyle={styles.container}
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchOrders} />}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Typography color={colors.text.secondary}>No orders found.</Typography>
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
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statusBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  date: {
    marginBottom: spacing.sm,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.xxl,
  }
});
