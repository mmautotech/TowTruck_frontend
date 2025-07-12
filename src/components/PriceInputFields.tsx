// components/PriceInputFields.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { wp, hp } from '../utils/responsive';

type Props = {
    price: string;
    onChange: (val: string) => void;
    error?: string;
};

const PriceInputFields: React.FC<Props> = ({ price, onChange, error }) => (
    <View style={styles.container}>
        <Text style={styles.label} allowFontScaling={false}>Offer Price</Text>
        <View style={[styles.wrapper, error && styles.wrapperError]}>
            <Text style={styles.prefix} allowFontScaling={false}>£</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor="#999"
                value={price}
                onChangeText={onChange}
            />
        </View>
        {error && <Text style={styles.error} allowFontScaling={false}>{error}</Text>}
    </View>
);

export default PriceInputFields;

const styles = StyleSheet.create({
    container: {
        marginBottom: hp(2),
    },
    label: {
        fontSize: wp(3.8),
        fontWeight: '600',
        color: '#444',
        marginBottom: hp(0.5),
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: wp(2),
        backgroundColor: '#fff',
        paddingHorizontal: wp(3),
    },
    wrapperError: {
        borderColor: 'red',
    },
    prefix: {
        fontSize: wp(4),
        color: '#000',
        marginRight: wp(2),
    },
    input: {
        flex: 1,
        fontSize: wp(4),
        color: '#000',
        paddingVertical: hp(1.2),
    },
    error: {
        marginTop: hp(0.5),
        color: 'red',
        fontSize: wp(3.3),
    },
});
