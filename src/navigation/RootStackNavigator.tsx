// src/navigation/RootStackNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from '../screens/SplashScreen';
import SigninScreen from '../screens/Signin';
import SignupScreen from '../screens/Signup';
import ForgotPasswordScreen from '../screens/ForgotPassword';

import ClientDrawerNavigator from './ClientDrawerNavigator';
import TruckDrawerNavigator from './TruckDrawerNavigator';

import { RootStackParamList } from '../types';

type Props = {
  initialRouteName?: keyof RootStackParamList;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootStackNavigator: React.FC<Props> = ({ initialRouteName = 'SplashScreen' }) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="SigninScreen" component={SigninScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <Stack.Screen name="ClientDrawerNavigator" component={ClientDrawerNavigator} />
      <Stack.Screen name="TruckDrawerNavigator"  component={TruckDrawerNavigator}  />
    </Stack.Navigator>
  );
};

export default RootStackNavigator;