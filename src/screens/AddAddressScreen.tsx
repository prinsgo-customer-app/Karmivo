import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { MapPicker } from '../components/MapPicker';
import apiClient from '../api/client';
import { colors, spacing, radius } from '../theme/colors';

export const AddAddressScreen = ({ navigation }: any) => {
  const [type, setType] = useState<'HOME' | 'WORK' | 'OTHER'>('HOME');
  const [fullAddress, setFullAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!fullAddress || !city || !stateName || !pincode) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        type,
        fullAddress,
        landmark,
        city,
        state: stateName,
        pincode,
        isDefault: false
      };

      const res = await apiClient.post('/api/v1/user/addresses', payload);

      if (res.data?.success) {
        Alert.alert('Success', 'Address saved successfully.', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        throw new Error(res.data?.message || 'Failed to save address.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Typography variant="label" style={styles.label}>Address Type</Typography>
          <View style={styles.typeRow}>
            {['HOME', 'WORK', 'OTHER'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.typeButton, type === t && styles.typeButtonActive]}
                onPress={() => setType(t as any)}
                activeOpacity={0.8}
              >
                <Typography
                  variant="label"
                  color={type === t ? colors.primary : colors.text.secondary}
                >
                  {t}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Typography variant="label" style={styles.label}>Pin Location</Typography>
          <MapPicker onLocationSelected={(address) => {
            if (!fullAddress) setFullAddress(address);
          }} />
        </View>

        <View style={styles.card}>
          <Typography variant="label" style={styles.label}>Full Address *</Typography>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="House/Flat No., Building Name, Street..."
            value={fullAddress}
            onChangeText={setFullAddress}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.card}>
          <Typography variant="label" style={styles.label}>Landmark (Optional)</Typography>
          <TextInput
            style={styles.input}
            placeholder="E.g. Near Apollo Hospital"
            value={landmark}
            onChangeText={setLandmark}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.card, styles.flexHalf]}>
            <Typography variant="label" style={styles.label}>City *</Typography>
            <TextInput
              style={styles.input}
              placeholder="City"
              value={city}
              onChangeText={setCity}
            />
          </View>
          <View style={[styles.card, styles.flexHalf]}>
            <Typography variant="label" style={styles.label}>Pincode *</Typography>
            <TextInput
              style={styles.input}
              placeholder="Pincode"
              keyboardType="number-pad"
              maxLength={6}
              value={pincode}
              onChangeText={setPincode}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Typography variant="label" style={styles.label}>State *</Typography>
          <TextInput
            style={styles.input}
            placeholder="State"
            value={stateName}
            onChangeText={setStateName}
          />
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Save Address"
          onPress={handleSave}
          isLoading={loading}
          style={styles.saveButton}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flexHalf: {
    flex: 1,
  },
  label: {
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.background,
    fontSize: 16,
    color: colors.text.primary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.round,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  typeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    width: '100%',
  },
});
