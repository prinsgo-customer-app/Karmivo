import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import { Typography } from './Typography';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  isLoading = false,
  disabled,
  style,
  ...props
}) => {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';

  const backgroundColor = isPrimary ? colors.primary : isOutline || variant === 'ghost' ? 'transparent' : colors.surface;
  const textColor = isPrimary ? colors.text.inverse : colors.text.primary;
  const borderColor = isOutline ? colors.border : 'transparent';

  return (
    <TouchableOpacity
      disabled={disabled || isLoading}
      style={[
        styles.container,
        { backgroundColor, borderColor, borderWidth: isOutline ? 1 : 0 },
        (disabled || isLoading) && styles.disabled,
        style,
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Typography variant="label" color={textColor} weight="600">
          {title}
        </Typography>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.6,
  },
});
