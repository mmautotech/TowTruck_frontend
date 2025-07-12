// src/navigation/TruckDrawerNavigator.tsx
import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TruckDrawerContent from '../components/TruckDrawerContent';

import TruckDashboardStackNavigator from './TruckDashboardStackNavigator';
import TruckWalletScreen from '../screens/Truck/WalletScreen';
import TruckProfileScreen from '../screens/Truck/Profile';
import TruckHistoryScreen from '../screens/Truck/History';
import TruckSettingsScreen from '../screens/Truck/Settings';
import TruckTerms_ConditionsScreen from '../screens/Truck/Terms_Conditions';

import { TruckDrawerParamList } from '../types';

const Drawer = createDrawerNavigator<TruckDrawerParamList>();
const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.7;

const TruckDrawerNavigator = () => {
  const [drawerKey, setDrawerKey] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const refreshDrawer = async () => {
        const shouldRefresh = await AsyncStorage.getItem('setDrawer');
        if (shouldRefresh === 'true') {
          await AsyncStorage.removeItem('setDrawer');
          setDrawerKey(prev => prev + 1);
        }
      };
      refreshDrawer();
    }, [])
  );

  return (
    <Drawer.Navigator
      key={drawerKey}
      drawerContent={(props) => <TruckDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          width: DRAWER_WIDTH,
          backgroundColor: '#fff',
        },
        headerShown: false,
      }}
    >
      <Drawer.Screen name="TruckDashboardStackNavigator" component={TruckDashboardStackNavigator} />
      <Drawer.Screen name="TruckWalletScreen" component={TruckWalletScreen} />
      <Drawer.Screen name="TruckProfileScreen" component={TruckProfileScreen} />
      <Drawer.Screen name="TruckHistoryScreen" component={TruckHistoryScreen} />
      <Drawer.Screen name="TruckSettingsScreen" component={TruckSettingsScreen} />
      <Drawer.Screen name="TruckTerms_ConditionsScreen" component={TruckTerms_ConditionsScreen} />
    </Drawer.Navigator>
  );
};

export default TruckDrawerNavigator;
