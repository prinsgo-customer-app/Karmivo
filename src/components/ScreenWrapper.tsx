import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
  useSafeArea?: boolean;
  backgroundColor?: string;
  fullScreen?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  useSafeArea = true,
  backgroundColor = colors.background,
  fullScreen = false,
  style,
  ...props
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
        useSafeArea && !fullScreen && {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
        fullScreen && styles.fullScreen,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreen: {
    // If you need specific full screen styles to override
  }
});
