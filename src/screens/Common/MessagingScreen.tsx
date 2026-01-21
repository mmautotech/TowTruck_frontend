import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import MessagingHeader from '../../components/MessagingHeader';
import { useChat } from '../../hooks/useChat';
import { ClientStackParamList } from '../../types';
import { getBasicInfo, BasicUserInfo } from '../../api/user';
import { markMessageAsRead } from '../../api/message';
import { useClientSocket } from '../../hooks/useClientSocket';
import { fetchActiveRequest } from '../../api/rideRequest';
import { getItem, setItem } from '../../utils/asyncStorage';
import styles from './styles';

type NavigationProp = StackNavigationProp<ClientStackParamList>;

const MessagingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const [receiverId, setReceiverId] = useState('');
  const [receiverInfo, setReceiverInfo] = useState<BasicUserInfo | null>(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [rideCompleted, setRideCompleted] = useState(false);
  const [text, setText] = useState('');

  const { messages, sendMessage, isLoading } = useChat(receiverId);
  const flatListRef = useRef<FlatList>(null);
  const { payload: rideCompletedPayload, clearPayload } = useClientSocket();

  // Handle ride completion alert
  const handleRideComplete = useCallback(
    (message = 'The driver has marked your ride as completed.') => {
      if (rideCompleted) return;
      setRideCompleted(true);
      Alert.alert('Ride Completed', message, [
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
      ]);
    },
    [rideCompleted, clearPayload, navigation]
  );

  // Fetch active request when screen focused
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setRideCompleted(false);

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

      return () => {
        isActive = false;
      };
    }, [navigation])
  );

  // Listen for ride completion from socket
  useEffect(() => {
    if (rideCompletedPayload && !rideCompleted) {
      handleRideComplete(rideCompletedPayload.message);
    }
  }, [rideCompletedPayload, handleRideComplete, rideCompleted]);

  // Load receiver and user info
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

  // Mark messages as read
  useFocusEffect(
    useCallback(() => {
      if (receiverId && currentUserId) {
        markMessageAsRead(receiverId).catch((err) =>
          console.error('[MessagingScreen] Failed to mark messages as read', err)
        );
      }
    }, [receiverId, currentUserId])
  );

  // Send message
  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText('');
  };

  // Render each message
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

  // Get receiver photo
  const getPhotoUri = () => {
    if (!receiverInfo?.profile_photo) return undefined;
    return receiverInfo.profile_photo.startsWith('data:')
      ? receiverInfo.profile_photo
      : `data:image/jpeg;base64,${receiverInfo.profile_photo}`;
  };

  // Scroll FlatList when keyboard opens
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      flatListRef.current?.scrollToEnd({ animated: true });
    });
    return () => showSubscription.remove();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      {isLoading || !receiverInfo ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0} // smaller offset for flush input
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              {/* Header */}
              <MessagingHeader
                name={receiverInfo.name}
                photo={getPhotoUri()}
                subtitle="You are chatting as Client"
                onBack={() => navigation.goBack()}
              />

              {/* Messages */}
              <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item._id}
                renderItem={renderMessage}
                contentContainerStyle={{ paddingBottom: 0 }} // no extra padding
                onContentSizeChange={() =>
                  flatListRef.current?.scrollToEnd({ animated: true })
                }
                onLayout={() =>
                  flatListRef.current?.scrollToEnd({ animated: true })
                }
                style={{ flex: 1 }}
              />

              {/* Input */}
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  backgroundColor: '#f5f5f5',
                  alignItems: 'flex-end',
                }}
              >
                <TextInput
                  value={text}
                  onChangeText={setText}
                  placeholder="Type a message"
                  style={{
                    flex: 1,
                    maxHeight: 120,
                    minHeight: 40,
                    backgroundColor: '#fff',
                    borderRadius: 25,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    fontSize: 16,
                  }}
                  multiline
                  onContentSizeChange={() =>
                    flatListRef.current?.scrollToEnd({ animated: true })
                  }
                />
                <TouchableOpacity
                  onPress={handleSend}
                  style={{
                    backgroundColor: '#357EBD',
                    paddingHorizontal: 18,
                    paddingVertical: 10,
                    borderRadius: 25,
                    marginLeft: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                    Send
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

export default MessagingScreen;
