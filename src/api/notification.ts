// src/api/notification.ts

import axiosInstance from '../utils/axios';

// TypeScript type for your Notification model
export interface NotificationType {
  _id: string;
  user_id: string;
  type: 'rideAccepted' | 'rideReopened' | 'rideCancelled' | 'rideCompleted' | string;
  ride_id?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

/**
 * Fetch latest notifications for the current user (max 50).
 * If unreadOnly is true, fetches only unread notifications.
 */
export async function fetchNotifications(unreadOnly: boolean = false): Promise<NotificationType[]> {
  const res = await axiosInstance.get('/notifications', {
    params: unreadOnly ? { unread: true } : {},
  });
  return res.data.notifications;
}

/**
 * Mark a notification as read.
 * @param id Notification _id
 */
export async function markNotificationAsRead(id: string): Promise<NotificationType> {
  const res = await axiosInstance.patch(`/notifications/${id}/read`);
  return res.data.notification;
}

/**
 * Mark multiple notifications as read (if you implement it on backend later).
 * Not supported by default backend, just for future extensibility.
 */
export async function markNotificationsAsRead(ids: string[]): Promise<void> {
  await Promise.all(ids.map(markNotificationAsRead));
}
