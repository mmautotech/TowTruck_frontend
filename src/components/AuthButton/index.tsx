import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from './styles';

type Props = {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
};

export default function AuthButton({ title, onPress, disabled, loading }: Props) {
    return (
        <TouchableOpacity
            style={[styles.button, disabled && styles.buttonDisabled]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={styles.text}>{loading ? 'Loading...' : title}</Text>
        </TouchableOpacity>
    );
}
