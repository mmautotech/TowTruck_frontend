import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  DrawerContentComponentProps,
  useDrawerStatus,
} from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import styles from './styles';
import { useUserInfo } from '../../hooks/useBasicInfo';
import { SignoutUser } from '../../utils/Signout_User';
import { getItem, removeItem } from '../../utils/asyncStorage';

const TruckDrawerContent: React.FC<DrawerContentComponentProps> = ({
  navigation,
  state,
}) => {
  const drawerStatus = useDrawerStatus();
  const currentRoute = state.routeNames[state.index];
  const {
    name,
    avatar,
    rating,
    ratings_count,
    loading,
    refresh: refreshUserInfo,
  } = useUserInfo();

  // Refresh on drawer open
  useEffect(() => {
    if (drawerStatus === 'open') {
      refreshUserInfo();
    }
  }, [drawerStatus, refreshUserInfo]);

  // Refresh if setDrawer flag was set (e.g., from Profile updates)
  useFocusEffect(
    useCallback(() => {
      const refreshIfFlagged = async () => {
        const flag = await getItem('setDrawer');
        if (flag === 'true') {
          await refreshUserInfo();
          await removeItem('setDrawer');
        }
      };
      refreshIfFlagged();
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

  const navItems = [
    { label: 'Service', route: 'TruckDashboardStackNavigator' },
    { label: 'My Wallet', route: 'TruckWalletScreen' },
    { label: 'Profile', route: 'TruckProfileScreen' },
    { label: 'History', route: 'TruckHistoryScreen' },
    { label: 'Settings', route: 'TruckSettingsScreen' },
    { label: 'Terms & Conditions', route: 'TruckTerms_ConditionsScreen' },
  ];

  const renderItem = (label: string, routeName: string) => {
    const isActive = currentRoute === routeName;
    return (
      <TouchableOpacity
        key={routeName}
        onPress={() => navigation.navigate(routeName)}
      >
        <Text style={[styles.item, isActive && styles.activeItem]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#004AAD"
              style={{ marginVertical: 24 }}
            />
          ) : (
            <>
              <Image
                source={{
                  uri:
                    avatar ||
                    'https://static.vecteezy.com/system/resources/previews/027/182/346/non_2x/delivery-truck-isolated-on-a-transparent-background-png.png',
                }}
                style={styles.avatar}
              />
              <Text style={styles.name}>{name || 'Unnamed Truck'}</Text>
              <Text style={styles.rating}>
                {typeof rating === 'number' && rating > 0
                  ? `⭐ ${rating} (${ratings_count ?? 0})`
                  : '⭐ No rating'}
              </Text>
            </>
          )}
        </View>

        {/* Navigation Items */}
        {navItems.map((item) => renderItem(item.label, item.route))}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={[styles.item, styles.logoutText]}>Signout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TruckDrawerContent;
