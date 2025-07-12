// components/CustomHeader.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp } from '../utils/responsive';

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  backgroundColor?: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBackButton = false,
  showMenuButton = true,
  backgroundColor = '#357EBD',
}) => {
  const navigation = useNavigation();

  const handleMenu = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={[styles.headerContainer, { backgroundColor }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={backgroundColor}
        translucent={false}
      />

      {(showBackButton || showMenuButton) && (
        <TouchableOpacity
          onPress={showBackButton ? () => navigation.goBack() : handleMenu}
          style={styles.iconWrapper}
        >
          <Ionicons
            name={showBackButton ? 'arrow-back' : 'menu'}
            size={wp(6)}
            color="#fff"
          />
        </TouchableOpacity>
      )}

      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
    </View>
  );
};

export default React.memo(CustomHeader);

const styles = StyleSheet.create({
  headerContainer: {
    height: hp(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomStartRadius: wp(6),
    borderBottomEndRadius: wp(6),
    elevation: 4,
    position: 'relative',
    paddingHorizontal: wp(4),
  },
  iconWrapper: {
    position: 'absolute',
    left: wp(4),
    top: hp(2.2),
    padding: wp(1),
    zIndex: 10,
  },
  title: {
    color: '#fff',
    fontSize: wp(4.5),
    fontWeight: '600',
  },
});
