// src/hooks/useLoginHandler.ts
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useCallback } from 'react';
import { setItem } from '../utils/asyncStorage';
import { connectSocket } from '../utils/socket';
import { setAuthToken } from '../utils/axios';

const KEYS = {
  TOKEN: 'user_token',
  USER_ID: 'user_id',
  USER_ROLE: 'user_role',
  SET_DRAWER: 'setDrawer',
};

export const useLoginHandler = () => {
  const navigation = useNavigation();

  const handleLogin = useCallback(
    async (token: string, user_id: string, role: string) => {
      // Save auth data
      await setItem(KEYS.TOKEN, token);
      await setItem(KEYS.USER_ID, user_id);
      await setItem(KEYS.USER_ROLE, role);
      await setItem(KEYS.SET_DRAWER, 'true'); // 💡 Ensure drawer reloads fresh data

      setAuthToken(token);
      await connectSocket(token);

      // Determine navigation route
      const route =
        role === 'client'
          ? 'ClientDrawerNavigator'
          : role === 'truck'
          ? 'TruckDrawerNavigator'
          : null;

      if (!route) throw new Error('Unknown user role');

      // Reset navigation
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: route }],
        })
      );
    },
    [navigation]
  );

  return handleLogin;
};
