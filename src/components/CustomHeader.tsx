// components/CustomHeader.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView
      edges={['top']}
      style={[styles.safeArea, { backgroundColor }]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={backgroundColor}
        translucent={Platform.OS === 'android'}
      />

      <View style={styles.headerContainer}>
        {(showBackButton || showMenuButton) && (
          <TouchableOpacity
            onPress={showBackButton ? () => navigation.goBack() : handleMenu}
            style={styles.iconWrapper}
            activeOpacity={0.7}
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
    </SafeAreaView>
  );
};

export default React.memo(CustomHeader);

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
  },

  headerContainer: {
    height: hp(7),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: wp(4),

    borderBottomLeftRadius: wp(6),
    borderBottomRightRadius: wp(6),

    elevation: 4,
  },

  iconWrapper: {
    position: 'absolute',
    left: wp(4),
    padding: wp(1.5),
  },

  title: {
    color: '#fff',
    fontSize: wp(4.5),
    fontWeight: '600',
    maxWidth: '75%',
    textAlign: 'center',
  },
});
