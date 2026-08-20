// src/hooks/useLocation.ts
import { useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import * as Location from 'expo-location';

export type Coords = { latitude: number; longitude: number };

export function useLocation() {
  const [coords, setCoords] = useState<Coords | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // 'checking' until we know; then true/false
  const [servicesEnabled, setServicesEnabled] = useState<boolean | null>(null);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  const fetchLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Is location turned ON at the OS level? (this is the missing check)
      const enabled = await Location.hasServicesEnabledAsync();
      setServicesEnabled(enabled);
      if (!enabled) {
        setError('Location services are off');
        setLoading(false);
        return; // stop — do NOT await a position, it would hang
      }

      // 2. Permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        setError('Location permission denied');
        setLoading(false);
        return;
      }
      setPermissionDenied(false);

      // 3. Position (guarded)
      let loc = await Location.getLastKnownPositionAsync();

      if (!loc) {
        loc = await Promise.race<Location.LocationObject>([
          Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
          new Promise<Location.LocationObject>((_, reject) =>
            setTimeout(() => reject(new Error('Location timeout')), 5000)
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

  // Re-check when the user comes back from Settings after turning location on
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        fetchLocation();
      }
    });
    return () => sub.remove();
  }, [fetchLocation]);

  return {
    coords,
    loading,
    error,
    servicesEnabled,
    permissionDenied,
    refresh: fetchLocation,
  };
}