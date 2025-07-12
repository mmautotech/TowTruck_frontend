import { useEffect } from 'react';
import { socket } from '../utils/socket';
import { showMessage } from 'react-native-flash-message';
import { navigationRef } from '../navigation/RootNavigation';
import { useUnreadMessages } from '../context/UnreadMessagesContext';

export const useMessageListener = () => {
  const { setCount } = useUnreadMessages();

  useEffect(() => {
    const handleIncomingMessage = (data: {
      senderId: string;
      senderName: string;
      message: string;
      timestamp: string;
      count: number; // 👈 total unread messages
    }) => {
      console.log('[useMessageListener] Received data:', data);

      const currentRoute = navigationRef.getCurrentRoute()?.name;
      console.log('[useMessageListener] Current route:', currentRoute);

      if (currentRoute !== 'MessagingScreen') {
        setCount(data.count); // 👈 update unread count context

        showMessage({
          message: `Message from ${data.senderName}`,
          description: data.message,
          type: 'info',
          duration: 4000,
        });
      } else {
        // If in chat, optionally reset the count for that conversation
        setCount(0);
        console.log('[useMessageListener] Message received while on MessagingScreen, not showing notification.');
      }
    };

    socket?.on('message:received', handleIncomingMessage);

    return () => {
      socket?.off('message:received', handleIncomingMessage);
    };
  }, [setCount]);
};
