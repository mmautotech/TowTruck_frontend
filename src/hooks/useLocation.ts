// src/hooks/useLocation.ts
import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

export type Coords = { latitude: number; longitude: number };

export function useLocation() {
  const [coords, setCoords] = useState<Coords | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        setLoading(false);
        return;
      }

      let loc = await Location.getLastKnownPositionAsync();

      if (!loc) {
        loc = await Promise.race<Location.LocationObject>([
          Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
          new Promise<Location.LocationObject>((_, reject) =>
            setTimeout(() => reject(new Error('Location timeout')), 12000)
          ),
        ]);
      }

      if (loc) {
        setCoords({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return {
    coords,
    loading,
    error,
    refresh: fetchLocation,
  };
}