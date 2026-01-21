import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

type Coords = {
  latitude: number;
  longitude: number;
};

const extra =
  Constants.expoConfig?.extra ??
  (Constants as any).manifest?.extra;

const GOOGLE_API_KEY =
  Platform.OS === 'ios'
    ? extra?.iosMapsApiKey
    : extra?.androidMapsApiKey;

export const useReverseGeocode = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reverseGeocode = useCallback(async (coords?: Coords) => {
    if (!coords) return;

    const { latitude, longitude } = coords;

    if (!GOOGLE_API_KEY) {
      console.warn('Google Maps API key is missing');
      setAddress('Unknown location');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      );
      const data = await res.json();

      if (data.status === 'OK' && data.results?.length > 0) {
        setAddress(data.results[0].formatted_address);
      } else {
        setAddress('Unknown location');
      }
    } catch (err) {
      console.warn('Reverse geocoding failed:', err);
      setAddress('Unknown location');
    } finally {
      setLoading(false);
    }
  }, []);

  return { address, loading, reverseGeocode };
};
