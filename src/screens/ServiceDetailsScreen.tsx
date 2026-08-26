import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { ErrorState } from '../components/ErrorState';
import apiClient from '../api/client';
import { Service } from '../types';
import { colors, spacing, radius } from '../theme/colors';

export const ServiceDetailsScreen = ({ route, navigation }: any) => {
  const { serviceId } = route.params;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchService = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await apiClient.get(`/api/v1/services/${serviceId}`);
      if (response.data?.success) {
        setService(response.data.data);
      } else {
        throw new Error('Failed to load service');
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  if (error || (!loading && !service)) {
    return (
      <ScreenWrapper>
        <ErrorState onRetry={fetchService} fullScreen />
      </ScreenWrapper>
    );
  }

  if (loading || !service) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <Typography>Loading Service Details...</Typography>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        {service.imageUrl && (
          <Image source={{ uri: service.imageUrl }} style={styles.image} />
        )}

        <View style={styles.content}>
          <Typography variant="h2">{service.name}</Typography>

          <View style={styles.priceRow}>
            <Typography variant="h3" color={colors.primary}>
              ₹{service.price}
            </Typography>
            <Typography variant="body" color={colors.text.secondary}>
              / {service.pricingUnit}
            </Typography>
          </View>

          <Typography variant="body" style={styles.description}>
            {service.description || 'No description available for this service.'}
          </Typography>

          <View style={styles.metaInfo}>
            {service.rating !== undefined && (
              <Typography variant="caption">⭐ {service.rating} ({service.reviewsCount || 0} reviews)</Typography>
            )}
            {service.estimatedTime && (
              <Typography variant="caption">⏱️ {service.estimatedTime}</Typography>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          title="Book Now"
          onPress={() => navigation.navigate('Booking', { service })}
          style={styles.bookButton}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  description: {
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  metaInfo: {
    flexDirection: 'row',
    gap: spacing.lg,
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
  bookButton: {
    width: '100%',
  },
});
