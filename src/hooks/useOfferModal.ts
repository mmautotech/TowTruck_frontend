// src/hooks/useOfferModal.ts

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { upsertRideOffer as addOffer } from '../api'; 
import { getDistance } from 'geolib';

/**
 * Hook: useOfferModal
 * Opens a modal for the truck to add/update an offer on a ride request.
 *
 * @param requestId    The ID of the ride request we’re offering on.
 * @param initialData  If we’ve already placed an offer, this contains { offered_price, days, hours, minutes }.
 */
export default function useOfferModal(
  requestId: string,
  initialData?: {
    offered_price: number;
    days: number;
    hours: number;
    minutes: number;
  }
) {
  // Offer state
  const [offeredPrice, setOfferedPrice] = useState<number>(
    initialData?.offered_price ?? 0
  );
  const [days, setDays] = useState<number>(initialData?.days ?? 0);
  const [hours, setHours] = useState<number>(initialData?.hours ?? 0);
  const [minutes, setMinutes] = useState<number>(initialData?.minutes ?? 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // We assume the truck’s current location is available via some Location hook.
  const [truckLocation, setTruckLocation] = useState<{
    type: 'Point';
    coordinates: [number, number];
  }>({
    type: 'Point',
    coordinates: [0, 0], // placeholder; in real code, fetch from useLocation()
  });

  // Example: compute ETA string from days/hours/minutes
  const timeToReachString = `${days}d ${hours}h ${minutes}m`;

  // Calculate distance (example usage of getDistance; replace with real coords)
  const distanceMeters = getDistance(
    { latitude: truckLocation.coordinates[1], longitude: truckLocation.coordinates[0] },
    { latitude: 0, longitude: 0 } // replace with ride’s origin coords if needed
  );
  const distanceMiles = (distanceMeters / 1609.344).toFixed(2);

  // When the user taps “Submit Offer” in your modal, call this:
  const submitOffer = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // upsertRideOffer(requestId, offeredPrice, days, hours, minutes, { type: 'Point', coordinates: [...] })
      const response = await addOffer(
        requestId,
        offeredPrice,
        days,
        hours,
        minutes,
        truckLocation
      );

      if (response.success === false) {
        // Backend returned success: false
        const message = response.message || 'Failed to submit offer';
        setError(message);
        Alert.alert('Error', message);
        setIsSubmitting(false);
        return;
      }

      // If the upsert succeeded, you can close modal / update UI
      Alert.alert('Success', 'Your offer has been submitted.');
    } catch (err: any) {
      // If it’s a 401, upsertRideOffer will reject; you can handle it here if desired
      Alert.alert('Error', err.message || 'Could not submit offer');
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [requestId, offeredPrice, days, hours, minutes, truckLocation]);

  return {
    offeredPrice,
    setOfferedPrice,
    days,
    setDays,
    hours,
    setHours,
    minutes,
    setMinutes,
    timeToReachString,
    distanceMiles,
    isSubmitting,
    error,
    submitOffer,
  };
}
