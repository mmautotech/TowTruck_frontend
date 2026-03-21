import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  TextInput,
} from 'react-native';
import { getDistance } from 'geolib';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Audio } from 'expo-av';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchActiveServiceForTruck } from '../../../../api/truck';
import { CompleteRide, reopenRideRequest } from '../../../../api/rideRequest';
import type { ServiceResponse } from '../../../../api/types';
import HeaderMenuButton from '../../../../components/HeaderMenuButton';
import useReverseGeocode from '../../../../hooks/useReverseGeocode';
import { useLocation } from '../../../../hooks/useLocation';
import type { StackNavigationProp } from '@react-navigation/stack';
import { TruckStackParamList } from '../../../../types';
import { socket } from '../../../../utils/socket';
import { setItem } from '../../../../utils/asyncStorage';
import ConfirmModal from '../../../../components/ConfirmModal';
import Map from '../../../../components/Map';
import UniversalMessageModal from '../../../../components/UniversalMessageModal';
import { useNotifications } from '../../../../hooks/useNotifications';
import { wp, hp } from '../../../../utils/responsive';
import styles from './styles';
import { useDriverLocationUpdater } from "../../../../hooks/useDriverLocationUpdater";

const EXPANDED_HEIGHT = hp(60); // 60% of screen height
const COLLAPSED_HEIGHT = hp(10); // approx. 40px on standard ~800px screen height

type NavProp = StackNavigationProp<TruckStackParamList, 'TruckServiceScreen'>;

const TruckServiceScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets(); // <-- Add this line
  const { coords: currentCoords } = useLocation();

  // Send driver GPS to backend automatically
  useDriverLocationUpdater(currentCoords!);

  // Animation
  const slideAnim = useRef(new Animated.Value(EXPANDED_HEIGHT)).current;
  const [isExpanded, setIsExpanded] = useState(true);
  const [panelHeight, setPanelHeight] = useState(EXPANDED_HEIGHT);

  // State
  const [service, setService] = useState<ServiceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultModal, setResultModal] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
  const [confirmModal, setConfirmModal] = useState<{ visible: boolean; action: 'cancel' | 'complete' | null }>({ visible: false, action: null });
  const [cancelReason, setCancelReason] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  // --- Notifications ---
  const { notifications, refresh: refreshNotifications, markAsRead } = useNotifications();
  const [universalModal, setUniversalModal] = useState<{
    visible: boolean;
    type?: 'rideReopened' | 'rideCancelled';
    title?: string;
    message: string;
    onClose?: () => void;
  }>({ visible: false, message: '' });
  const [shownNotificationId, setShownNotificationId] = useState<string | null>(null);

  // Effect: show notification for current ride, only once per notification
  useEffect(() => {
    if (!service?._id) return;
    const notifToShow = notifications
      .filter(
        n =>
          (n.type === 'rideReopened' || n.type === 'rideCancelled') &&
          n.ride_id === service._id &&
          !n.read &&
          n._id !== shownNotificationId
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    if (notifToShow) {
      setUniversalModal({
        visible: true,
        type: notifToShow.type as 'rideReopened' | 'rideCancelled',
        title: notifToShow.type === 'rideReopened' ? 'Ride Reopened' : 'Ride Cancelled',
        message: notifToShow.message,
        onClose: async () => {
          setUniversalModal({ visible: false, message: '' });
          setShownNotificationId(notifToShow._id);
          try {
            await markAsRead(notifToShow._id); // Marks notification as read
          } catch { }
          refreshNotifications();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'TruckDashboardScreen' }],
            })
          );
        },
      });
    }
  }, [notifications, service?._id, shownNotificationId, refreshNotifications, navigation, markAsRead]);

  // Keep panelHeight in sync with animation
  useEffect(() => {
    const id = slideAnim.addListener(({ value }) => setPanelHeight(value));
    return () => slideAnim.removeListener(id);
  }, [slideAnim]);

  // Map helpers
  const originLat = service?.origin_location?.coordinates?.[1] ?? 0;
  const originLng = service?.origin_location?.coordinates?.[0] ?? 0;
  const destLat = service?.dest_location?.coordinates?.[1] ?? 0;
  const destLng = service?.dest_location?.coordinates?.[0] ?? 0;
  const originCoords = originLat && originLng ? { latitude: originLat, longitude: originLng } : null;
  const destCoords = destLat && destLng ? { latitude: destLat, longitude: destLng } : null;

  const { address: originAddress } = useReverseGeocode(originLat, originLng);
  const { address: destinationAddress } = useReverseGeocode(destLat, destLng);

  // Play sound on unread message
  const playMessageSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../../../assets/sounds/message.mp3'),
        { shouldPlay: true }
      );
      await sound.playAsync();
    } catch { }
  };

  // Centralized loader: if no service, auto-navigate away
  const loadService = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const svc = await fetchActiveServiceForTruck();
      if (!svc) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'TruckDashboardScreen' }],
          })
        );
        return;
      }
      setService(svc);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load service');
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  // Socket and chat listeners
  useEffect(() => {
    loadService();
    socket?.on('service-updated', loadService);
    const handleMessageReceived = (payload: any) => {
      setUnreadCount(payload.count);
      playMessageSound();
    };
    socket?.on('message:received', handleMessageReceived);
    return () => {
      socket?.off('service-updated', loadService);
      socket?.off('message:received', handleMessageReceived);
    };
  }, [loadService]);

  // Save client id for messaging
  useEffect(() => {
    if (service?.client?.client_id) {
      setItem('reciever_id', service.client.client_id);
    }
  }, [service?.client?.client_id]);

  // Panel toggle
  const [animating, setAnimating] = useState(false);
  const togglePanel = () => {
    if (animating) return;
    setAnimating(true);
    Animated.timing(slideAnim, {
      toValue: isExpanded ? COLLAPSED_HEIGHT : EXPANDED_HEIGHT,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setIsExpanded((prev) => !prev);
      setAnimating(false);
    });
  };

  // Cancel/Complete modal handlers
  const handleCancelRide = () => setConfirmModal({ visible: true, action: 'cancel' });
  const handleCompleteRide = () => setConfirmModal({ visible: true, action: 'complete' });

  // Confirm cancel
  const handleConfirmCancel = async () => {
    setConfirmModal({ visible: false, action: null });
    try {
      await reopenRideRequest(service?._id || '', cancelReason);
      setCancelReason('');
      setResultModal({
        visible: true,
        message: 'You have cancelled the accepted ride.',
      });
      loadService();
    } catch (err: any) {
      setCancelReason('');
      setResultModal({
        visible: true,
        message: 'Failed to cancel ride. Please try again.',
      });
      loadService();
    }
  };

  // Confirm complete
  const handleConfirmComplete = async () => {
    setConfirmModal({ visible: false, action: null });
    try {
      const res = await CompleteRide(service?._id || '');
      setResultModal({
        visible: true,
        message: res.success
          ? 'Congratulations! You have successfully completed the ride.'
          : (res.message || 'Failed to complete ride. Please try again.'),
      });
      loadService();
    } catch (err: any) {
      setResultModal({
        visible: true,
        message: 'Failed to complete ride. Please try again.',
      });
      loadService();
    }
  };

  // Dismiss result modal, always go back to dashboard
  const handleCloseResultModal = () => {
    setResultModal({ visible: false, message: '' });
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'TruckDashboardScreen' }],
      })
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#357EBD" />
        <Text style={styles.loadingText}>Loading service details…</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() =>
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'TruckDashboardScreen' }],
              })
            )
          }
        >
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!service) return null;

  // --- Main UI ---
  const {
    pickup_date,
    vehicle_details,
    offers,
    status,
  } = service;

  const metersPickupToDrop = originCoords && destCoords ? getDistance(originCoords, destCoords) : 0;
  const pickupToDropMiles = metersPickupToDrop / 1609.344;

  let currentToPickupMiles = 0;
  if (currentCoords && originCoords) {
    currentToPickupMiles = getDistance(currentCoords, originCoords) / 1609.344;
  }

  const currentToPickupStr = currentToPickupMiles.toFixed(2);
  const totalToDropoffMilesStr = (
    currentToPickupMiles + pickupToDropMiles
  ).toFixed(2);

  const latitudeDelta =
    originCoords && destCoords
      ? Math.abs(originCoords.latitude - destCoords.latitude) * 1.5 || 0.05
      : 0.05;
  const longitudeDelta =
    originCoords && destCoords
      ? Math.abs(originCoords.longitude - destCoords.longitude) * 1.5 || 0.05
      : 0.05;
  const midLatitude =
    originCoords && destCoords
      ? (originCoords.latitude + destCoords.latitude) / 2
      : originCoords
        ? originCoords.latitude
        : 0;
  const midLongitude =
    originCoords && destCoords
      ? (originCoords.longitude + destCoords.longitude) / 2
      : originCoords
        ? originCoords.longitude
        : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* --- Notification Modal --- */}
      <UniversalMessageModal
        visible={universalModal.visible}
        type={universalModal.type}
        title={universalModal.title}
        message={universalModal.message}
        onClose={universalModal.onClose!}
      />

      {/* --- Result Modal for Congratulation/Cancel --- */}
      <UniversalMessageModal
        visible={resultModal.visible}
        type={resultModal.message.startsWith('Congratulations') ? 'success' : 'notice'}
        title={resultModal.message.startsWith('Congratulations') ? 'Success' : 'Notice'}
        message={resultModal.message}
        onClose={handleCloseResultModal}
      />

      <HeaderMenuButton />

      <Animated.View
        style={{
          height: Animated.subtract(hp(100), slideAnim),
        }}
      >
        <Map
          originCoords={originCoords}
          destCoords={destCoords}
          onMapPress={() => { }}
          currentCoords={currentCoords}
          bottomOffset={panelHeight}
          autoFitRoute={!isExpanded}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.detailsPanel,
          {
            height: slideAnim,
            paddingBottom: isExpanded ? insets.bottom : 0, // <-- only when expanded
          },
        ]}
      >
        <TouchableOpacity onPress={togglePanel} style={styles.arrowContainer}>
          <Icon
            name={isExpanded ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
            size={28}
            color="#ffffff"
          />
        </TouchableOpacity>

        {isExpanded && (
          <>
            <ScrollView contentContainerStyle={styles.detailsContent}>
              <View style={styles.row}>
                <Text style={styles.label}>Time to Reach:</Text>
                <Text style={styles.value}>{offers.time_to_reach}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Price:</Text>
                <Text style={styles.price_value}>
                  £{offers.offered_price.toFixed(2)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Pickup Date:</Text>
                <Text style={styles.value}>
                  {new Date(pickup_date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
              </View>
              <View style={styles.row}>
                <Icon name="place" size={18} color="green" style={{ marginRight: 5 }} />
                <Text style={styles.label}>Pickup Location:</Text>
                <Text style={styles.value}>
                  {originAddress || 'Unknown'} ({currentToPickupStr} mi)
                </Text>
              </View>
              <View style={styles.row}>
                <Icon name="place" size={18} color="red" style={{ marginRight: 5 }} />
                <Text style={styles.label}>Drop-off Location:</Text>
                <Text style={styles.value}>
                  {destinationAddress || 'Unknown'} ({totalToDropoffMilesStr} mi)
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Vehicle:</Text>
                <Text style={styles.value}>
                  {vehicle_details.make} {vehicle_details.model} — Reg:{' '}
                  {vehicle_details.registration}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Wheels Category:</Text>
                <Text style={styles.value}>
                  {vehicle_details.wheels_category.charAt(0).toUpperCase() +
                    vehicle_details.wheels_category.slice(1)}
                </Text>
              </View>
              {vehicle_details.vehicle_category !== 'donot-apply' && (
                <View style={styles.row}>
                  <Text style={styles.label}>Vehicle Category:</Text>
                  <Text style={styles.value}>
                    {vehicle_details.vehicle_category.toUpperCase()}
                  </Text>
                </View>
              )}
              {vehicle_details.loaded !== 'Unloaded' && (
                <View style={styles.row}>
                  <Text style={styles.label}>Loaded:</Text>
                  <Text style={styles.value}>
                    {vehicle_details.loaded.charAt(0).toUpperCase() +
                      vehicle_details.loaded.slice(1)}
                  </Text>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.messageButton}
              onPress={() => {
                setUnreadCount(0);
                navigation.navigate('MessagingScreen');
              }}
              disabled={animating}
            >
              <Icon name="message" size={20} color="#ffffff" />
              <Text style={styles.messageButtonText}>Message</Text>
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* --- Action Buttons Row (Side by Side) --- */}
            {status !== 'completed' && status !== 'cancelled' && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={handleCancelRide}
                  disabled={animating}
                >
                  <Icon name="cancel" size={20} color="#fff" />
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.completeButton]}
                  onPress={handleCompleteRide}
                  disabled={animating}
                >
                  <Icon name="check-circle" size={20} color="#fff" />
                  <Text style={styles.completeButtonText}>Complete</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </Animated.View>

      {/* Confirmation Modal for Cancel/Complete */}
      <ConfirmModal
        visible={confirmModal.visible}
        title={
          confirmModal.action === 'cancel'
            ? 'Cancel Ride'
            : 'Complete Ride'
        }
        message={
          confirmModal.action === 'cancel'
            ? 'Are you sure you want to cancel this ride?'
            : 'Mark this ride as complete?'
        }
        confirmText={confirmModal.action === 'cancel' ? 'Yes, Cancel' : 'Yes, Complete'}
        cancelText="No"
        onConfirm={
          confirmModal.action === 'cancel'
            ? handleConfirmCancel
            : handleConfirmComplete
        }
        onCancel={() => {
          setConfirmModal({ visible: false, action: null });
          setCancelReason('');
        }}
      >
        {confirmModal.action === 'cancel' && (
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 8,
              padding: 10,
              marginTop: 14,
              marginBottom: 4,
              width: 240,
              alignSelf: 'center',
              fontSize: 16,
            }}
            placeholder="Enter cancellation reason"
            placeholderTextColor="#999"
            value={cancelReason}
            onChangeText={setCancelReason}
            multiline
            numberOfLines={3}
            maxLength={140}
          />
        )}
      </ConfirmModal>
    </SafeAreaView>
  );
};

export default TruckServiceScreen;