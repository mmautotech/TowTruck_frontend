import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';

export default function useReverseGeocode(lat: number, lng: number): { address: string } {
  const [address, setAddress] = useState('');
  const lastCoords = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (lat === 0 && lng === 0) {
      setAddress('');
      lastCoords.current = null;
      return;
    }

    if (lastCoords.current?.lat === lat && lastCoords.current?.lng === lng) return;
    lastCoords.current = { lat, lng };

    let isActive = true;

    (async () => {
      try {
        const [place] = await Location.reverseGeocodeAsync({
          latitude: lat,
          longitude: lng,
        });

        if (!isActive || !place) {
          setAddress('');
          return;
        }

        const {
          name = '',
          street = '',
          city = '',
          region = '',
          country = '',
        } = place;

        const parts = [name, street, city, region, country].filter(Boolean);
        setAddress(parts.join(', '));
      } catch {
        if (isActive) setAddress('');
      }
    })();

    return () => {
      isActive = false;
    };
  }, [lat, lng]);

  return { address };
}
