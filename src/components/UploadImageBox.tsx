import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  AccessibilityProps,
} from 'react-native';
import { wp, hp } from '../utils/responsive';

type Props = {
  label: string;
  image: string | null;
  onPress: () => void;
  onRemove?: () => void;
};

const UploadImageBox: React.FC<Props & AccessibilityProps> = ({
  label,
  image,
  onPress,
  onRemove,
}) => {
  const borderRadius = wp(3);

  return (
    <TouchableOpacity
      style={[styles.uploadBox, { borderRadius }]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel={`Upload image: ${label}`}
    >
      {image ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: image }}
            style={[styles.uploadedImage, { borderRadius }]}
            accessibilityLabel={`Uploaded image for ${label}`}
          />
          {onRemove && (
            <TouchableOpacity
              onPress={onRemove}
              style={styles.removeButton}
              accessibilityLabel={`Remove uploaded image for ${label}`}
            >
              <Text style={styles.removeIcon} allowFontScaling={false}>✖</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.uploadIcon} allowFontScaling={false}>⌷</Text>
          <Text style={styles.uploadLabel} allowFontScaling={false}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default UploadImageBox;

const styles = StyleSheet.create({
  uploadBox: {
    height: hp(18),
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2.5),
    backgroundColor: '#fff',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    fontSize: wp(9),
    color: '#000',
    fontWeight: 'bold',
  },
  uploadLabel: {
    fontSize: wp(3.5),
    color: '#000',
    fontWeight: '600',
    marginTop: hp(0.5),
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  removeIcon: {
    color: '#e00',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
