import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';

import TruckDashboardScreen from '../screens/Truck/Dashboard';
import TruckServiceScreen from '../screens/Truck/Dashboard/Service';
import MessagingScreen from '../screens/Common/MessagingScreen';

import { TruckStackParamList } from '../types';

const Stack = createStackNavigator<TruckStackParamList>();

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
  headerBackTitle: '', 
});

const TruckDashboardStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TruckDashboardScreen"
        component={TruckDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TruckServiceScreen"
        component={TruckServiceScreen}
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

export default TruckDashboardStackNavigator;