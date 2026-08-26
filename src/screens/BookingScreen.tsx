import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TextInput, ActivityIndicator } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { ErrorState } from '../components/ErrorState';
import apiClient from '../api/client';
import { Service } from '../types';
import { colors, spacing, radius } from '../theme/colors';

export const BookingScreen = ({ route, navigation }: any) => {
  const { service } = route.params as { service: Service };

  const [location, setLocation] = useState('');
  const [couponCode, setCouponCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [initialCalcLoading, setInitialCalcLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  // Real price breakdown exclusively fetched from backend
  const [breakdown, setBreakdown] = useState<{
    basePrice: number;
    tax: number;
    discount: number;
    finalAmount: number;
  } | null>(null);

  const fetchBreakdown = async (coupon?: string) => {
    try {
      if (coupon) setCalculating(true);
      else setInitialCalcLoading(true);

      const res = await apiClient.post('/api/v1/orders/calculate', {
        serviceId: service.id,
        couponCode: coupon,
      });

      if (res.data?.success) {
        setBreakdown(res.data.data);
      } else {
        if (coupon) {
          Alert.alert('Invalid Coupon', res.data?.message || 'Coupon not valid.');
        } else {
          throw new Error('Failed to fetch pricing calculation.');
        }
      }
    } catch (err: any) {
      if (!coupon) {
        Alert.alert('Pricing Error', 'Could not load price breakdown from server. Please try again.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Could not apply coupon.');
      }
    } finally {
      setInitialCalcLoading(false);
      setCalculating(false);
    }
  };

  useEffect(() => {
    fetchBreakdown();
  }, []);

  const handleApplyCoupon = () => {
    if (!couponCode) return;
    fetchBreakdown(couponCode);
  };

  const handleConfirmOrder = async () => {
    if (!location) {
      Alert.alert('Location Required', 'Please enter your service location.');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post('/api/v1/orders', {
        serviceId: service.id,
        location,
        couponCode: couponCode || undefined,
      });

      if (response.data?.success) {
        Alert.alert('Order Confirmed!', `Order ID: ${response.data.data.id}`, [
          { text: 'OK', onPress: () => navigation.popToTop() }
        ]);
      } else {
        throw new Error(response.data?.message || 'Failed to place order');
      }
    } catch (err: any) {
      Alert.alert('Order Failed', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialCalcLoading || !breakdown) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Typography style={{ marginTop: spacing.md }}>Calculating pricing securely...</Typography>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Typography variant="h2" style={styles.title}>Confirm Booking</Typography>

        <View style={styles.card}>
          <Typography variant="h3">{service.name}</Typography>
          <Typography variant="body" color={colors.text.secondary}>
            Base Price: ₹{service.price} / {service.pricingUnit}
          </Typography>
        </View>

        <View style={styles.card}>
          <Typography variant="label" style={styles.label}>Service Location</Typography>
          <TextInput
            style={styles.input}
            placeholder="Enter full address..."
            value={location}
            onChangeText={setLocation}
            multiline
          />
        </View>

        <View style={styles.card}>
          <Typography variant="label" style={styles.label}>Coupon Code</Typography>
          <View style={styles.couponRow}>
            <TextInput
              style={[styles.input, styles.couponInput]}
              placeholder="Enter Code"
              value={couponCode}
              onChangeText={setCouponCode}
              autoCapitalize="characters"
            />
            <Button
              title="Apply"
              variant="outline"
              onPress={handleApplyCoupon}
              disabled={calculating || !couponCode}
              isLoading={calculating}
            />
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Typography variant="h3" style={styles.summaryTitle}>Bill Summary</Typography>
          <View style={styles.summaryRow}>
            <Typography variant="body">Item Total</Typography>
            <Typography variant="body">₹{breakdown.basePrice}</Typography>
          </View>
          <View style={styles.summaryRow}>
            <Typography variant="body">Taxes & Fees</Typography>
            <Typography variant="body">₹{breakdown.tax.toFixed(2)}</Typography>
          </View>
          {breakdown.discount > 0 && (
            <View style={styles.summaryRow}>
              <Typography variant="body" color={colors.success}>Discount</Typography>
              <Typography variant="body" color={colors.success}>-₹{breakdown.discount.toFixed(2)}</Typography>
            </View>
          )}
          <View style={[styles.summaryRow, styles.finalRow]}>
            <Typography variant="h3">Final Amount</Typography>
            <Typography variant="h3">₹{breakdown.finalAmount.toFixed(2)}</Typography>
          </View>
        </View>

      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          title="Place Order"
          onPress={handleConfirmOrder}
          isLoading={loading}
          style={styles.confirmButton}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingBottom: 100,
    gap: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  label: {
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    backgroundColor: colors.background,
    minHeight: 48,
  },
  couponRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  couponInput: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.md,
  },
  summaryTitle: {
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  finalRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmButton: {
    width: '100%',
  },
});
