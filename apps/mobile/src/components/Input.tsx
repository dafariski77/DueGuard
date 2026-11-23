import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  KeyboardTypeOptions,
} from 'react-native';
import { theme } from '../theme/theme.js';

export interface InputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  onChangeText?: (text: string) => void;
  style?: ViewStyle;
  testID?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  onChangeText,
  style,
  testID,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        testID={testID || 'text-input'}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.light.text.muted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        style={[
          styles.input,
          error ? styles.inputError : null,
        ]}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.space[3],
  },
  label: {
    fontSize: theme.typography.captionMd.fontSize,
    lineHeight: theme.typography.captionMd.lineHeight,
    fontWeight: theme.typography.captionMd.fontWeight,
    color: theme.colors.light.text.secondary,
    marginBottom: theme.space[1],
  },
  input: {
    minHeight: 44,
    backgroundColor: theme.colors.light.bg.surfaceSubtle,
    borderWidth: 1,
    borderColor: theme.colors.light.border.subtle,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.space[3],
    fontSize: theme.typography.bodyMd.fontSize,
    color: theme.colors.light.text.primary,
  },
  inputError: {
    borderColor: theme.colors.light.status.criticalText,
    backgroundColor: theme.colors.light.status.criticalBg,
  },
  errorText: {
    fontSize: theme.typography.captionSm.fontSize,
    color: theme.colors.light.status.criticalText,
    marginTop: theme.space[1],
  },
});
