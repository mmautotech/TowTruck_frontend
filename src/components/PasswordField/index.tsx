// components/PasswordField/index.tsx

import React from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native';
import { colors, typography, spacing } from '../../theme';
import { wp, hp } from '../../utils/responsive';

type Props = {
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    secure: boolean;
    toggleSecure: () => void;
};

export default function PasswordField({
    placeholder,
    value,
    onChange,
    secure,
    toggleSecure,
}: Props) {
    return (
        <View style={styles.container}>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={colors.placeholder}
                value={value}
                onChangeText={onChange}
                secureTextEntry={secure}
                autoCapitalize="none"
                style={styles.input}
            />
            <TouchableOpacity style={styles.eyeButton} onPress={toggleSecure}>
                <Text style={styles.eyeText}>{secure ? 'Show' : 'Hide'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
        marginBottom: hp(1.5),
    },
    input: {
        width: '100%',
        paddingVertical: hp(1),
        paddingHorizontal: spacing.md,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: spacing.sm,
        fontSize: typography.body,
        color: colors.text,
        backgroundColor: '#fff',
    },
    eyeButton: {
        position: 'absolute',
        right: spacing.md,
        top: hp(1.3),
        padding: spacing.xs,
    },
    eyeText: {
        fontSize: typography.small,
        color: colors.primary,
    },
});
