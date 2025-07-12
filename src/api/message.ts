import { AxiosResponse } from 'axios';
import axiosInstance from '../utils/axios';

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  status: 'sent' | 'delivered' | 'read';
  timestamp: string;
}

// 🔹 Fetch chat messages with another user
export async function getConversationWithUser(otherUserId: string): Promise<Message[]> {
  const response: AxiosResponse<{ data: Message[] }> = await axiosInstance.get('/messages', {
    params: { otherUserId },
  });
  return response.data.data;
}

// 🔹 Mark all messages from this user as read
export async function markMessageAsRead(otherUserId: string): Promise<void> {
  await axiosInstance.patch(`/message/read/${otherUserId}`);
}

// 🔹 Send message using unified backend route
export async function sendMessage(payload: {
  receiverId: string;
  message: string;
}): Promise<Message> {
  const response: AxiosResponse<{ data: Message }> = await axiosInstance.post(
    '/message/send',
    payload
  );
  return response.data.data;
}
