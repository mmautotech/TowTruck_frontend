// src/hooks/useChat.ts

import { useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import { socket, connectSocket } from '../utils/socket';
import { getItem } from '../utils/asyncStorage';
import {
  getConversationWithUser,
  sendMessage as apiSendMessage,
  markMessageAsRead,
  Message as ApiMessage,
} from '../api/message';

export type UIMessageStatus = 'sent' | 'read' | 'delivered';

export interface UIMessage extends ApiMessage {
  status: UIMessageStatus;
}

export function useChat(receiverId: string) {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUserId = useRef<string>('');
  const soundRef = useRef<Audio.Sound | null>(null);

  // Load existing conversation history
  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const userId = await getItem('user_id');
      if (!userId || !receiverId) return;

      currentUserId.current = userId;
      const chat = await getConversationWithUser(receiverId);
      setMessages(chat.map(msg => ({
        ...msg,
        status: (msg.status as UIMessageStatus) ?? 'sent',
      })));
    } catch (err) {
      console.error('[useChat] Failed to load messages', err);
    } finally {
      setIsLoading(false);
    }
  };

  const playMessageSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/message.mp3'),
        { shouldPlay: true }
      );
      soundRef.current = sound;
      await sound.playAsync();
    } catch (err) {
      console.error('[useChat] Failed to play sound', err);
    }
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !receiverId) return;
    try {
      const newMsg = await apiSendMessage({ receiverId, message: trimmed });
      setMessages(prev => {
        if (prev.some(m => m._id === newMsg._id)) return prev;
        return [...prev, { ...newMsg, status: 'delivered' }];
      });
    } catch (err) {
      console.error('[useChat] Failed to send message', err);
    }
  };

  useEffect(() => {
    if (!receiverId) return;

    let sortedIds: [string, string] = ['', ''];

    const joinRoom = () => {
      if (!sortedIds[0] || !sortedIds[1]) return;
      socket?.emit('join-chat', { user1: sortedIds[0], user2: sortedIds[1] });
    };

    const handleIncoming = (msg: ApiMessage) => {
      const me = currentUserId.current;
      if (!me) return;
      const isSender = msg.senderId === me;
      const isReceiver = msg.receiverId === me;
      if (!isSender && !isReceiver) return;

      setMessages(prev => {
        if (prev.some(m => m._id === msg._id)) return prev;
        if (isReceiver) {
          playMessageSound();
        }
        const uiMsg: UIMessage = {
          ...msg,
          status: isSender
            ? 'delivered'
            : (msg.status as UIMessageStatus) ?? 'sent',
        };
        return [...prev, uiMsg];
      });

      if (isReceiver) {
        socket?.emit('message-delivered', {
          messageId: msg._id,
          receiverId: me,
        });
      }
    };

    (async () => {
      try {
        const userId = await getItem('user_id');
        if (!userId) return;

        currentUserId.current = userId;
        const token = await getItem('user_token');
        if (token) await connectSocket(token);

        sortedIds = [userId, receiverId].sort() as [string, string];
        joinRoom();
        socket?.on('connect', joinRoom);
        socket?.on('message-received', handleIncoming);
      } catch (err) {
        console.error('[useChat] Socket setup error', err);
      }
    })();

    return () => {
      socket?.off('connect', joinRoom);
      socket?.off('message-received', handleIncoming);
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, [receiverId]);

  useEffect(() => {
    if (receiverId) loadMessages();
  }, [receiverId]);

  return {
    messages,
    sendMessage,
    isLoading,
    loadMessages,
    markAsRead: () => markMessageAsRead(receiverId),
  };
}
