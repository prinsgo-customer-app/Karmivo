import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { ErrorState } from '../components/ErrorState';
import apiClient from '../api/client';
import { Address } from '../types';
import { colors, spacing, radius } from '../theme/colors';
import { MapPin, Plus, MoreVertical } from 'lucide-react-native';

export const AddressesScreen = ({ navigation }: any) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchAddresses = async () => {
    try {
      setError(false);
      setLoading(true);
      const res = await apiClient.get('/api/v1/user/addresses');
      if (res.data?.success) {
        setAddresses(res.data.data);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = () => {
    navigation.navigate('AddAddress');
  };

  const handleAddressOptions = (id: string) => {
    Alert.alert('Address Options', 'Edit or Delete address options would appear here.');
  };

  if (error && !addresses.length) {
    return (
      <ScreenWrapper>
        <ErrorState onRetry={fetchAddresses} fullScreen />
      </ScreenWrapper>
    );
  }

  const renderAddress = ({ item }: { item: Address }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.typeContainer}>
          <MapPin size={16} color={colors.primary} />
          <Typography variant="label" style={styles.typeText}>{item.type}</Typography>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Typography variant="caption" color={colors.primary}>Default</Typography>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={() => handleAddressOptions(item.id)}>
          <MoreVertical size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>
      <Typography variant="body" color={colors.text.secondary}>
        {item.fullAddress}
        {item.landmark ? `, ${item.landmark}` : ''}
        {`\n${item.city}, ${item.state} - ${item.pincode}`}
      </Typography>
    </View>
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          renderItem={renderAddress}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchAddresses} tintColor={colors.primary} />}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyState}>
                <MapPin size={48} color={colors.text.muted} style={{ marginBottom: spacing.md }} />
                <Typography variant="h3" style={{ marginBottom: spacing.sm }}>No Saved Addresses</Typography>
                <Typography variant="body" color={colors.text.secondary} align="center">
                  You haven't saved any addresses yet. Add one to make booking faster.
                </Typography>
              </View>
            ) : null
          }
        />

        <View style={styles.footer}>
          <Button
            title="Add New Address"
            onPress={handleAddAddress}
            style={styles.addButton}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: spacing.sm,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  typeText: {
    textTransform: 'capitalize',
  },
  defaultBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginLeft: spacing.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.xxl * 2,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  addButton: {
    width: '100%',
  }
});
