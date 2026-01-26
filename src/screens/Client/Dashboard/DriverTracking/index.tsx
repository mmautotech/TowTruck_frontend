// src/screens/Client/Dashboard/ClientDriverTrackingScreen.tsx

import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  PanResponder,
  Platform,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getDistance } from 'geolib';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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
import { fetchGoogleApiKey } from '../../../../api/googleApi';

type NavigationProp = StackNavigationProp<ClientStackParamList, 'ClientDriverTrackingScreen'>;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ClientDriverTrackingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  // --- Hooks
  const [expanded, setExpanded] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(true);
  const [driverInfo, setDriverInfo] = useState<any>(null);
  const [driverLocation, setDriverLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const { notifications, markAsRead, refresh: refreshNotifications } = useNotifications();
  const [notificationModal, setNotificationModal] = useState<{
    visible: boolean;
    notif: (typeof notifications)[0] | null;
  }>({ visible: false, notif: null });

  const { unreadCount: socketUnreadCount, clearUnreadCount, socket } = useClientSocket();
  const mapRef = useRef<MapView | null>(null);

  const [googleApiKey, setGoogleApiKey] = useState<string | null>(null);

  // --- Card animation
  const CARD_COLLAPSED_HEIGHT = 100;
  const CARD_EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.46;

  const mapHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT - CARD_COLLAPSED_HEIGHT, SCREEN_HEIGHT - CARD_EXPANDED_HEIGHT],
  });
  const cardHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [CARD_COLLAPSED_HEIGHT, CARD_EXPANDED_HEIGHT],
  });

  const chevronRotation = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -30) expandCard();
        else if (gestureState.dy > 30) collapseCard();
      },
    })
  ).current;

  const expandCard = () => {
    Animated.spring(anim, { toValue: 1, useNativeDriver: false, damping: 12, stiffness: 150 }).start();
    setExpanded(true);
  };

  const collapseCard = () => {
    Animated.spring(anim, { toValue: 0, useNativeDriver: false, damping: 12, stiffness: 150 }).start();
    setExpanded(false);
  };

  const toggleExpand = () => (expanded ? collapseCard() : expandCard());

  const handleMessagePress = async () => {
    if (driverInfo?.truck?.id) {
      clearUnreadCount();
      navigation.navigate('MessagingScreen');
    } else {
      Alert.alert('Error', 'Driver information incomplete.');
    }
  };

  // --- Fetch Google API key once
  useEffect(() => {
    let isActive = true;
    fetchGoogleApiKey()
      .then(key => { if (isActive) setGoogleApiKey(key); })
      .catch(err => console.error('Failed to fetch Google API key', err));
    return () => { isActive = false; };
  }, []);

  // --- Fetch initial driver info ---
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

            const coords = data.truck.current_location?.coordinates;
            if (coords) setDriverLocation({ latitude: coords[1], longitude: coords[0] });
          }
        } catch (err: any) {
          setError(err.message || 'Failed to fetch driver tracking info');
        } finally {
          setLoading(false);
        }
      })();
      return () => { isActive = false; };
    }, [])
  );

  // --- Live driver location via socket ---
  useEffect(() => {
    if (!socket || !driverInfo?.truck?.id) return;

    const handleLocationUpdate = (event: any) => {
      if (event.type === 'driverLocationUpdate' && event.truckId === driverInfo.truck.id) {
        setDriverLocation({ latitude: event.latitude, longitude: event.longitude });
      }
    };

    socket.on('driverLocationUpdate', handleLocationUpdate);
    return () => socket.off('driverLocationUpdate', handleLocationUpdate);
  }, [socket, driverInfo?.truck?.id]);

  // --- Animate map to driver location ---
  useEffect(() => {
    if (driverLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        },
        500
      );
    }
  }, [driverLocation]);

  // --- Notification modal logic ---
  useEffect(() => {
    if (!driverInfo?.request_id) return;
    const relevantNotif = notifications
      .filter(
        n =>
          (n.type === 'rideReopened' || n.type === 'rideCompleted') &&
          n.ride_id === driverInfo.request_id &&
          !n.read
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    if (relevantNotif && !notificationModal.visible) {
      setNotificationModal({ visible: true, notif: relevantNotif });
    }
  }, [notifications, driverInfo?.request_id, notificationModal.visible]);

  const handleNotificationModalClose = async () => {
    if (notificationModal.notif?._id) {
      await markAsRead(notificationModal.notif._id);
      refreshNotifications();
    }
    setNotificationModal({ visible: false, notif: null });
    navigation.reset({ index: 0, routes: [{ name: 'ClientDashboardScreen' }] });
  };

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
        <Text style={{ color: 'red', fontSize: 16 }}>{error || 'Driver tracking unavailable'}</Text>
      </View>
    );
  }

  const { origin_location, dest_location, truck, offered_price, request_id } = driverInfo;

  const lat = driverLocation?.latitude ?? truck.current_location?.coordinates?.[1] ?? 33.6844;
  const lon = driverLocation?.longitude ?? truck.current_location?.coordinates?.[0] ?? 73.0479;

  const originLat = origin_location?.coordinates?.[1] ?? lat;
  const originLon = origin_location?.coordinates?.[0] ?? lon;
  const destLat = dest_location?.coordinates?.[1] ?? lat;
  const destLon = dest_location?.coordinates?.[0] ?? lon;

  const distanceMeters =
    getDistance({ latitude: lat, longitude: lon }, { latitude: originLat, longitude: originLon }) +
    getDistance({ latitude: originLat, longitude: originLon }, { latitude: destLat, longitude: destLon });

  const distanceMiles = (distanceMeters / 1609.344).toFixed(2);
  const estimatedTimeHours = (parseFloat(distanceMiles) / 60).toFixed(2);

  const avatarUri = truck.driver_photo?.startsWith('data:')
    ? truck.driver_photo
    : `data:image/jpeg;base64,${truck.driver_photo}`;

  const handleCancelPermanent = async (reason: string) => {
    setCancelModalVisible(false);
    setLoading(true);
    try {
      await cancelRideRequest(request_id, reason || 'User Cancelled the Ride');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to cancel ride.');
    } finally {
      setLoading(false);
      navigation.reset({ index: 0, routes: [{ name: 'ClientDashboardScreen' }] });
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
      navigation.reset({ index: 0, routes: [{ name: 'ClientDashboardScreen' }] });
    }
  };

  // --- Helper: render directions only if key & coords exist
  const directionsReady = Boolean(origin_location?.coordinates && dest_location?.coordinates && driverLocation && googleApiKey);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <HeaderMenuButton />

      <UniversalMessageModal
        visible={notificationModal.visible}
        onClose={handleNotificationModalClose}
        type={notificationModal.notif?.type as ModalType}
        message={notificationModal.notif?.message || ''}
      />

      {/* Map */}
      <Animated.View style={{ height: mapHeight }}>
        <MapView
          ref={mapRef}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={StyleSheet.absoluteFill}
          showsUserLocation
          initialRegion={{
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {/* Driver */}
          {driverLocation && <GlowingMarker latitude={driverLocation.latitude} longitude={driverLocation.longitude} />}

          {/* Origin & Destination */}
          {origin_location?.coordinates && (
            <Marker
              coordinate={{ latitude: origin_location.coordinates[1], longitude: origin_location.coordinates[0] }}
              title="Pickup"
              pinColor="green"
            />
          )}
          {dest_location?.coordinates && (
            <Marker
              coordinate={{ latitude: dest_location.coordinates[1], longitude: dest_location.coordinates[0] }}
              title="Destination"
              pinColor="red"
            />
          )}

          {/* Route Directions */}
          {driverLocation && origin_location?.coordinates && dest_location?.coordinates && googleApiKey && (
            <MapViewDirections
              origin={{ latitude: driverLocation.latitude, longitude: driverLocation.longitude }} // ✅ guaranteed not null
              waypoints={[{ latitude: originLat, longitude: originLon }]}
              destination={{ latitude: destLat, longitude: destLon }}
              apikey={googleApiKey}
              strokeWidth={4}
              strokeColor="#357EBD"
            />
          )}

        </MapView>
      </Animated.View>

      {/* Bottom Card */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.bottomCard, { height: cardHeight, bottom: insets.bottom, paddingBottom: insets.bottom + 12 }]}
      >
        <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFill} onPress={toggleExpand} />

        {/* Chevron */}
        <Animated.View style={[styles.chevron, { transform: [{ rotate: chevronRotation }] }]}>
          <Ionicons name="chevron-up" size={24} color="#fff" />
        </Animated.View>

        {/* Collapsed Card */}
        {!expanded && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: avatarUri }} style={[styles.avatar, { width: 60, height: 60, borderRadius: 30 }]} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.name}>
                {truck.first_name || ''} {truck.last_name || truck.user_name}
              </Text>
              <Text style={styles.infoText}>ETA: {estimatedTimeHours} hrs ({distanceMiles} mi)</Text>
            </View>
          </View>
        )}

        {/* Expanded Card */}
        {expanded && (
          <View style={{ alignItems: 'center', width: '100%' }}>
            <Text style={styles.headline}>Track Your Driver</Text>

            <Image source={{ uri: avatarUri }} style={styles.avatar} />

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
                  style={{ marginHorizontal: 2 }}
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

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setCancelModalVisible(true)}
                activeOpacity={0.85}
              >
                <Ionicons name="close-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.cancelText}>Cancel Ride</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.messageButton} onPress={handleMessagePress} activeOpacity={0.85}>
                <Ionicons name="chatbubble-ellipses-outline" size={21} color="#fff" style={styles.messageIcon} />
                <Text style={styles.messageText}>Message</Text>
                {socketUnreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{socketUnreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.View>

      <CancelRideModal
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        loading={loading}
        onCancelPermanent={handleCancelPermanent}
        onReopen={handleReopen}
      />
    </SafeAreaView>
  );
};

export default ClientDriverTrackingScreen;
