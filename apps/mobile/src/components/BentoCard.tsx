import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme/theme.js';

export interface BentoCardProps {
  variant?: 'standard' | 'hero' | 'highlight';
  onPress?: () => void;
  children?: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  variant = 'standard',
  onPress,
  children,
  style,
  testID,
}) => {
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'hero':
        return {
          backgroundColor: theme.colors.light.brand.primarySoft,
          borderColor: theme.colors.light.brand.primary,
        };
      case 'highlight':
        return {
          backgroundColor: theme.colors.light.bg.surface,
          borderColor: theme.colors.light.brand.primary,
        };
      case 'standard':
      default:
        return {
          backgroundColor: theme.colors.light.bg.surface,
          borderColor: theme.colors.light.border.subtle,
        };
    }
  };

  const cardStyle = [styles.card, getVariantStyles(), style];

  if (onPress) {
    return (
      <Pressable
        testID={testID || 'bento-card-pressable'}
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          pressed && styles.pressed,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View testID={testID || 'bento-card'} style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.lg,
    padding: theme.space[4],
    borderWidth: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.995 }],
  },
});
