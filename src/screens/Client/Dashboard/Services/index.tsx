import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { LatLng } from 'react-native-maps';
import { getDistance } from 'geolib';

import CustomHeader from '../../../../components/CustomHeader';
import OfferModal from '../../../../components/OfferModal';
import ServicesList from './ServicesList';
import { useLocation } from '../../../../hooks/useLocation';
import { useReverseGeocode } from '../../../../hooks/useReverseGeocode';
import {
  fetchActiveRequest,
  cancelRideRequest,
  postCounterOffer,
  acceptRideOffer,
  RideRequest,
} from '../../../../api';
import styles from './styles';
import type { ClientStackParamList } from '../../../../types';

type NavProp = StackNavigationProp<ClientStackParamList, 'ClientServicesScreen'>;

const ClientServicesScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { coords: userCoords, error: locError, loading: locLoading } = useLocation();

  const [request, setRequest] = useState<RideRequest | null>(null);
  const [loadingRequest, setLoadingRequest] = useState(true);
  const [refetchOffers, setRefetchOffers] = useState<() => void>(() => () => { });
  const [isAccepting, setIsAccepting] = useState(false);

  // Reverse geocode hook
  const { reverseGeocode } = useReverseGeocode();
  const [originAddress, setOriginAddress] = useState('Loading...');
  const [destinationAddress, setDestinationAddress] = useState('Loading...');

  // 1. Load the single active ride request on mount
  useEffect(() => {
    (async () => {
      try {
        const req = await fetchActiveRequest();
        if (!req) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'ClientDashboardScreen' }],
            })
          );
          return;
        }
        setRequest(req);
      } catch (e: any) {
        Alert.alert('Error', e.response?.data?.message || e.message || 'Failed to load request');
      } finally {
        setLoadingRequest(false);
      }
    })();
  }, [navigation]);

  // 2. Show any location error
  useEffect(() => {
    if (locError) {
      Alert.alert('Location Error', locError);
    }
  }, [locError]);

  // 3. Prepare coords
  const originCoords: LatLng = request
    ? {
      latitude: request.origin_location.coordinates[1],
      longitude: request.origin_location.coordinates[0],
    }
    : { latitude: 0, longitude: 0 };

  const destCoords: LatLng = request
    ? {
      latitude: request.dest_location.coordinates[1],
      longitude: request.dest_location.coordinates[0],
    }
    : { latitude: 0, longitude: 0 };

  // 4. Fetch addresses asynchronously
  useEffect(() => {
    if (!request) return;
    let active = true;

    (async () => {
      try {
        const origin = await reverseGeocode(originCoords);
        const dest = await reverseGeocode(destCoords);
        if (!active) return;
        setOriginAddress(origin);
        setDestinationAddress(dest);
      } catch {
        if (!active) return;
        setOriginAddress('Unknown location');
        setDestinationAddress('Unknown location');
      }
    })();

    return () => {
      active = false;
    };
  }, [request, originCoords, destCoords, reverseGeocode]);

  // 5. Always calculate distance
  const distanceMiles = useMemo(() => {
    const m = getDistance(originCoords, destCoords);
    return (m / 1609.344).toFixed(2);
  }, [originCoords, destCoords]);

  // 6. Counter-offer modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [counterOfferPrice, setCounterOfferPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 7. ACCEPT OFFER handler
  const handleAcceptOffer = useCallback(
    async (offerId: string) => {
      if (!request) return;
      setIsAccepting(true);
      try {
        const res = await acceptRideOffer(request._id, offerId);
        if (!res.success) throw new Error(res.message || 'Accept failed');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'ClientDriverTrackingScreen' }],
          })
        );
      } catch (err: any) {
        Alert.alert('Error', err.response?.data?.message || err.message || 'Could not accept offer');
      } finally {
        setIsAccepting(false);
      }
    },
    [navigation, request]
  );

  // 8. OPEN “COUNTER OFFER” modal
  const onCounterPress = useCallback((offerId: string) => {
    setSelectedOfferId(offerId);
    setCounterOfferPrice('');
    setShowModal(true);
  }, []);

  // 9. CANCEL RIDE REQUEST
  const handleCancelRequest = useCallback(() => {
    if (!request) return;
    Alert.alert('Cancel Ride Request', 'Are you sure?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await cancelRideRequest(request._id);
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'ClientDashboardScreen' }],
              })
            );
          } catch {
            Alert.alert('Cancel Failed', 'Could not cancel');
          }
        },
      },
    ]);
  }, [navigation, request]);

  // 10. SUBMIT COUNTER-OFFER
  const submitCounterOffer = useCallback(async () => {
    if (!request || !selectedOfferId) return;
    setIsSubmitting(true);
    try {
      const res = await postCounterOffer(selectedOfferId, parseFloat(counterOfferPrice));
      if (!res.success) throw new Error(res.message || 'Counter offer failed');
      Alert.alert('Success', 'Counter offer sent');
      setShowModal(false);
      refetchOffers();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || e.message || 'Submit failed');
    } finally {
      setIsSubmitting(false);
    }
  }, [request, selectedOfferId, counterOfferPrice, refetchOffers]);

  // 11. Show loading spinner until ready
  if (loadingRequest || !request || !userCoords || locLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#357EBD" />
        <Text style={styles.loadingText}>Loading Tow Truck Offers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="Available Services" />

      {/* Vehicle + Request Details */}
      <View style={styles.requestDetailsCompact}>
        <Text style={styles.requestHeader}>Your Vehicle Details</Text>
        <Text style={styles.compactLine}>
          <Text style={styles.valueTheme}>
            {request.vehicle_details.make} {request.vehicle_details.model} (
            {request.vehicle_details.registration})
          </Text>
        </Text>
        <Text style={styles.compactLine}>
          <Text style={styles.labelGray}>Pickup Date: </Text>
          <Text style={styles.valueTheme}>
            {new Date(request.pickup_date).toLocaleDateString()}
          </Text>
        </Text>
        <Text style={styles.compactLine}>
          <Text style={styles.labelGray}>Origin: </Text>
          <Text style={styles.valueTheme}>{originAddress}</Text>
        </Text>
        <Text style={styles.compactLine}>
          <Text style={styles.labelGray}>Destination: </Text>
          <Text style={styles.valueTheme}>{destinationAddress}</Text>
        </Text>
        <Text style={styles.compactLine}>
          <Text style={styles.labelGray}>Distance: </Text>
          <Text style={styles.valueTheme}>{distanceMiles} mi</Text>
        </Text>
      </View>

      {/* Offers List */}
      <ServicesList
        requestId={request._id}
        originCoords={originCoords}
        userCoords={userCoords}
        onAccept={handleAcceptOffer}
        onCounterPress={onCounterPress}
        onRefetchReady={(fn) => setRefetchOffers(() => fn)}
        isAccepting={isAccepting}
      />

      {/* Cancel Request button */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={handleCancelRequest}
        disabled={isSubmitting || isAccepting}
      >
        <Text style={styles.cancelText}>Cancel Request</Text>
      </TouchableOpacity>

      {/* Counter Offer Modal */}
      <OfferModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={submitCounterOffer}
        isLoading={isSubmitting}
        isValid={parseFloat(counterOfferPrice) > 0}
        price={counterOfferPrice}
        onChangePrice={setCounterOfferPrice}
        showTimeInputs={false}
        title="Make a Counter Offer"
      />
    </View>
  );
};

export default ClientServicesScreen;
