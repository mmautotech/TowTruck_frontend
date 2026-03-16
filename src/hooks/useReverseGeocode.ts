// src/hooks/useReverseGeocode.ts

import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';

const cache = new Map<string, string>();

export default function useReverseGeocode(
  lat: number,
  lng: number
): { address: string } {

  const [address, setAddress] = useState('');
  const lastCoords = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {

    // ❌ invalid coordinates
    if (!lat || !lng || (lat === 0 && lng === 0)) {
      setAddress('');
      lastCoords.current = null;
      return;
    }

    // ❌ prevent duplicate calls
    if (lastCoords.current?.lat === lat && lastCoords.current?.lng === lng) {
      return;
    }

    lastCoords.current = { lat, lng };

    const key = `${lat},${lng}`;

    // ✅ return cached address if available
    if (cache.has(key)) {
      setAddress(cache.get(key)!);
      return;
    }

    let isActive = true;

    const timer = setTimeout(async () => {
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

          postalCode = '',
        } = place;

        const parts = [name, street, city, region, postalCode].filter(Boolean);
        const formattedAddress = parts.join(', ');

        // ✅ cache result
        cache.set(key, formattedAddress);

        setAddress(formattedAddress);

      } catch (error) {
        if (isActive) {
          setAddress('');
        }
      }
    }, 200); // small delay prevents many simultaneous calls

    return () => {
      isActive = false;
      clearTimeout(timer);
    };

  }, [lat, lng]);

  return { address };
}