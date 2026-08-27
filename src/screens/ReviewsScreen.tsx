import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { colors, spacing, radius } from '../theme/colors';
import { Star, MessageSquare } from 'lucide-react-native';

export const ReviewsScreen = () => {
  const [activeTab, setActiveTab] = useState<'to_review' | 'your_reviews'>('to_review');
  const [reviews, setReviews] = useState<any[]>([]); // Stub data for now

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

        <FlatList
          data={reviews}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => null}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MessageSquare size={48} color={colors.text.muted} style={{ marginBottom: spacing.md }} />
              <Typography variant="h3" style={{ marginBottom: spacing.sm }}>
                {activeTab === 'to_review' ? 'No pending reviews' : 'No reviews yet'}
              </Typography>
              <Typography variant="body" color={colors.text.secondary} align="center">
                {activeTab === 'to_review'
                  ? "You don't have any completed services waiting for a review."
                  : "You haven't submitted any reviews for completed services yet."}
              </Typography>
            </View>
          }
        />
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.xxl * 2,
  }
});
