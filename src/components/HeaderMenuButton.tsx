import React from 'react';
import { TouchableOpacity, View, StyleSheet, Platform } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp } from '../utils/responsive';

const HeaderMenuButton = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={styles.menuButton}
        activeOpacity={0.7}
      >
        <Ionicons name="menu" size={wp(6.5)} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderMenuButton;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: Platform.OS === 'android' ? hp(6) : hp(5), // extra padding for iOS
    left: wp(4),
    zIndex: 99,
  },
  menuButton: {
    padding: wp(2.5),
    borderRadius: wp(5),
    backgroundColor: '#fff',
    elevation: 4, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
