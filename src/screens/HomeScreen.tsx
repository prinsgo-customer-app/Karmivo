import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Image, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { ErrorState } from '../components/ErrorState';
import { useAppStore } from '../store';
import apiClient from '../api/client';
import { Category, Banner } from '../types';
import { colors, spacing, radius } from '../theme/colors';
import { MapPin, Search } from 'lucide-react-native';

export const HomeScreen = ({ navigation }: any) => {
  const { config } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchHomeData = async () => {
    try {
      setError(false);

      const [bannerRes, categoryRes] = await Promise.all([
        apiClient.get('/api/v1/home/banners'),
        apiClient.get('/api/v1/categories')
      ]);

      if (bannerRes.data?.success) setBanners(bannerRes.data.data);
      if (categoryRes.data?.success) setCategories(categoryRes.data.data);

    } catch (err) {
      console.warn('Home fetch error:', err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeData();
  };

  if (error && !banners.length && !categories.length) {
    return (
      <ScreenWrapper>
        <ErrorState onRetry={fetchHomeData} fullScreen />
      </ScreenWrapper>
    );
  }

  // Dynamic layout sections driven by Admin CMS config if present, fallback to defaults
  const sections = config?.homeSections || ['header', 'search', 'banners', 'categories'];

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'header':
        return (
          <View key="header" style={styles.header}>
            <View style={styles.locationContainer}>
              <MapPin size={20} color={colors.primary} />
              <View style={styles.locationTextContainer}>
                <Typography variant="label">Current Location</Typography>
                <Typography variant="caption" color={colors.text.secondary}>Finding your location...</Typography>
              </View>
            </View>
          </View>
        );
      case 'search':
        return (
          <TouchableOpacity key="search" style={styles.searchBar} activeOpacity={0.8}>
            <Search size={20} color={colors.text.secondary} />
            <Typography variant="body" color={colors.text.secondary} style={styles.searchText}>
              Search for services...
            </Typography>
          </TouchableOpacity>
        );
      case 'banners':
        if (!banners.length) return null;
        return (
          <View key="banners" style={styles.bannerContainer}>
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
              {banners.map((b) => (
                <View key={b.id} style={styles.bannerWrapper}>
                  {b.imageUrl ? (
                    <Image source={{ uri: b.imageUrl }} style={styles.bannerImage} />
                  ) : (
                    <View style={[styles.bannerImage, styles.bannerPlaceholder]}>
                      <Typography variant="h3">{b.title || 'Special Offer'}</Typography>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        );
      case 'categories':
        if (!categories.length) return null;
        return (
          <View key="categories" style={styles.categoriesContainer}>
            <Typography variant="h3" style={styles.sectionTitle}>Services</Typography>
            <View style={styles.categoryGrid}>
              {categories.map((c) => (
                <TouchableOpacity key={c.id} style={styles.categoryCard}>
                  <View style={styles.categoryIconPlaceholder}>
                    {c.imageUrl && <Image source={{ uri: c.imageUrl }} style={styles.categoryImage} />}
                  </View>
                  <Typography variant="caption" align="center" style={styles.categoryName}>
                    {c.name}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {sections.map(renderSection)}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  locationTextContainer: {},
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
  bannerContainer: {
    height: 160,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  bannerWrapper: {
    width: 350, // simplified fixed width for MVP scroll
    height: 160,
    paddingRight: spacing.sm,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: radius.md,
  },
  bannerPlaceholder: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {},
  sectionTitle: {
    marginBottom: spacing.md,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '22%',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryIconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: radius.round,
    backgroundColor: colors.surface,
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    lineHeight: 14,
  },
});
