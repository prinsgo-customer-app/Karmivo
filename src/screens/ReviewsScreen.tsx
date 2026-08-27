import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { ErrorState } from '../components/ErrorState';
import apiClient from '../api/client';
import { Review, Order } from '../types';
import { colors, spacing, radius } from '../theme/colors';
import { Star, MessageSquare } from 'lucide-react-native';

export const ReviewsScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<'to_review' | 'your_reviews'>('to_review');
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchReviewsData = async () => {
    try {
      setError(false);
      const [pendingRes, reviewsRes] = await Promise.all([
        apiClient.get('/api/v1/orders?status=COMPLETED&reviewed=false').catch(() => null),
        apiClient.get('/api/v1/user/reviews').catch(() => null)
      ]);

      if (pendingRes?.data?.success) setPendingOrders(pendingRes.data.data);
      if (reviewsRes?.data?.success) setReviews(reviewsRes.data.data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsData();
  }, []);

  if (error && !pendingOrders.length && !reviews.length) {
    return (
      <ScreenWrapper>
        <ErrorState onRetry={fetchReviewsData} fullScreen />
      </ScreenWrapper>
    );
  }

  const renderPendingOrder = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Typography variant="label">Order #{item.id.slice(0, 8).toUpperCase()}</Typography>
        <Typography variant="caption" color={colors.text.secondary}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Typography>
      </View>
      <TouchableOpacity
        style={styles.reviewButton}
        onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
      >
        <Typography variant="label" color={colors.primary}>Write a Review</Typography>
      </TouchableOpacity>
    </View>
  );

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              color={star <= item.rating ? colors.warning : colors.border}
              fill={star <= item.rating ? colors.warning : 'transparent'}
            />
          ))}
        </View>
        <Typography variant="caption" color={colors.text.secondary}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Typography>
      </View>
      {item.comment ? (
        <Typography variant="body" color={colors.text.secondary} style={styles.comment}>
          "{item.comment}"
        </Typography>
      ) : null}
    </View>
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'to_review' && styles.activeTab]}
            onPress={() => setActiveTab('to_review')}
          >
            <Typography variant="label" color={activeTab === 'to_review' ? colors.primary : colors.text.secondary}>To Review</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'your_reviews' && styles.activeTab]}
            onPress={() => setActiveTab('your_reviews')}
          >
            <Typography variant="label" color={activeTab === 'your_reviews' ? colors.primary : colors.text.secondary}>Your Reviews</Typography>
          </TouchableOpacity>
        </View>

        {activeTab === 'to_review' ? (
          <FlatList
            data={pendingOrders}
            keyExtractor={(item) => item.id}
            renderItem={renderPendingOrder}
            contentContainerStyle={styles.listContainer}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchReviewsData} tintColor={colors.primary} />}
            ListEmptyComponent={
              !loading ? (
                <View style={styles.emptyState}>
                  <MessageSquare size={48} color={colors.text.muted} style={{ marginBottom: spacing.md }} />
                  <Typography variant="h3" style={{ marginBottom: spacing.sm }}>No pending reviews</Typography>
                  <Typography variant="body" color={colors.text.secondary} align="center">
                    You don't have any completed services waiting for a review.
                  </Typography>
                </View>
              ) : null
            }
          />
        ) : (
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id}
            renderItem={renderReview}
            contentContainerStyle={styles.listContainer}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchReviewsData} tintColor={colors.primary} />}
            ListEmptyComponent={
              !loading ? (
                <View style={styles.emptyState}>
                  <MessageSquare size={48} color={colors.text.muted} style={{ marginBottom: spacing.md }} />
                  <Typography variant="h3" style={{ marginBottom: spacing.sm }}>No reviews yet</Typography>
                  <Typography variant="body" color={colors.text.secondary} align="center">
                    You haven't submitted any reviews for completed services yet.
                  </Typography>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  listContainer: {
    padding: spacing.md,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 2,
  },
  comment: {
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  reviewButton: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.xxl * 2,
  }
});
