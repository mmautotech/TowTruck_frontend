// src/components/googleApi.ts

const API_BASE_URL = 'http://192.168.18.69:5000/api/google'; // replace with your backend URL

export const getPlacesAutocomplete = async (input: string) => {
    try {
        const res = await fetch(`${API_BASE_URL}/places/autocomplete?input=${input}`);
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('Places Autocomplete Error:', err);
        return null;
    }
};

export const getPlaceDetails = async (placeId: string) => {
    try {
        const res = await fetch(`${API_BASE_URL}/places/details?placeId=${placeId}`);
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('Place Details Error:', err);
        return null;
    }
};

export const getRoute = async (
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
) => {
    try {
        const res = await fetch(`${API_BASE_URL}/routes/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ origin, destination }),
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('Route Calculation Error:', err);
        return null;
    }
};
