import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { ErrorState } from '../components/ErrorState';
import apiClient from '../api/client';
import { Category, Service } from '../types';
import { colors, spacing, radius } from '../theme/colors';
import { Search, ChevronRight } from 'lucide-react-native';

export const ServicesScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const fetchServicesData = async () => {
    try {
      setError(false);

      const [categoryRes, servicesRes] = await Promise.all([
        apiClient.get('/api/v1/categories'),
        apiClient.get('/api/v1/services')
      ]);

      if (categoryRes.data?.success) setCategories(categoryRes.data.data);
      if (servicesRes.data?.success) setServices(servicesRes.data.data);

    } catch (err) {
      console.warn('Services fetch error:', err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchServicesData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchServicesData();
  };

  if (loading && !refreshing) {
    return (
      <ScreenWrapper>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Typography>Loading services...</Typography>
        </View>
      </ScreenWrapper>
    );
  }

  if (error && !categories?.length && !services?.length) {
    return (
      <ScreenWrapper>
        <ErrorState onRetry={fetchServicesData} fullScreen />
      </ScreenWrapper>
    );
  }

  const filteredServices = selectedCategoryId
    ? services.filter(s => s.categoryId === selectedCategoryId)
    : services;

  const renderService = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ServiceDetails', { serviceId: item.id })}
    >
      <View style={styles.serviceImageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.serviceImage} />
        ) : (
          <View style={styles.serviceImagePlaceholder} />
        )}
      </View>
      <View style={styles.serviceInfo}>
        <Typography variant="h3">{item.name}</Typography>
        <Typography variant="caption" color={colors.text.secondary} numberOfLines={2}>
          {item.description || 'No description available'}
        </Typography>
      </View>
      <ChevronRight size={20} color={colors.text.muted} />
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
          <Search size={20} color={colors.text.secondary} />
          <Typography variant="body" color={colors.text.secondary} style={styles.searchText}>
            Search services...
          </Typography>
        </TouchableOpacity>
      </View>

      <View style={styles.chipsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          <TouchableOpacity
            style={[styles.chip, !selectedCategoryId && styles.chipActive]}
            onPress={() => setSelectedCategoryId(null)}
          >
            <Typography
              variant="label"
              color={!selectedCategoryId ? colors.primary : colors.text.primary}
            >
              All
            </Typography>
          </TouchableOpacity>
          {categories?.map(c => (
            <TouchableOpacity
              key={c.id}
              style={[styles.chip, selectedCategoryId === c.id && styles.chipActive]}
              onPress={() => setSelectedCategoryId(c.id)}
            >
              <Typography
                variant="label"
                color={selectedCategoryId === c.id ? colors.primary : colors.text.primary}
              >
                {c.name}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredServices}
        keyExtractor={item => item.id}
        renderItem={renderService}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Typography color={colors.text.secondary}>No services found.</Typography>
            </View>
          ) : null
        }
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  searchText: {
    flex: 1,
  },
  chipsContainer: {
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chipsScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.round,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  listContainer: {
    padding: spacing.md,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceImageContainer: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginRight: spacing.md,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  serviceImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface,
  },
  serviceInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
});
