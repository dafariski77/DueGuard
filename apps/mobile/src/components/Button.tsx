import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../theme/theme.js';

export interface ButtonProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onPress,
  style,
  testID,
}) => {
  const minHeight = size === 'lg' ? 52 : 44;

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    if (disabled) {
      return {
        container: {
          backgroundColor: theme.colors.light.bg.surfaceSubtle,
          borderColor: theme.colors.light.border.subtle,
        },
        text: { color: theme.colors.light.text.muted },
      };
    }

    switch (variant) {
      case 'secondary':
        return {
          container: {
            backgroundColor: theme.colors.light.brand.primarySoft,
            borderColor: 'transparent',
          },
          text: { color: theme.colors.light.brand.primary },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          },
          text: { color: theme.colors.light.text.secondary },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: theme.colors.light.status.criticalBg,
            borderColor: 'transparent',
          },
          text: { color: theme.colors.light.status.criticalText },
        };
      case 'primary':
      default:
        return {
          container: {
            backgroundColor: theme.colors.light.brand.primary,
            borderColor: 'transparent',
          },
          text: { color: '#FFFFFF' },
        };
    }
  };

  const { container: variantContainer, text: variantText } = getVariantStyles();

  return (
    <Pressable
      testID={testID || 'button'}
      disabled={disabled || loading}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      style={({ pressed }) => [
        styles.base,
        { minHeight },
        variantContainer,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantText.color}
          testID="button-loading-indicator"
        />
      ) : (
        <Text style={[styles.text, variantText]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.space[4],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  text: {
    fontSize: theme.typography.bodyLg.fontSize,
    lineHeight: theme.typography.bodyLg.lineHeight,
    fontWeight: theme.typography.bodyLg.fontWeight,
    textAlign: 'center',
  },
});
