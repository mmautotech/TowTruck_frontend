// components/ProfileImageHandler.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { wp, hp } from '../utils/responsive';

type Props = {
  imageUri: string | null;
  label?: string;
  onPickImage: () => void;
};

export default function ProfileImageHandler({
  imageUri,
  label = 'Upload Avatar',
  onPickImage,
}: Props) {
  const resolvedUri = imageUri
    ? imageUri.startsWith('data:') ? imageUri : `data:image/jpeg;base64,${imageUri}`
    : null;

  return (
    <TouchableOpacity style={styles.imageContainer} onPress={onPickImage} activeOpacity={0.8}>
      {resolvedUri ? (
        <Image source={{ uri: resolvedUri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.icon} allowFontScaling={false}>⌷</Text>
          <Text style={styles.label} allowFontScaling={false}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: hp(1.5),
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
    }),
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    alignItems: 'center',
  },
  icon: {
    fontSize: wp(8),
    color: '#aaa',
  },
  label: {
    fontSize: wp(3),
    color: '#666',
    marginTop: hp(0.5),
  },
});
