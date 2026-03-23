import { useState } from 'react';
import { searchPlaces, getPlaceDetails } from '../components/googleApi';

import type { LatLng } from 'react-native-maps';

type Props = {
    setOriginCoords: (coords: LatLng) => void;
    setDestCoords: (coords: LatLng) => void;
};

const usePlaces = ({ setOriginCoords, setDestCoords }: Props) => {
    const [originText, setOriginText] = useState('');
    const [destText, setDestText] = useState('');

    const [originResults, setOriginResults] = useState<any[]>([]);
    const [destResults, setDestResults] = useState<any[]>([]);

    // 🔍 Search Origin
    const handleOriginSearch = async (text: string) => {
        setOriginText(text);

        if (text.length < 3) {
            setOriginResults([]);
            return;
        }

        const results = await searchPlaces(text);
        setOriginResults(results);
    };

    // 🔍 Search Destination
    const handleDestSearch = async (text: string) => {
        setDestText(text);

        if (text.length < 3) {
            setDestResults([]);
            return;
        }

        const results = await searchPlaces(text);
        setDestResults(results);
    };

    // 📍 Select Origin
    const selectOrigin = async (placeId: string, description: string) => {
        const coords = await getPlaceDetails(placeId);
        if (!coords) return;

        setOriginCoords(coords);
        setOriginText(description);
        setOriginResults([]);
    };

    // 📍 Select Destination
    const selectDest = async (placeId: string, description: string) => {
        const coords = await getPlaceDetails(placeId);
        if (!coords) return;

        setDestCoords(coords);
        setDestText(description);
        setDestResults([]);
    };

    return {
        originText,
        destText,
        originResults,
        destResults,
        handleOriginSearch,
        handleDestSearch,
        selectOrigin,
        selectDest,
    };
};

export default usePlaces;