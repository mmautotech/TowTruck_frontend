// src/hooks/useClientSocket.ts

import { useEffect, useState, useCallback } from 'react';
import { Audio } from 'expo-av';
import { socket, connectSocket } from '../utils/socket';
import { getItem } from '../utils/asyncStorage';

export interface RideCompletedPayload {
  request_id: string;
  message: string;
  completed_by?: 'truck' | 'client';
  timestamp?: string;
}

export interface UseClientSocketReturn {
  payload: RideCompletedPayload | null;
  clearPayload: () => void;
  unreadCount: number;
  clearUnreadCount: () => void;
  socket?: any;
}

export function useClientSocket(): UseClientSocketReturn {
  const [payload, setPayload] = useState<RideCompletedPayload | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const clearPayload = useCallback(() => {
    setPayload(null);
  }, []);

  const clearUnreadCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    const handleRideCompleted = (data: RideCompletedPayload) => {
      console.log('[useClientSocket] 🚚 rideCompleted received:', data);
      setPayload(data);
    };

    const handleMessageReceived = async (data: any) => {
      console.log('[useClientSocket] 📩 message:received:', data);
      setUnreadCount(data.count || 0);
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/message.mp3'),
          { shouldPlay: true }
        );
        await sound.playAsync();
      } catch (err) {
        console.error('[useClientSocket] Failed to play message sound', err);
      }
    };

    (async () => {
      try {
        const token = await getItem('user_token');
        if (!token) {
          console.warn('[useClientSocket] No auth token found—skipping socket setup');
          return;
        }

        await connectSocket(token);

        socket?.off('rideCompleted', handleRideCompleted);
        socket?.off('message:received', handleMessageReceived);

        socket?.on('rideCompleted', handleRideCompleted);
        socket?.on('message:received', handleMessageReceived);
      } catch (err) {
        console.error('[useClientSocket] Error during socket setup:', err);
      }
    })();

    return () => {
      socket?.off('rideCompleted', handleRideCompleted);
      socket?.off('message:received', handleMessageReceived);
    };
  }, []);
  return { payload, clearPayload, unreadCount, clearUnreadCount, socket };

}
