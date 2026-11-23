import { getUrgencyTokens, theme } from '../theme/theme.js';

export interface CountdownBadgeProps {
  daysRemaining: number;
  isDark?: boolean;
}

export function CountdownBadge({ daysRemaining, isDark = false }: CountdownBadgeProps) {
  const tokens = getUrgencyTokens(daysRemaining, isDark);

  return {
    type: 'CountdownBadge' as const,
    label: tokens.label,
    level: tokens.level,
    style: {
      backgroundColor: tokens.bg,
      textColor: tokens.text,
      borderRadius: theme.radius.sm,
      paddingVertical: theme.space[1],
      paddingHorizontal: theme.space[2],
    },
  };
}
