// src/hooks/useTruckNotifications.ts

import { useState, useEffect, useCallback } from 'react';
import { socket, connectSocket } from '../utils/socket';
import { getItem } from '../utils/asyncStorage';
import axiosInstance from '../utils/axios'; // <-- Use the configured instance!

export interface NotificationType {
  _id: string;
  user_id: string;
  type: string;
  ride_id?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface UseNotificationsReturn {
  notifications: NotificationType[];
  unreadCount: number;
  loading: boolean;
  refresh: () => void;
  markAsRead: (id: string) => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(false);

  // Helper to fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getItem('user_token'); // not strictly needed if axiosInstance already setAuthToken
      const res = await axiosInstance.get('/notifications', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setNotifications(res.data.notifications || []);
    } catch (err) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen to reloadNotifications
  useEffect(() => {
    (async () => {
      const token = await getItem('user_token');
      if (!token) return;
      await connectSocket(token);
      socket?.off('reloadNotifications', fetchNotifications);
      socket?.on('reloadNotifications', fetchNotifications);
      fetchNotifications();
    })();

    return () => {
      socket?.off('reloadNotifications', fetchNotifications);
    };
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const refresh = fetchNotifications;

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    const token = await getItem('user_token'); // not strictly needed if axiosInstance has header
    await axiosInstance.patch(`/notifications/${id}/read`, {}, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    setNotifications((prev) =>
      prev.map(n => n._id === id ? { ...n, read: true } : n)
    );
  }, []);

  return { notifications, unreadCount, loading, refresh, markAsRead };
}
