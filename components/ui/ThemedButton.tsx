import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { ThemedText } from '../ThemedText';

export type ThemedButtonProps = {
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  style?: StyleProp<ViewStyle>;
  textStyle?: any;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  testID?: string;
};

export function ThemedButton({
  type = 'primary',
  style,
  textStyle,
  onPress,
  disabled = false,
  loading = false,
  children,
  testID,
}: ThemedButtonProps) {
  const { theme } = useTheme();

  // Map type to theme color
  const getButtonColor = () => {
    switch (type) {
      case 'primary':
        return theme.colors.button;
      case 'secondary':
        return theme.colors.secondary;
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.button;
    }
  };

  const backgroundColor = getButtonColor();
  const textColor = theme.colors.buttonText;
  const opacity = disabled ? 0.5 : 1;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, opacity },
        style,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || loading}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <ThemedText style={[styles.text, { color: textColor }, textStyle]}>{children}</ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    marginVertical: 4,
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    // Optionally, you can add a grayscale or overlay effect
  },
}); 