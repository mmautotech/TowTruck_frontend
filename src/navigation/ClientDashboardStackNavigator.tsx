import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';

import ClientDashboardScreen from '../screens/Client/Dashboard';
import ClientConfirmRequestScreen from '../screens/Client/Dashboard/ConfirmRequest';
import ClientServicesScreen from '../screens/Client/Dashboard/Services';
import ClientDriverTrackingScreen from '../screens/Client/Dashboard/DriverTracking';
import MessagingScreen from '../screens/Common/MessagingScreen';

import { ClientStackParamList } from '../types';

const Stack = createStackNavigator<ClientStackParamList>();

const headerOptions = (title: string): StackNavigationOptions => ({
  title,
  headerStyle: {
    backgroundColor: '#357EBD',
    height: Platform.OS === 'ios' ? 100 : 80,
  },
  headerTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  headerTintColor: '#fff',
  headerTitleAlign: 'center',
  headerBackTitle: '', // ✅ Hides the back text label
});

const ClientDashboardStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ClientDashboardScreen"
        component={ClientDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClientConfirmRequestScreen"
        component={ClientConfirmRequestScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClientServicesScreen"
        component={ClientServicesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClientDriverTrackingScreen"
        component={ClientDriverTrackingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MessagingScreen"
        component={MessagingScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ClientDashboardStackNavigator;