import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  useNavigation,
  CommonActions,
  useFocusEffect,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import CustomHeader from '../../../components/CustomHeader';
import RequestList from './RequestList';
import OfferModal from '../../../components/OfferModal';
import IncompleteProfileMessage from '../../../components/IncompleteProfileMessage';
import AcceptRideModal from '../../../components/AcceptRideModal';

import { useLocation } from '../../../hooks/useLocation';
import {
  fetchActiveServiceForTruck,
  upsertRideOffer as postOffer,
  TruckRideRequest,
} from '../../../api';
import { fetchProfileStatus } from '../../../api/Profile';

import { TruckStackParamList } from '../../../types';
import styles from './styles';

import { useNotifications } from '../../../hooks/useNotifications';
import useReverseGeocode from '../../../hooks/useReverseGeocode';

// --- Helper: Parse backend notification message and extract coordinates as numbers
function parseAcceptedOfferMessage(message: string) {
  const clientMatch = message.match(/accepted by ([^\.\n]+)/i);
  const fromMatch = message.match(/Origin: \(([^\)]+)\)/i);
  const toMatch = message.match(/Destination: \(([^\)]+)\)/i);
  const priceMatch = message.match(/Price:\s*[£\$]?([0-9.]+)/i);

  let fromCoordsNum: [number, number] | null = null;
  if (fromMatch) {
    const [lat, lng] = fromMatch[1].split(',').map(s => parseFloat(s.trim()));
    if (!isNaN(lat) && !isNaN(lng)) fromCoordsNum = [lat, lng];
  }
  let toCoordsNum: [number, number] | null = null;
  if (toMatch) {
    const [lat, lng] = toMatch[1].split(',').map(s => parseFloat(s.trim()));
    if (!isNaN(lat) && !isNaN(lng)) toCoordsNum = [lat, lng];
  }

  return {
    clientName: clientMatch ? clientMatch[1].trim() : '',
    fromCoordsNum,
    toCoordsNum,
    offerPrice: priceMatch ? priceMatch[1].trim() : '',
  };
}

type NavProp = StackNavigationProp<TruckStackParamList, 'TruckDashboardScreen'>;

const TruckDashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { coords: userCoords, error: locError } = useLocation();

  // Profile checks and launch logic
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [profileStatus, setProfileStatus] = useState<{ profile_complete: boolean; status: string } | null>(null);

  // Offer modal state
  const [activeTab, setActiveTab] = useState<'new' | 'applied'>('new');
  const [selectedRequest, setSelectedRequest] = useState<TruckRideRequest | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [days, setDays] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Notification logic
  const {
    notifications,
    loading: notifLoading,
    refresh: refreshNotifications,
    markAsRead,
  } = useNotifications();

  const [hasLoadedNotifications, setHasLoadedNotifications] = useState(false);
  const [shownNotifId, setShownNotifId] = useState<string | null>(null);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [acceptRideData, setAcceptRideData] = useState<{
    clientName: string;
    fromCoordsNum: [number, number] | null;
    toCoordsNum: [number, number] | null;
    offerPrice: string;
  } | null>(null);

  // --- Set hasLoadedNotifications when notifications are first fetched
  useEffect(() => {
    if (!notifLoading) setHasLoadedNotifications(true);
  }, [notifLoading]);

  // --- Always refresh notifications on focus
  useFocusEffect(
    useCallback(() => {
      refreshNotifications();
    }, [refreshNotifications])
  );

  // --- Show notification modal if needed, otherwise check for active ride
  useEffect(() => {
    // Only run when notifications have loaded at least once
    if (!hasLoadedNotifications || notifLoading) return;

    // 1. Priority: show rideAccepted notification if unread exists
    const unreadRideAccepted = notifications.find(
      n => n.type === 'rideAccepted' && !n.read
    );
    if (unreadRideAccepted && shownNotifId !== unreadRideAccepted._id) {
      const parsed = parseAcceptedOfferMessage(unreadRideAccepted.message);
      setAcceptRideData(parsed);
      setShowNotifModal(true);
      setShownNotifId(unreadRideAccepted._id);
      return;
    }

    // 2. Only check active service if NO notification is being shown and NO unread notification exists
    if (!showNotifModal && !unreadRideAccepted) {
      fetchActiveServiceForTruck()
        .then((svc) => {
          if (svc) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'TruckServiceScreen' }],
              })
            );
          }
        })
        .catch(() => {});
    }
  }, [hasLoadedNotifications, notifLoading, notifications, showNotifModal, shownNotifId, navigation]);

  // --- Reverse geocode addresses (from and to) when coords change
  const { address: fromAddress } = useReverseGeocode(
  acceptRideData?.fromCoordsNum?.[0] ?? 0,
  acceptRideData?.fromCoordsNum?.[1] ?? 0
);
const { address: toAddress } = useReverseGeocode(
  acceptRideData?.toCoordsNum?.[0] ?? 0,
  acceptRideData?.toCoordsNum?.[1] ?? 0
);


  // --- Handle AcceptRideModal OK
  const handleNotifOk = useCallback(async () => {
    if (shownNotifId) {
      await markAsRead(shownNotifId);
    }
    setShowNotifModal(false);
    // IMMEDIATELY check for active ride and navigate
    try {
      const svc = await fetchActiveServiceForTruck();
      if (svc) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'TruckServiceScreen' }],
          })
        );
      }
    } catch (e) {
      // Optionally handle error
    }
  }, [shownNotifId, markAsRead, navigation]);

  // --- Profile status check on focus
  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        setCheckingProfile(true);
        try {
          const res = await fetchProfileStatus();
          if (mounted) setProfileStatus({ profile_complete: res.profile_complete, status: res.status });
        } catch {
          if (mounted) setProfileStatus({ profile_complete: false, status: 'blocked' });
        } finally {
          if (mounted) setCheckingProfile(false);
        }
      })();
      return () => { mounted = false; };
    }, [])
  );

  // --- Helpers for offer modal
  const parseTimeString = useCallback((str: string) => {
    const d = str.match(/(\d+)d/);
    const h = str.match(/(\d+)h/);
    const m = str.match(/(\d+)m/);
    setDays(d ? d[1] : '');
    setHours(h ? h[1] : '');
    setMinutes(m ? m[1] : '');
  }, []);

  const openOfferModal = useCallback((req: TruckRideRequest) => {
    setSelectedRequest(req);
    if (activeTab === 'applied' && req.offer) {
      setOfferPrice(String(req.offer.offered_price));
      parseTimeString(req.offer.time_to_reach);
    } else {
      setOfferPrice(''); setDays(''); setHours(''); setMinutes('');
    }
    setShowOfferModal(true);
  }, [activeTab, parseTimeString]);

  const handleSubmit = useCallback(async () => {
    if (!selectedRequest) return;
    setIsSubmitting(true);
    try {
      if (!userCoords) {
        Alert.alert('Location error', 'Please enable location services.');
        return;
      }
      const point = {
        type: 'Point' as const,
        coordinates: [userCoords.longitude, userCoords.latitude] as [number, number],
      };
      await postOffer(
        selectedRequest.request_id,
        parseFloat(offerPrice),
        parseInt(days || '0'),
        parseInt(hours || '0'),
        parseInt(minutes || '0'),
        point
      );
      Alert.alert('Success', 'Offer submitted!');
      setShowOfferModal(false);
      setRefreshCounter(c => c + 1);
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to submit offer.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedRequest, offerPrice, days, hours, minutes, userCoords]);

  const isValidNew = useMemo(() =>
    parseFloat(offerPrice) > 0 &&
    (parseInt(days || '0') > 0 || parseInt(hours || '0') > 0 || parseInt(minutes || '0') > 0),
    [offerPrice, days, hours, minutes]
  );
  const isValidApplied = useMemo(() => parseFloat(offerPrice) > 0, [offerPrice]);
  const isValid = activeTab === 'new' ? isValidNew : isValidApplied;

  useEffect(() => {
    if (locError) Alert.alert('Location Error', locError);
  }, [locError]);

  useEffect(() => {
    if (activeTab !== 'new') return;
    const iv = setInterval(() => setRefreshCounter(c => c + 1), 15000);
    return () => clearInterval(iv);
  }, [activeTab]);

  // --- Render logic ---
  if (checkingProfile || !profileStatus) {
    return (
      <View style={[styles.container, { flex: 1, backgroundColor: '#F0F0F0' }]}>
        <CustomHeader title="Offer Your Service" />
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#357EBD" />
      </View>
    );
  }

  if (profileStatus.status === 'blocked' || !profileStatus.profile_complete) {
    return (
      <IncompleteProfileMessage
        status={profileStatus.status}
        profile_complete={profileStatus.profile_complete}
      />
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="Offer Your Service" />

      <View style={styles.toggleContainer}>
        {(['new', 'applied'] as const).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.toggleButton, activeTab === t && styles.activeToggleButton]}
            onPress={() => setActiveTab(t)}
          >
            <Text style={[styles.toggleText, activeTab === t && styles.activeToggleText]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <RequestList
        tab={activeTab}
        userLocation={userCoords}
        onPress={openOfferModal}
        refreshTrigger={refreshCounter}
      />

      <OfferModal
        isVisible={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        isValid={isValid}
        price={offerPrice}
        onChangePrice={setOfferPrice}
        showTimeInputs
        days={days}
        hours={hours}
        minutes={minutes}
        onChangeDays={setDays}
        onChangeHours={setHours}
        onChangeMinutes={setMinutes}
        title={activeTab === 'new' ? 'Make an Offer' : 'Update Your Offer'}
      />

      <AcceptRideModal
        visible={showNotifModal}
        clientName={acceptRideData?.clientName || ''}
        fromAddress={fromAddress || ''}
        toAddress={toAddress || ''}
        offerPrice={acceptRideData?.offerPrice || ''}
        onOk={handleNotifOk}
      />
    </View>
  );
};

export default TruckDashboardScreen;
