// src/utils/socket.ts

import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export let socket: Socket | null = null;
let currentToken: string | null = null;

/**
 * Socket.IO URL derived from API_BASE_URL or fallback
 */
const SOCKET_URL = (() => {
  if (typeof API_BASE_URL === 'string') {
    try {
      return new URL(API_BASE_URL).origin; // e.g., http://192.168.18.84:5000
    } catch {
      return API_BASE_URL.replace(/\/api\/?$/, '');
    }
  }
  // fallback (only if nothing else works)
  return 'http://192.168.18.84:5000';
})();

interface AuthPayload {
  token: string;
}

/**
 * Connect (or reconnect) a single shared Socket.IO instance.
 * Handles token authentication, rejoining rooms, and fallback transports.
 */
export async function connectSocket(token: string): Promise<void> {
  currentToken = token;

  if (!socket) {
    console.log('🔗 [Socket Connecting] URL:', SOCKET_URL, 'Token:', token);

    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'], // allow fallback for React Native
      auth: { token } as AuthPayload,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      timeout: 10000, // 10s timeout
    });

    // Successful connection
    socket.on('connect', async () => {
      console.log('✅ [Socket Connected] ID:', socket?.id);
      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (userId) {
          socket?.emit('join', `user_${userId}`);
          console.log('🔗 [Socket] Joined room: user_' + userId);
        }
      } catch (err) {
        console.error('⚠️ [Socket] Failed to join user room', err);
      }
    });

    // Listen to all events for debug
    socket.onAny((event, ...args) => {
      console.log(`📩 [Socket Event] '${event}':`, args);
    });

    // Disconnection handler
    socket.on('disconnect', reason => {
      console.log('❌ [Socket Disconnected] Reason:', reason);
      if (reason === 'io server disconnect') {
        // manual reconnect if server disconnected
        socket?.connect();
      }
    });

    // Reconnection handler
    socket.io.on('reconnect', async attempts => {
      console.log('🔄 [Socket Reconnected] After', attempts, 'attempts');
      if (currentToken) socket!.auth = { token: currentToken } as AuthPayload;

      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (userId) {
          socket?.emit('join', `user_${userId}`);
          console.log('🔗 [Socket] Re-joined room: user_' + userId);
        }
      } catch (err) {
        console.error('⚠️ [Socket] Failed to re-join user room', err);
      }
    });

    // Connection errors
    socket.on('connect_error', err => {
      console.warn('🚨 [Socket Connect Error]:', err.message, err);
    });

    socket.on('connect_timeout', () => {
      console.warn('⏱ [Socket Connect Timeout]');
    });
  } else if (!socket.connected) {
    socket.auth = { token } as AuthPayload;
    socket.connect();
  } else {
    socket.auth = { token } as AuthPayload;
  }
}

/**
 * Gracefully disconnect the socket
 */
export function disconnectSocket(): void {
  if (!socket) return;
  console.log('🔌 [Socket Disconnecting]');
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
  currentToken = null;
}
