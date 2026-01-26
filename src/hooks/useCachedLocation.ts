import { useState, useEffect, useCallback } from 'react';
import { getDistance } from 'geolib';
import { useReverseGeocode } from './useReverseGeocode';
import { getJSON, setJSON } from '../utils/asyncStorage';

type Coords = {
    latitude: number;
    longitude: number;
};

const LOCATION_KEY = 'CLIENT_LOCATION_CACHE';
const DISTANCE_THRESHOLD = 50; // meters

export const useCachedLocation = () => {
    const [coords, setCoords] = useState<Coords | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { reverseGeocode } = useReverseGeocode();

    // Load cached location on mount
    useEffect(() => {
        (async () => {
            const cached = await getJSON<Coords>(LOCATION_KEY);
            if (cached) {
                setCoords(cached);
                const cachedAddress = await reverseGeocode(cached);
                setAddress(cachedAddress ?? null);
            }
        })();
    }, []);

    const updateLocation = useCallback(
        async (newCoords: Coords) => {
            if (!newCoords) return;

            const shouldUpdate =
                !coords ||
                getDistance(coords, newCoords) > DISTANCE_THRESHOLD;

            if (shouldUpdate) {
                setLoading(true);
                const newAddress = await reverseGeocode(newCoords);
                setCoords(newCoords);
                setAddress(newAddress ?? null);
                await setJSON(LOCATION_KEY, newCoords);
                setLoading(false);
            }
        },
        [coords, reverseGeocode]
    );

    return {
        coords,
        address,
        loading,
        updateLocation,
    };
};
