// src/api/location.ts

import axios from '../utils/axios';
import type { LatLng } from 'react-native-maps';

// 🚗 Get route from backend
export const getRoute = async (
    origin: LatLng,
    destination: LatLng
): Promise<LatLng[]> => {

    const payload = {
        from: `${origin.latitude},${origin.longitude}`,
        to: `${destination.latitude},${destination.longitude}`,
    };

    const { data } = await axios.post('/location/route', payload);

    // backend returns geometry: [[lon,lat],[lon,lat]]
    const route: LatLng[] = data.geometry.map((point: number[]) => ({
        latitude: point[1],
        longitude: point[0],
    }));

    return route;
};

// 📍 Convert place name → coordinates
export const geocodePlace = async (place: string): Promise<LatLng> => {

    const { data } = await axios.get('/location/geocode', {
        params: { address: place },
    });

    return {
        latitude: data.lat,
        longitude: data.lon,
    };
};