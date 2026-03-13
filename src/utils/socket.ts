// src/utils/socket.ts

import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export let socket: Socket | null = null;
let currentToken: string | null = null;

/**
 * Derive your Socket.IO URL from API_BASE_URL, or fall back
 * if it's not defined or invalid.
 */
const SOCKET_URL = (() => {
  if (typeof API_BASE_URL === 'string') {
    try {
      // e.g. "https://host:port/api" → "https://host:port"
      return new URL(API_BASE_URL).origin;
    } catch {
      // strip trailing "/api" if URL parsing fails
      return API_BASE_URL.replace(/\/api\/?$/, '');
    }
  }
  // final fallback
  return 'http://192.168.0.101:5000';
})();

interface AuthPayload { token: string; }

/**
 * Connect (or reconnect) a single shared Socket.IO instance.
 * Automatically re-authenticates on reconnect.
 */
export async function connectSocket(token: string): Promise<void> {
  currentToken = token;

  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: { token } as AuthPayload,
      autoConnect: true,
      reconnection: true,
    });

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

    socket.onAny((event, ...args) => {
      console.log(`📩 [Socket Event] '${event}':`, args);
    });

    socket.on('disconnect', reason => {
      console.log('❌ [Socket Disconnected] Reason:', reason);
      if (reason === 'io server disconnect') {
        socket?.connect();
      }
    });

    socket.io.on('reconnect', async attempts => {
      console.log('🔄 [Socket Reconnected] After', attempts, 'attempts');
      if (currentToken) {
        socket!.auth = { token: currentToken } as AuthPayload;
      }
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

    socket.on('connect_error', err => {
      console.warn('🚨 [Socket Connect Error]:', err.message);
    });

  } else if (!socket.connected) {
    socket.auth = { token } as AuthPayload;
    socket.connect();
  } else {
    socket.auth = { token } as AuthPayload;
  }
}

/**
 * Gracefully tear down the socket: remove listeners, disconnect, null out.
 */
export function disconnectSocket(): void {
  if (!socket) return;
  console.log('🔌 [Socket Disconnecting]');
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
  currentToken = null;
}
