import { theme } from '../theme/theme.js';

export interface InputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  onChangeText?: (text: string) => void;
}

export function Input({
  label,
  value,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  onChangeText,
}: InputProps) {
  return {
    type: 'Input' as const,
    label,
    value,
    placeholder,
    error,
    secureTextEntry,
    keyboardType,
    onChangeText,
    style: {
      backgroundColor: theme.colors.light.bg.surfaceSubtle,
      borderColor: error ? theme.colors.light.status.criticalText : theme.colors.light.border.subtle,
      borderRadius: theme.radius.sm,
      minHeight: 44,
      paddingHorizontal: theme.space[3],
      textColor: theme.colors.light.text.primary,
    },
  };
}
