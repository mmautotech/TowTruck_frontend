import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import MessagingHeader from '../../components/MessagingHeader';
import { useChat } from '../../hooks/useChat';
import styles from './styles';
import { ClientStackParamList } from '../../types';
import { getBasicInfo, BasicUserInfo } from '../../api/user';
import { markMessageAsRead } from '../../api/message';
import { useClientSocket } from '../../hooks/useClientSocket';
import { fetchActiveRequest } from '../../api/rideRequest';
import { getItem, setItem } from '../../utils/asyncStorage'; 

type NavigationProp = StackNavigationProp<ClientStackParamList>;

const MessagingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [receiverId, setReceiverId] = useState('');
  const [receiverInfo, setReceiverInfo] = useState<BasicUserInfo | null>(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [rideCompleted, setRideCompleted] = useState(false);

  const { messages, sendMessage, isLoading } = useChat(receiverId);
  const [text, setText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const {
    payload: rideCompletedPayload,
    clearPayload,
  } = useClientSocket();

  // Central ride completion handler
  const handleRideComplete = useCallback(
    (message = 'The driver has marked your ride as completed.') => {
      if (rideCompleted) return;
      setRideCompleted(true);
      Alert.alert(
        'Ride Completed',
        message,
        [
          {
            text: 'OK',
            onPress: async () => {
              clearPayload?.();
              await setItem('reciever_id', '');
              navigation.reset({
                index: 0,
                routes: [{ name: 'ClientDashboardScreen' }],
              });
            },
          },
        ],
        { cancelable: false }
      );
    },
    [rideCompleted, clearPayload, navigation]
  );

  // On focus: check user_role, if client, check ride status, redirect if not accepted
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setRideCompleted(false); // Reset flag on every focus

      (async () => {
        const userRole = await getItem('user_role');
        if (userRole === 'client') {
          try {
            const request = await fetchActiveRequest();
            if (!isActive) return;
            if (!request || request.status !== 'accepted') {
              navigation.reset({
                index: 0,
                routes: [{ name: 'ClientDashboardScreen' }],
              });
            }
          } catch {
            navigation.reset({
              index: 0,
              routes: [{ name: 'ClientDashboardScreen' }],
            });
          }
        }
      })();

      return () => { isActive = false; };
    }, [navigation])
  );

  // Socket event for ride completion
  useEffect(() => {
    if (rideCompletedPayload && !rideCompleted) {
      handleRideComplete(rideCompletedPayload.message);
    }
  }, [rideCompletedPayload, handleRideComplete, rideCompleted]);

  // Fetch receiver info and current user id on mount (using custom asyncStorage utils)
  useEffect(() => {
    (async () => {
      const recId = await getItem('reciever_id');
      const id = await getItem('user_id');
      if (recId) {
        setReceiverId(recId);
        try {
          const info = await getBasicInfo({ user_id: recId });
          setReceiverInfo(info);
        } catch (err) {
          console.error('[MessagingScreen] Failed to fetch receiver info', err);
        }
      }
      if (id) setCurrentUserId(id);
    })();
  }, []);

  // Mark messages as read on focus
  useFocusEffect(
    useCallback(() => {
      if (receiverId && currentUserId) {
        markMessageAsRead(receiverId).catch(err =>
          console.error('[MessagingScreen] Failed to mark messages as read', err)
        );
      }
    }, [receiverId, currentUserId])
  );

  // Scroll to bottom when messages update
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText('');
  };

  const renderMessage = ({ item }: any) => {
    const isMine = item.senderId === currentUserId;
    return (
      <View
        style={[
          styles.messageRow,
          { justifyContent: isMine ? 'flex-end' : 'flex-start' },
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMine ? styles.myMessage : styles.theirMessage,
          ]}
        >
          <Text style={styles.messageText}>{item.message}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    );
  };

  const getPhotoUri = () => {
    if (!receiverInfo?.profile_photo) return undefined;
    return receiverInfo.profile_photo.startsWith('data:')
      ? receiverInfo.profile_photo
      : `data:image/jpeg;base64,${receiverInfo.profile_photo}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {isLoading || !receiverInfo ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <MessagingHeader
            name={receiverInfo.name}
            photo={getPhotoUri()}
            subtitle="You are chatting as Client"
            onBack={() => navigation.goBack()}
          />

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={renderMessage}
            contentContainerStyle={styles.chatArea}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />

          <View style={styles.inputContainer}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type a message"
              style={styles.textInput}
            />
            <Button title="Send" onPress={handleSend} />
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default MessagingScreen;
