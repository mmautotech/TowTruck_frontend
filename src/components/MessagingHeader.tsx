import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { wp, hp } from '../utils/responsive';

interface Props {
  name: string;
  photo?: string;
  subtitle?: string;
  onBack: () => void;
}

const MessagingHeader: React.FC<Props> = ({ name, photo, onBack }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const getPhotoUri = () => {
    if (!photo) return undefined;
    return photo.startsWith('data:') ? photo : `data:image/jpeg;base64,${photo}`;
  };

  const renderProfileImage = () => {
    const uri = getPhotoUri();

    if (!uri || imageError) {
      return (
        <View style={styles.placeholderImage}>
          <Icon name="user" size={wp(5)} color="#fff" />
        </View>
      );
    }

    return (
      <View style={styles.imageWrapper}>
        {imageLoading && (
          <ActivityIndicator
            size="small"
            color="#357EBD"
            style={styles.loadingIndicator}
          />
        )}
        <Image
          source={{ uri }}
          style={styles.profileImage}
          resizeMode="cover"
          onLoadEnd={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false);
            setImageError(true);
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Icon name="arrow-left" size={wp(5)} color="#fff" />
      </TouchableOpacity>
      {renderProfileImage()}
      <Text style={styles.contactName} allowFontScaling={false}>
        {name}
      </Text>
    </View>
  );
};

export default MessagingHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: hp(2),
    backgroundColor: '#357EBD',
    borderBottomStartRadius: wp(6),
    borderEndEndRadius: wp(6),
    borderColor: '#fff',
  },
  backButton: {
    marginRight: wp(4),
    padding: wp(1.5), // Better touch target
  },
  imageWrapper: {
    width: wp(10),
    height: wp(10),
    marginRight: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
  },
  placeholderImage: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  loadingIndicator: {
    position: 'absolute',
  },
  contactName: {
    fontSize: Math.max(wp(5), 14), // Ensures readability on very small screens
    fontWeight: '600',
    color: '#fff',
  },
});
