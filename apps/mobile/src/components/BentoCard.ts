import { theme } from '../theme/theme.js';

export interface BentoCardProps {
  variant?: 'standard' | 'hero' | 'highlight';
  onPress?: () => void;
  children?: any;
}

export function BentoCard({
  variant = 'standard',
  onPress,
  children,
}: BentoCardProps = {}) {
  let backgroundColor = theme.colors.light.bg.surface;
  let borderColor = theme.colors.light.border.subtle;

  if (variant === 'hero') {
    backgroundColor = theme.colors.light.brand.primarySoft;
    borderColor = theme.colors.light.brand.primary;
  } else if (variant === 'highlight') {
    backgroundColor = theme.colors.light.bg.surface;
    borderColor = theme.colors.light.brand.primary;
  }

  return {
    type: 'BentoCard' as const,
    variant,
    onPress,
    children,
    style: {
      backgroundColor,
      borderColor,
      borderRadius: theme.radius.lg,
      padding: theme.space[4],
      borderWidth: 1,
    },
  };
}
