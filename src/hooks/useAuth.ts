// src/hooks/useAuth.ts

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthInfo {
  token: string | null;
}

export function useAuth(): AuthInfo {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    (async () => {
      const [ tok] = await Promise.all([
        AsyncStorage.getItem('user_token'),
      ]);
      if (!isActive) return;
      setToken(tok);
    })();
    return () => { isActive = false; };
  }, []);

  return {  token };
}
