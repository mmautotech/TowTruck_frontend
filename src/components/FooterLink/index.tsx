import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

type Props = {
    prompt: string;
    linkText: string;
    onPress: () => void;
};

export default function FooterLink({ prompt, linkText, onPress }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.prompt}>{prompt}</Text>
            <TouchableOpacity onPress={onPress}>
                <Text style={styles.link}>{linkText}</Text>
            </TouchableOpacity>
        </View>
    );
}
