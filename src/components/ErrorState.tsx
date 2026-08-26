import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { Typography } from './Typography';
import { Button } from './Button';
import { colors, spacing } from '../theme/colors';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We are having trouble reaching the server. Please try again.',
  onRetry,
  fullScreen = false,
}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <AlertCircle size={48} color={colors.error} style={styles.icon} />
      <Typography variant="h3" align="center" style={styles.title}>
        {title}
      </Typography>
      <Typography variant="body" color={colors.text.secondary} align="center" style={styles.message}>
        {message}
      </Typography>
      {onRetry && (
        <Button title="Try Again" onPress={onRetry} variant="primary" style={styles.button} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  icon: {
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
  },
  message: {
    marginBottom: spacing.xl,
  },
  button: {
    minWidth: 150,
  },
});
