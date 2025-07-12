import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import ClientDrawerContent from '../components/ClientDrawerContent';
import ClientDashboardStackNavigator from './ClientDashboardStackNavigator';
import ClientProfileScreen from '../screens/Client/Profile';
import ClientHistoryScreen from '../screens/Client/History';
import ClientSettingsScreen from '../screens/Client/Settings';
import ClientTerms_ConditionsScreen from '../screens/Client/Terms_Conditions';
import { ClientDrawerParamList } from '../types';

const Drawer = createDrawerNavigator<ClientDrawerParamList>();
const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.7;

const ClientDrawerNavigator = () => {
  const [drawerKey, setDrawerKey] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const checkDrawerRefresh = async () => {
        const shouldRefresh = await AsyncStorage.getItem('setDrawer');
        if (shouldRefresh === 'true') {
          await AsyncStorage.removeItem('setDrawer');
          setDrawerKey(prev => prev + 1); // trigger drawerContent remount
        }
      };
      checkDrawerRefresh();
    }, [])
  );

  return (
    <Drawer.Navigator
      key={drawerKey} // 🔁 force remount on drawerKey change
      drawerContent={(props) => <ClientDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: DRAWER_WIDTH,
          backgroundColor: '#F2F2F2',
        },
      }}
    >
      <Drawer.Screen
        name="ClientDashboardStackNavigator"
        component={ClientDashboardStackNavigator}
        options={{ title: 'Dashboard' }}
      />
      <Drawer.Screen
        name="ClientProfileScreen"
        component={ClientProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Drawer.Screen
        name="ClientHistoryScreen"
        component={ClientHistoryScreen}
        options={{ title: 'History' }}
      />
      <Drawer.Screen
        name="ClientSettingsScreen"
        component={ClientSettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Drawer.Screen
        name="ClientTerms_ConditionsScreen"
        component={ClientTerms_ConditionsScreen}
        options={{ title: 'TermsCondition' }}
      />
    </Drawer.Navigator>
  );
};

export default ClientDrawerNavigator;
