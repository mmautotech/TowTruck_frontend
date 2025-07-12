import React, { forwardRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TextInput as RNTextInput,
} from 'react-native';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  disabled?: boolean;
} & TextInputProps;

const LabeledTextInput = forwardRef<RNTextInput, Props>(
  (
    {
      label,
      value,
      onChangeText,
      placeholder = '',
      error = '',
      keyboardType = 'default',
      autoCapitalize = 'sentences',
      disabled = false,
      ...rest
    },
    ref
  ) => {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          editable={!disabled}
          style={[
            styles.input,
            error ? styles.inputError : null,
            disabled ? { backgroundColor: '#f0f0f0', color: '#888' } : null,
          ]}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          {...rest}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }
);

export default LabeledTextInput;


const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#e00',
  },
  errorText: {
    fontSize: 12,
    color: '#e00',
    marginTop: 4,
  },
});
