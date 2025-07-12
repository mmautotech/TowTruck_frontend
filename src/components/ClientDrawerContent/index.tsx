import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { DrawerContentComponentProps, useDrawerStatus } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import styles from './styles';
import { useUserInfo } from '../../hooks/useBasicInfo';
import { SignoutUser } from '../../utils/Signout_User';
import { getItem, removeItem } from '../../utils/asyncStorage';

const ClientDrawerContent: React.FC<DrawerContentComponentProps> = ({
  navigation,
  state,
}) => {
  const {
    name,
    avatar,
    rating,
    ratings_count,
    loading,
    refresh: refreshUserInfo,
  } = useUserInfo();

  const drawerStatus = useDrawerStatus();
  const currentRoute = state.routeNames[state.index];

  // Refresh every time drawer is opened
  useEffect(() => {
    if (drawerStatus === 'open') {
      refreshUserInfo();
    }
  }, [drawerStatus, refreshUserInfo]);

  // Also refresh if setDrawer flag is set (used for post-profile update)
  useFocusEffect(
    useCallback(() => {
      const refreshIfRequested = async () => {
        const flag = await getItem('setDrawer');
        if (flag === 'true') {
          await refreshUserInfo();
          await removeItem('setDrawer');
        }
      };
      refreshIfRequested();
    }, [refreshUserInfo])
  );

  const handleLogout = () => {
    Alert.alert('Confirm Signout', 'Are you sure you want to Signout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Signout',
        style: 'destructive',
        onPress: () => {
          SignoutUser();
        },
      },
    ]);
  };

  const renderItem = (label: string, routeName: string) => {
    const isActive = currentRoute === routeName;
    return (
      <TouchableOpacity key={routeName} onPress={() => navigation.navigate(routeName)}>
        <Text style={[styles.item, isActive && styles.activeItem]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          {loading ? (
            <ActivityIndicator size="large" color="#1B5E20" style={{ marginVertical: 24 }} />
          ) : (
            <>
              <Image source={{ uri: avatar }} style={styles.avatar} />
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.rating}>
                {typeof rating === 'number' && rating > 0
                  ? `⭐ ${rating} (${ratings_count ?? 0})`
                  : '⭐ No rating'}
              </Text>
            </>
          )}
        </View>

        {/* Navigation Items */}
        {renderItem('Request a Ride', 'ClientDashboardStackNavigator')}
        {renderItem('Profile', 'ClientProfileScreen')}
        {renderItem('History', 'ClientHistoryScreen')}
        {renderItem('Settings', 'ClientSettingsScreen')}
        {renderItem('Terms & Conditions', 'ClientTerms_ConditionsScreen')}

        {/* Sign Out */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={[styles.item, styles.logoutText]}>Signout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ClientDrawerContent;
