import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import ClientDashboardScreen from '../screens/Client/Dashboard';
import ClientConfirmRequestScreen from '../screens/Client/Dashboard/ConfirmRequest';
import ClientServicesScreen from '../screens/Client/Dashboard/Services';
import ClientDriverTrackingScreen from '../screens/Client/Dashboard/DriverTracking';
import MessagingScreen from '../screens/Common/MessagingScreen';

import { ClientStackParamList } from '../types';

const Stack = createStackNavigator<ClientStackParamList>();

const ClientDashboardStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#357EBD',
          paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight, // add margin top for Android
        },
        headerTitleStyle: {
          color: '#fff',
          fontWeight: 'bold',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}
    >
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
        options={{ headerShown: false }} // show default header
      />
    </Stack.Navigator>
  );
};

export default ClientDashboardStackNavigator;
