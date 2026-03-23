// src/components/googleApi.ts

import api from '../utils/axios'; // 👈 your axios instance

// 🔍 Autocomplete
export const searchPlaces = async (input: string) => {
    try {
        const res = await api.get('/google/autocomplete', {
            params: { input },
        });

        return res.data;
    } catch (err: any) {
        console.log('Autocomplete error', err?.response?.data || err.message);
        return [];
    }
};

// 📍 Place → lat/lng
export const getPlaceDetails = async (placeId: string) => {
    try {
        const res = await api.get(`/google/details/${placeId}`);
        return res.data;
    } catch (err: any) {
        console.log('Place details error', err?.response?.data || err.message);
        return null;
    }
};