// TruckServiceScreen.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Animated,
  TextInput,
} from 'react-native';
import { getDistance } from 'geolib';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchActiveServiceForTruck } from '../../../../api/truck';
import { CompleteRide, reopenRideRequest } from '../../../../api/rideRequest';
import type { ServiceResponse } from '../../../../api/types';
import HeaderMenuButton from '../../../../components/HeaderMenuButton';
import { useReverseGeocode } from '../../../../hooks/useReverseGeocode';
import { useLocation } from '../../../../hooks/useLocation';
import type { StackNavigationProp } from '@react-navigation/stack';
import { TruckStackParamList } from '../../../../types';
import { socket } from '../../../../utils/socket';
import { setItem } from '../../../../utils/asyncStorage';
import ConfirmModal from '../../../../components/ConfirmModal';
import Map from '../../../../components/Map';
import UniversalMessageModal from '../../../../components/UniversalMessageModal';
import { useNotifications } from '../../../../hooks/useNotifications';
import { hp } from '../../../../utils/responsive';
import { fetchGoogleApiKey } from '../../../../api/googleApi';
import styles from './styles';


const EXPANDED_HEIGHT = hp(60);
const COLLAPSED_HEIGHT = hp(5);

type NavProp = StackNavigationProp<TruckStackParamList, 'TruckServiceScreen'>;

const TruckServiceScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { coords: currentCoords } = useLocation();
  const slideAnim = useRef(new Animated.Value(EXPANDED_HEIGHT)).current;
  const [isExpanded, setIsExpanded] = useState(true);
  const [panelHeight, setPanelHeight] = useState(EXPANDED_HEIGHT);

  const [service, setService] = useState<ServiceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultModal, setResultModal] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
  const [confirmModal, setConfirmModal] = useState<{ visible: boolean; action: 'cancel' | 'complete' | null }>({ visible: false, action: null });
  const [cancelReason, setCancelReason] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  const { notifications, refresh: refreshNotifications, markAsRead } = useNotifications();
  const [universalModal, setUniversalModal] = useState<{
    visible: boolean;
    type?: 'rideReopened' | 'rideCancelled';
    title?: string;
    message: string;
    onClose?: () => void;
  }>({ visible: false, message: '' });

  const [googleApiKey, setGoogleApiKey] = useState<string | null>(null);
  const { reverseGeocode } = useReverseGeocode();
  const [originAddr, setOriginAddr] = useState<string>('Unknown Location');
  const [destAddr, setDestAddr] = useState<string>('Unknown Location');

  const originLat = service?.origin_location?.coordinates?.[1];
  const originLng = service?.origin_location?.coordinates?.[0];
  const destLat = service?.dest_location?.coordinates?.[1];
  const destLng = service?.dest_location?.coordinates?.[0];

  const originCoords = originLat != null && originLng != null ? { latitude: originLat, longitude: originLng } : null;
  const destCoords = destLat != null && destLng != null ? { latitude: destLat, longitude: destLng } : null;

  // Reverse geocode origin
  useEffect(() => {
    if (originCoords) {
      reverseGeocode(originCoords)
        .then(addr => setOriginAddr(addr || `${originCoords.latitude.toFixed(3)}, ${originCoords.longitude.toFixed(3)}`))
        .catch(() => setOriginAddr(`${originCoords.latitude.toFixed(3)}, ${originCoords.longitude.toFixed(3)}`));
    }
  }, [originCoords, reverseGeocode]);

  // Reverse geocode destination
  useEffect(() => {
    if (destCoords) {
      reverseGeocode(destCoords)
        .then(addr => setDestAddr(addr || `${destCoords.latitude.toFixed(3)}, ${destCoords.longitude.toFixed(3)}`))
        .catch(() => setDestAddr(`${destCoords.latitude.toFixed(3)}, ${destCoords.longitude.toFixed(3)}`));
    }
  }, [destCoords, reverseGeocode]);

  // Fetch Google API Key once
  useEffect(() => {
    fetchGoogleApiKey()
      .then(key => setGoogleApiKey(key))
      .catch(err => console.error('Failed to fetch Google API key:', err));
  }, []);

  const playMessageSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../../../assets/sounds/message.mp3'),
        { shouldPlay: true }
      );
      await sound.playAsync();
    } catch { }
  };

  const loadService = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const svc = await fetchActiveServiceForTruck();
      if (!svc) {
        navigation.dispatch(CommonActions.reset({
          index: 0,
          routes: [{ name: 'TruckDashboardScreen' }],
        }));
        return;
      }
      setService(svc);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load service');
    } finally {
      setLoading(false);
    }
  }, [navigation]);

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

  useEffect(() => {
    if (service?.client?.client_id) {
      setItem('reciever_id', service.client.client_id);
    }
  }, [service?.client?.client_id]);

  const [animating, setAnimating] = useState(false);
  const togglePanel = () => {
    if (animating) return;
    setAnimating(true);
    Animated.timing(slideAnim, {
      toValue: isExpanded ? COLLAPSED_HEIGHT : EXPANDED_HEIGHT,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setIsExpanded(prev => !prev);
      setAnimating(false);
    });
  };

  const handleCancelRide = () => setConfirmModal({ visible: true, action: 'cancel' });
  const handleCompleteRide = () => setConfirmModal({ visible: true, action: 'complete' });

  const handleConfirmCancel = async () => {
    setConfirmModal({ visible: false, action: null });
    try {
      await reopenRideRequest(service?._id || '', cancelReason);
      setCancelReason('');
      setResultModal({ visible: true, message: 'You have cancelled the accepted ride.' });
      loadService();
    } catch {
      setCancelReason('');
      setResultModal({ visible: true, message: 'Failed to cancel ride. Please try again.' });
      loadService();
    }
  };

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
    } catch {
      setResultModal({ visible: true, message: 'Failed to complete ride. Please try again.' });
      loadService();
    }
  };

  const handleCloseResultModal = () => {
    setResultModal({ visible: false, message: '' });
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'TruckDashboardScreen' }] }));
  };

  if (loading || !googleApiKey) return (
    <SafeAreaView style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#357EBD" />
      <Text style={styles.loadingText}>Loading service details…</Text>
    </SafeAreaView>
  );

  if (errorMsg) return (
    <SafeAreaView style={styles.errorContainer}>
      <Text style={styles.errorText}>{errorMsg}</Text>
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() =>
          navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'TruckDashboardScreen' }] }))
        }
      >
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  if (!service) return null;

  const { pickup_date, vehicle_details, offers, status } = service;
  const metersPickupToDrop = originCoords && destCoords ? getDistance(originCoords, destCoords) : 0;
  const pickupToDropMiles = metersPickupToDrop / 1609.344;
  const currentToPickupMiles = currentCoords && originCoords ? getDistance(currentCoords, originCoords) / 1609.344 : 0;
  const currentToPickupStr = currentToPickupMiles.toFixed(2);
  const totalToDropoffMilesStr = (currentToPickupMiles + pickupToDropMiles).toFixed(2);

  const latitudeDelta = originCoords && destCoords ? Math.abs(originCoords.latitude - destCoords.latitude) * 1.5 || 0.05 : 0.05;
  const longitudeDelta = originCoords && destCoords ? Math.abs(originCoords.longitude - destCoords.longitude) * 1.5 || 0.05 : 0.05;
  const midLatitude = originCoords && destCoords ? (originCoords.latitude + destCoords.latitude) / 2 : originCoords ? originCoords.latitude : 0;
  const midLongitude = originCoords && destCoords ? (originCoords.longitude + destCoords.longitude) / 2 : originCoords ? originCoords.longitude : 0;

  return (
    <SafeAreaView style={styles.container}>
      <UniversalMessageModal visible={universalModal.visible} type={universalModal.type} title={universalModal.title} message={universalModal.message} onClose={universalModal.onClose!} />
      <UniversalMessageModal visible={resultModal.visible} type={resultModal.message.startsWith('Congratulations') ? 'success' : 'notice'} title={resultModal.message.startsWith('Congratulations') ? 'Success' : 'Notice'} message={resultModal.message} onClose={handleCloseResultModal} />
      <HeaderMenuButton />

      <Animated.View style={{ height: Animated.subtract(hp(100), slideAnim) }}>
        <Map
          region={{ latitude: midLatitude, longitude: midLongitude, latitudeDelta, longitudeDelta }}
          originCoords={originCoords}
          destCoords={destCoords}
          onMapPress={() => { }}
          currentCoords={currentCoords}
          bottomOffset={panelHeight}
          autoFitRoute={!!originCoords && !!destCoords && !isExpanded}
          googleApiKey={googleApiKey} // Pass API key properly
        />
      </Animated.View>



      <Animated.View style={[styles.detailsPanel, { height: slideAnim }]}>
        <TouchableOpacity onPress={togglePanel} style={styles.arrowContainer}>
          <Icon name={isExpanded ? 'keyboard-arrow-down' : 'keyboard-arrow-up'} size={28} color="#fff" />
        </TouchableOpacity>

        {isExpanded && (
          <>
            <ScrollView contentContainerStyle={styles.detailsContent}>
              <View style={styles.row}>
                <Text style={styles.label}>Time to Reach:</Text>
                <Text style={styles.value}>{offers?.time_to_reach ?? '-'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Price:</Text>
                <Text style={styles.price_value}>£{offers?.offered_price?.toFixed(2) ?? '-'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Pickup Date:</Text>
                <Text style={styles.value}>
                  {pickup_date ? new Date(pickup_date).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  }) : '-'}
                </Text>
              </View>

              <View style={styles.row}>
                <Icon name="place" size={18} color="green" style={{ marginRight: 5 }} />
                <Text style={styles.label}>Pickup Location:</Text>
                <Text style={styles.value}>
                  {originAddr} ({currentToPickupStr} mi)
                </Text>
              </View>

              <View style={styles.row}>
                <Icon name="place" size={18} color="red" style={{ marginRight: 5 }} />
                <Text style={styles.label}>Drop-off Location:</Text>
                <Text style={styles.value}>
                  {destAddr} ({totalToDropoffMilesStr} mi)
                </Text>
              </View>

              {vehicle_details && (
                <>
                  <View style={styles.row}>
                    <Text style={styles.label}>Vehicle:</Text>
                    <Text style={styles.value}>
                      {vehicle_details.make} {vehicle_details.model} — Reg: {vehicle_details.registration}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Wheels Category:</Text>
                    <Text style={styles.value}>
                      {vehicle_details.wheels_category?.charAt(0).toUpperCase() + vehicle_details.wheels_category?.slice(1)}
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
                        {vehicle_details.loaded?.charAt(0).toUpperCase() + vehicle_details.loaded?.slice(1)}
                      </Text>
                    </View>
                  )}
                </>
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

      <ConfirmModal
        visible={confirmModal.visible}
        title={confirmModal.action === 'cancel' ? 'Cancel Ride' : 'Complete Ride'}
        message={confirmModal.action === 'cancel'
          ? 'Are you sure you want to cancel this ride?'
          : 'Mark this ride as complete?'}
        confirmText={confirmModal.action === 'cancel' ? 'Yes, Cancel' : 'Yes, Complete'}
        cancelText="No"
        onConfirm={confirmModal.action === 'cancel' ? handleConfirmCancel : handleConfirmComplete}
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
