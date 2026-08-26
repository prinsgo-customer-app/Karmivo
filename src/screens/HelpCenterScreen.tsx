import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Linking } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { ErrorState } from '../components/ErrorState';
import { Button } from '../components/Button';
import apiClient from '../api/client';
import { useAppStore } from '../store';
import { colors, spacing, radius } from '../theme/colors';
import { Phone, Mail, ShieldAlert } from 'lucide-react-native';

export const HelpCenterScreen = () => {
  const { config } = useAppStore();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchFaqs = async () => {
    try {
      setError(false);
      const res = await apiClient.get('/api/v1/content/faq');
      if (res.data?.success) {
        setFaqs(res.data.data);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => console.warn('Cannot open url:', url));
  };

  if (error && !faqs.length) {
    return (
      <ScreenWrapper>
        <ErrorState onRetry={fetchFaqs} fullScreen />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchFaqs} />}
      >
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <ShieldAlert size={24} color={colors.error} />
            <Typography variant="h3" color={colors.error} style={{ marginLeft: spacing.sm }}>
              Safety & Emergency
            </Typography>
          </View>
          <Typography variant="body" color={colors.text.secondary} style={{ marginBottom: spacing.md }}>
            If you are in immediate danger, please contact local authorities.
          </Typography>

          {config?.emergencyNumbers?.map((em: any, index: number) => (
            <Button
              key={index}
              title={`Call ${em.label} (${em.number})`}
              variant="outline"
              onPress={() => openLink(`tel:${em.number}`)}
              style={styles.emergencyBtn}
            />
          ))}
        </View>

        <Typography variant="h3" style={styles.sectionTitle}>Contact Support</Typography>
        <View style={styles.supportRow}>
          {config?.supportPhone && (
            <Button
              title="Call Us"
              variant="outline"
              onPress={() => openLink(`tel:${config.supportPhone}`)}
              style={styles.supportBtn}
            />
          )}
          {config?.supportEmail && (
            <Button
              title="Email Us"
              variant="outline"
              onPress={() => openLink(`mailto:${config.supportEmail}`)}
              style={styles.supportBtn}
            />
          )}
        </View>

        <Typography variant="h3" style={styles.sectionTitle}>Frequently Asked Questions</Typography>

        {faqs.length === 0 ? (
          <View style={styles.emptyState}>
            <Typography color={colors.text.secondary}>No FAQs available at the moment.</Typography>
          </View>
        ) : (
          faqs.map((faq: any) => (
            <View key={faq.id} style={styles.faqCard}>
              <Typography variant="label">{faq.question}</Typography>
              <Typography variant="body" color={colors.text.secondary} style={{ marginTop: spacing.xs }}>
                {faq.answer}
              </Typography>
            </View>
          ))
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  emergencyCard: {
    backgroundColor: '#FFEBEB',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#FFD6D6',
    marginBottom: spacing.xl,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  emergencyBtn: {
    marginBottom: spacing.sm,
    borderColor: colors.error,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  supportRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  supportBtn: {
    flex: 1,
  },
  faqCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  }
});
