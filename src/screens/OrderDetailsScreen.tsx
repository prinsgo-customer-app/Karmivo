import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { ErrorState } from '../components/ErrorState';
import apiClient from '../api/client';
import { Order } from '../types';
import { colors, spacing, radius } from '../theme/colors';
import { MapPin, Phone, MessageCircle, Star, FileText, ChevronRight, CheckCircle2, Clock } from 'lucide-react-native';

export const OrderDetailsScreen = ({ route, navigation }: any) => {
  const { orderId } = route.params || {};
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchOrderDetails = async () => {
    if (!orderId) {
      setError(true);
      setLoading(false);
      return;
    }

    try {
      setError(false);
      const res = await apiClient.get(`/api/v1/orders/${orderId}`);
      if (res.data?.success) {
        setOrder(res.data.data);
      } else {
        throw new Error('Failed to fetch order details');
      }
    } catch (err) {
      console.warn('Error fetching order details:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <Typography>Loading...</Typography>
        </View>
      </ScreenWrapper>
    );
  }

  if (error || !order) {
    return (
      <ScreenWrapper>
        <ErrorState onRetry={fetchOrderDetails} fullScreen />
      </ScreenWrapper>
    );
  }

  // Stub data for provider - normally this would come from the order object
  const provider = {
    name: 'Rahul Sharma',
    rating: 4.8,
    phone: '+91 9876543210'
  };

  const handleReorder = () => {
    navigation.navigate('Booking', { serviceId: order.serviceId });
  };

  const handleCall = () => {
    Alert.alert('Call Provider', `Calling ${provider.phone}...`);
  };

  const isCompleted = order.status === 'COMPLETED';

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchOrderDetails} />}
      >

        {/* Status Header */}
        <View style={styles.headerCard}>
          <View style={styles.statusRow}>
            {isCompleted ? (
              <CheckCircle2 size={24} color={colors.success} />
            ) : (
              <Clock size={24} color={colors.warning} />
            )}
            <Typography variant="h3" color={isCompleted ? colors.success : colors.warning}>
              Order {order.status}
            </Typography>
          </View>
          <Typography variant="caption" color={colors.text.secondary}>
            Booking ID: #{order.id.slice(0, 8).toUpperCase()}
          </Typography>
          <Typography variant="caption" color={colors.text.secondary}>
            {new Date(order.createdAt).toLocaleString()}
          </Typography>
        </View>

        {/* Provider Info */}
        {(order.status === 'ASSIGNED' || order.status === 'ACCEPTED' || order.status === 'IN_PROGRESS' || order.status === 'COMPLETED') && (
          <View style={styles.card}>
            <Typography variant="label" style={styles.sectionTitle}>Provider Details</Typography>
            <View style={styles.providerRow}>
              <View style={styles.providerAvatar}>
                <Typography variant="h3" color={colors.text.inverse}>
                  {provider.name.charAt(0)}
                </Typography>
              </View>
              <View style={styles.providerInfo}>
                <Typography variant="label">{provider.name}</Typography>
                <View style={styles.ratingRow}>
                  <Star size={14} color={colors.warning} fill={colors.warning} />
                  <Typography variant="caption" color={colors.text.secondary} style={{ marginLeft: spacing.xs }}>
                    {provider.rating}
                  </Typography>
                </View>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.iconButton} onPress={handleCall}>
                  <Phone size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Service Address */}
        <View style={styles.card}>
          <Typography variant="label" style={styles.sectionTitle}>Service Address</Typography>
          <View style={styles.addressRow}>
            <MapPin size={20} color={colors.text.secondary} style={{ marginTop: 2 }} />
            <Typography variant="body" color={colors.text.secondary} style={styles.addressText}>
              {order.location || 'Home - 123 Main Street, Indore, MP 452001'}
            </Typography>
          </View>
        </View>

        {/* Price Details */}
        <View style={styles.card}>
          <Typography variant="label" style={styles.sectionTitle}>Price Details</Typography>

          <View style={styles.priceRow}>
            <Typography variant="body" color={colors.text.secondary}>Service Charge</Typography>
            <Typography variant="body">₹{order.amount}</Typography>
          </View>

          <View style={styles.priceRow}>
            <Typography variant="body" color={colors.text.secondary}>Tax & Charges</Typography>
            <Typography variant="body">₹{(order.amount * 0.18).toFixed(2)}</Typography>
          </View>

          {order.discount > 0 && (
            <View style={styles.priceRow}>
              <Typography variant="body" color={colors.success}>Discount</Typography>
              <Typography variant="body" color={colors.success}>-₹{order.discount}</Typography>
            </View>
          )}

          <View style={[styles.priceRow, styles.totalRow]}>
            <Typography variant="label">Total Amount</Typography>
            <Typography variant="h3" color={colors.primary}>₹{order.finalAmount}</Typography>
          </View>

          <View style={styles.paymentMethod}>
            <Typography variant="caption" color={colors.text.secondary}>
              Payment Method: <Typography variant="caption" weight="600">Online</Typography>
            </Typography>
          </View>
        </View>

        {/* Footer Actions */}
        <View style={styles.footerActions}>
          {isCompleted && (
            <Button
              title="Reorder Service"
              onPress={handleReorder}
              style={styles.reorderButton}
            />
          )}

          <TouchableOpacity style={styles.invoiceButton}>
            <FileText size={20} color={colors.primary} />
            <Typography variant="label" color={colors.primary}>Download Invoice</Typography>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 48,
    height: 48,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  providerInfo: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.round,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  addressText: {
    flex: 1,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  totalRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: 0,
  },
  paymentMethod: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  footerActions: {
    gap: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  reorderButton: {
    width: '100%',
  },
  invoiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
  }
});
