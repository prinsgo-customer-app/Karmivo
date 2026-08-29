import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { colors, spacing, radius } from '../theme/colors';
import { Check } from 'lucide-react-native';
import { useTranslation } from '../utils/i18n';

const LANGUAGES = [
  { id: 'en', name: 'English', nativeName: 'English' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { id: 'mr', name: 'Marathi', nativeName: 'मराठी' },
];

export const LanguageScreen = ({ navigation }: any) => {
  const { language, setLanguage } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'mr'>(language);

  const handleSave = () => {
    setLanguage(selectedLanguage);
    navigation.goBack();
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Typography variant="body" color={colors.text.secondary} style={styles.description}>
          Select your preferred language. This will change the text used throughout the application.
        </Typography>

        <View style={styles.card}>
          {LANGUAGES?.map((lang, index) => {
            const isSelected = selectedLanguage === lang.id;
            return (
              <TouchableOpacity
                key={lang.id}
                style={[
                  styles.languageItem,
                  index === LANGUAGES.length - 1 && { borderBottomWidth: 0 }
                ]}
                onPress={() => setSelectedLanguage(lang.id as 'en' | 'hi' | 'mr')}
                activeOpacity={0.7}
              >
                <View style={styles.languageTextContainer}>
                  <Typography variant="label" style={styles.nativeName}>{lang.nativeName}</Typography>
                  <Typography variant="caption" color={colors.text.secondary}>{lang.name}</Typography>
                </View>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <Check size={14} color={colors.text.inverse} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Button title="Apply Changes" onPress={handleSave} />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  description: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  languageTextContainer: {
    flex: 1,
  },
  nativeName: {
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: radius.round,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  }
});
