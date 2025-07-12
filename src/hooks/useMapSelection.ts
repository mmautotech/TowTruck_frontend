import { useState, useEffect, useCallback } from 'react';
import { LatLng } from 'react-native-maps';
import { useLocation, Coords } from './useLocation';

export function useMapSelection() {
  const { coords: currentCoords, loading: locLoading, error: locError, refresh } = useLocation();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);

  // Reflect permission state
  useEffect(() => {
    if (locError === 'Location permission denied') setHasPermission(false);
    else if (!locLoading && currentCoords) setHasPermission(true);
  }, [locLoading, locError, currentCoords]);

  const selectPoint = useCallback((field: 'origin' | 'destination', point: LatLng) => {
    if (field === 'origin') setOrigin(point);
    else setDestination(point);
  }, []);

  return {
    hasPermission,
    currentCoords,
    origin,
    destination,
    selectPoint,
    refreshLocation: refresh,
    locLoading,
    locError,
  };
}
