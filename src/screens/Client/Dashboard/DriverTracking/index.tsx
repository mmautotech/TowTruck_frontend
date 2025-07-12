import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getDistance } from 'geolib';

import HeaderMenuButton from '../../../../components/HeaderMenuButton';
import GlowingMarker from '../../../../components/GlowingMarker';
import styles from './styles';
import { ClientStackParamList } from '../../../../types';
import {
  fetchDriverTrackingInfo,
  cancelRideRequest,
  reopenRideRequest,
} from '../../../../api/rideRequest';
import { useClientSocket } from '../../../../hooks/useClientSocket';
import { setItem } from '../../../../utils/asyncStorage';
import { CancelRideModal } from '../../../../components/CancelRideModal';
import { useNotifications } from '../../../../hooks/useNotifications';
import UniversalMessageModal, { ModalType } from '../../../../components/UniversalMessageModal';

type NavigationProp = StackNavigationProp<ClientStackParamList, 'ClientDriverTrackingScreen'>;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ClientDriverTrackingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [expanded, setExpanded] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(true);
  const [driverInfo, setDriverInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  // -- Notification Modal (for ride reopen/complete) --
  const { notifications, markAsRead, refresh: refreshNotifications, unreadCount } = useNotifications();
  const [notificationModal, setNotificationModal] = useState<{
    visible: boolean;
    notif: (typeof notifications)[0] | null;
  }>({ visible: false, notif: null });

  // Messaging badge still driven by socket:
  const {
    unreadCount: socketUnreadCount,
    clearUnreadCount,
  } = useClientSocket();

  // Animation for expand/collapse
  const mapHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT * 0.92, SCREEN_HEIGHT * 0.56],
  });

  const cardHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT * 0.1, SCREEN_HEIGHT * 0.46],
  });

  const toggleExpand = () => {
    Animated.timing(anim, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const handleMessagePress = async () => {
    if (driverInfo?.truck?.id) {
      clearUnreadCount();
      navigation.navigate('MessagingScreen');
    } else {
      Alert.alert('Error', 'Driver information incomplete.');
    }
  };

  // Fetch driver info on focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        setLoading(true);
        try {
          const data = await fetchDriverTrackingInfo();
          if (data && data.truck && isActive) {
            setDriverInfo(data);
            await setItem('reciever_id', data.truck.id);
          }
        } catch (err: any) {
          setError(err.message || 'Failed to fetch driver tracking info');
        } finally {
          setLoading(false);
        }
      })();
      return () => {
        isActive = false;
      };
    }, [])
  );

  // Notification modal logic (rideReopened/rideCompleted)
  useEffect(() => {
    if (!driverInfo?.request_id) return;
    // Find unread relevant notification
    const relevantNotif = notifications
      .filter(
        n =>
          (n.type === 'rideReopened' || n.type === 'rideCompleted') &&
          n.ride_id === driverInfo.request_id &&
          !n.read
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    if (relevantNotif && !notificationModal.visible) {
      setNotificationModal({
        visible: true,
        notif: relevantNotif,
      });
    }
  }, [notifications, driverInfo?.request_id, notificationModal.visible]);

  // Handle modal close: mark notification as read and go back to dashboard
  const handleNotificationModalClose = async () => {
    if (notificationModal.notif?._id) {
      await markAsRead(notificationModal.notif._id);
      refreshNotifications();
    }
    setNotificationModal({ visible: false, notif: null });
    navigation.reset({
      index: 0,
      routes: [{ name: 'ClientDashboardScreen' }],
    });
  };

  // Parse modal fields for UniversalMessageModal
  const notif = notificationModal.notif;
  let modalType: ModalType = 'info';
  let modalReason: string | undefined = undefined;

  if (notif) {
    if (notif.type === 'rideReopened' || notif.type === 'rideCompleted') {
      modalType = notif.type as ModalType;
      // Try to parse 'Reason: ...' from the message, if present
      if (notif.message?.toLowerCase().includes('reason:')) {
        const match = notif.message.match(/reason:\s*(.*)$/i);
        if (match && match[1]) modalReason = match[1];
      }
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#357EBD" />
        <Text style={{ marginTop: 12 }}>Fetching Driver Info...</Text>
      </View>
    );
  }

  if (error || !driverInfo || !driverInfo.truck) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: 'red', fontSize: 16 }}>
          {error || 'Driver tracking unavailable'}
        </Text>
      </View>
    );
  }

  // fetch driver tracking info in request_id for cancellation
  const { origin_location, dest_location, truck, offered_price, request_id } = driverInfo;

  const coords = truck?.current_location?.coordinates || null;
  const lat = coords?.[1] ?? 33.6844;
  const lon = coords?.[0] ?? 73.0479;

  const originLat = origin_location?.coordinates?.[1] ?? 0;
  const originLon = origin_location?.coordinates?.[0] ?? 0;
  const destLat = dest_location?.coordinates?.[1] ?? 0;
  const destLon = dest_location?.coordinates?.[0] ?? 0;

  const distanceMeters =
    getDistance({ latitude: lat, longitude: lon }, { latitude: originLat, longitude: originLon }) +
    getDistance({ latitude: originLat, longitude: originLon }, { latitude: destLat, longitude: destLon });

  const distanceMiles = (distanceMeters / 1609.344).toFixed(2);
  const estimatedTimeHours = (parseFloat(distanceMiles) / 60).toFixed(2);

  const avatarUri = truck.driver_photo?.startsWith('data:')
    ? truck.driver_photo
    : `data:image/jpeg;base64,${truck.driver_photo}`;

  // ===== Cancel Actions =====
  // Only notification triggers navigation!
  const handleCancelPermanent = async (reason: string) => {
    setCancelModalVisible(false);
    setLoading(true);
    try {
      await cancelRideRequest(request_id, reason || 'User Cancelled the Ride');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to cancel ride.');
    } finally {
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'ClientDashboardScreen' }],
      });
    }
  };

  const handleReopen = async (reason: string) => {
    setCancelModalVisible(false);
    setLoading(true);
    try {
      await reopenRideRequest(request_id, reason || 'Looking for a better offer');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to reopen ride.');
    } finally {
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'ClientDashboardScreen' }],
      });
    }
  };


  return (
    <View style={styles.container}>
      <HeaderMenuButton />

      {/* ==== Ride Status Notification Modal ==== */}
      <UniversalMessageModal
        visible={notificationModal.visible}
        onClose={handleNotificationModalClose}
        type={modalType}
        title={undefined}
        message={notif?.message || ''}
        reason={modalReason}
      />

      <Animated.View style={{ height: mapHeight }}>
        <MapView
          style={StyleSheet.absoluteFill}
          showsUserLocation
          initialRegion={{
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {coords && <GlowingMarker latitude={lat} longitude={lon} />}
        </MapView>
      </Animated.View>

      <Animated.View style={[styles.bottomCard, { height: cardHeight }]}>
        <TouchableOpacity
          activeOpacity={1}
          style={StyleSheet.absoluteFill}
          onPress={toggleExpand}
        />
        <Ionicons
          name={expanded ? 'chevron-down' : 'chevron-up'}
          size={24}
          color="#fff"
          style={styles.chevron}
        />

        <Text style={styles.headline}>Track Your Driver</Text>

        <Image
          source={{
            uri: avatarUri || 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>
          {truck.first_name || ''} {truck.last_name || truck.user_name}
        </Text>

        <View style={styles.ratingRow}>
          {[...Array(5)].map((_, i) => (
            <Ionicons
              key={i}
              name="star"
              size={16}
              color={i < Math.round(truck.rating) ? '#FFD700' : '#ccc'}
            />
          ))}
          <Text style={styles.rides}>({truck.ratings_count})</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Price: £{offered_price}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>ETA: {estimatedTimeHours} hrs ({distanceMiles} mi)</Text>
        </View>

        {/* ===== Button Row ===== */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setCancelModalVisible(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="close-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.cancelText}>Cancel Ride</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={handleMessagePress}
            activeOpacity={0.85}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={21}
              color="#fff"
              style={styles.messageIcon}
            />
            <Text style={styles.messageText}>Message</Text>
            {socketUnreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{socketUnreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Modal */}
      <CancelRideModal
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        loading={loading}
        onCancelPermanent={handleCancelPermanent}
        onReopen={handleReopen}
      />
    </View>
  );
};

export default ClientDriverTrackingScreen;
