import { theme } from '../theme/theme.js';

export interface ButtonProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onPress,
}: ButtonProps) {
  const minHeight = size === 'lg' ? 52 : 44;

  let backgroundColor = theme.colors.light.brand.primary;
  let textColor = '#FFFFFF';

  if (variant === 'secondary') {
    backgroundColor = theme.colors.light.brand.primarySoft;
    textColor = theme.colors.light.brand.primary;
  } else if (variant === 'ghost') {
    backgroundColor = 'transparent';
    textColor = theme.colors.light.text.secondary;
  } else if (variant === 'danger') {
    backgroundColor = theme.colors.light.status.criticalBg;
    textColor = theme.colors.light.status.criticalText;
  }

  if (disabled) {
    backgroundColor = theme.colors.light.bg.surfaceSubtle;
    textColor = theme.colors.light.text.muted;
  }

  return {
    type: 'Button' as const,
    title,
    minHeight,
    disabled,
    loading,
    onPress,
    style: {
      backgroundColor,
      textColor,
      borderRadius: theme.radius.md,
      minHeight,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.space[4],
    },
  };
}
