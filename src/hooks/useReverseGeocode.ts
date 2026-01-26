import { useState, useCallback, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

type Coords = {
  latitude: number;
  longitude: number;
};

type GeocodeCacheItem = {
  latitude: number;
  longitude: number;
  address: string;
};

const COORD_PRECISION = 3; // ~100m precision
const CACHE_LIMIT = 50;
const STORAGE_KEY = 'reverseGeocodeCache';

export const useReverseGeocode = () => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const cacheRef = useRef<Map<string, GeocodeCacheItem>>(new Map());
  const ongoingRequestsRef = useRef<Map<string, Promise<GeocodeCacheItem>>>(new Map());

  // Load persistent cache on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: Record<string, GeocodeCacheItem> = JSON.parse(stored);
          cacheRef.current = new Map(Object.entries(parsed));
        }
      } catch (err) {
        console.warn('Failed to load geocode cache:', err);
      }
    })();
  }, []);

  // Save persistent cache
  const savePersistentCache = useCallback(async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Object.fromEntries(cacheRef.current))
      );
    } catch (err) {
      console.warn('Failed to save geocode cache:', err);
    }
  }, []);

  const getKey = useCallback(
    (lat: number, lng: number) => `${lat.toFixed(COORD_PRECISION)},${lng.toFixed(COORD_PRECISION)}`,
    []
  );

  const getCachedAddress = useCallback(
    (coords: Coords) => cacheRef.current.get(getKey(coords.latitude, coords.longitude))?.address,
    [getKey]
  );

  const reverseGeocode = useCallback(
    async (coords?: Coords): Promise<string> => {
      if (!coords) return 'Unknown location';
      const { latitude, longitude } = coords;
      const key = getKey(latitude, longitude);

      // Return cached value immediately
      if (cacheRef.current.has(key)) {
        const cached = cacheRef.current.get(key)!;
        setAddress(cached.address);
        return cached.address;
      }

      // Wait for ongoing request if exists
      if (ongoingRequestsRef.current.has(key)) {
        const cached = await ongoingRequestsRef.current.get(key)!;
        setAddress(cached.address);
        return cached.address;
      }

      setLoading(true);

      const requestPromise = (async () => {
        try {
          const results = await Location.reverseGeocodeAsync({ latitude, longitude });
          const addr = results[0];
          const finalAddress = addr
            ? `${addr.name ? addr.name + ', ' : ''}${addr.street ? addr.street + ', ' : ''}${addr.city ? addr.city + ', ' : ''}${addr.region ? addr.region + ', ' : ''}${addr.postalCode ? addr.postalCode + ', ' : ''}${addr.country || ''}`.replace(/,\s*$/, '')
            : 'Unknown location';

          const cacheItem: GeocodeCacheItem = { latitude, longitude, address: finalAddress };

          // Save in-memory cache
          cacheRef.current.set(key, cacheItem);
          if (cacheRef.current.size > CACHE_LIMIT) {
            const firstKey = cacheRef.current.keys().next().value;
            if (firstKey) cacheRef.current.delete(firstKey);
          }

          // Save persistent cache
          await savePersistentCache();

          setAddress(finalAddress);
          return cacheItem;
        } catch (err: any) {
          console.warn('Reverse geocoding failed:', err);
          setAddress('Unknown location');
          return { latitude, longitude, address: 'Unknown location' };
        } finally {
          setLoading(false);
          ongoingRequestsRef.current.delete(key);
        }
      })();

      ongoingRequestsRef.current.set(key, requestPromise);
      const result = await requestPromise;
      return result.address;
    },
    [getKey, savePersistentCache]
  );

  const reverseGeocodeBatch = useCallback(
    async (coordsList: Coords[]): Promise<Record<string, string>> => {
      const promises = coordsList.map(async (c) => {
        const key = getKey(c.latitude, c.longitude);
        const addr = await reverseGeocode(c);
        return [key, addr] as const;
      });

      const results = await Promise.all(promises);
      return Object.fromEntries(results);
    },
    [getKey, reverseGeocode]
  );

  return {
    loading,
    address,
    reverseGeocode,
    reverseGeocodeBatch,
    getCachedAddress,
  };
};
