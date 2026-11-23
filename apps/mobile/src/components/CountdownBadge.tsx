import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getUrgencyTokens, theme } from '../theme/theme.js';

export interface CountdownBadgeProps {
  daysRemaining: number;
  isDark?: boolean;
}

export const CountdownBadge: React.FC<CountdownBadgeProps> = ({
  daysRemaining,
  isDark = false,
}) => {
  const tokens = getUrgencyTokens(daysRemaining, isDark);

  return (
    <View
      testID="countdown-badge"
      style={[
        styles.badge,
        { backgroundColor: tokens.bg },
      ]}
    >
      <Text
        testID="countdown-badge-text"
        style={[
          styles.text,
          { color: tokens.text },
        ]}
      >
        {tokens.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: theme.space[1],
    paddingHorizontal: theme.space[2],
    borderRadius: theme.radius.sm,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: theme.typography.captionSm.fontSize,
    lineHeight: theme.typography.captionSm.lineHeight,
    fontWeight: theme.typography.captionSm.fontWeight,
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.5,
  },
});
