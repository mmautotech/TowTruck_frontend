// src/components/AuthInput/index.tsx

import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { colors, typography } from '../../theme';
import styles from './styles';

type Props = {
  label?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  // now allows all RN keyboardType values
  keyboardType?: 'default' | 'phone-pad' | 'numeric' | 'email-address';
  // allows controlling autoCapitalize
  autoCapitalize?: TextInputProps['autoCapitalize'];
};

export default function AuthInput({
  label,
  placeholder,
  value,
  onChange,
  keyboardType = 'default',
  autoCapitalize = 'sentences',    // default RN behaviour
}: Props) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}
