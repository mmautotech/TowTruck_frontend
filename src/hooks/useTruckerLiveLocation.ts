/* src/hooks/useTruckerLiveLocation.ts
import { useEffect } from 'react';
import { useLocation } from './useLocation';
import { updateTruckLocation } from '../api/truckerLocation';
import { useAuth } from './useAuth'; // to get logged-in trucker ID

export const useTruckerLiveLocation = (user_id: string) => {
    const { coords } = useLocation();

    useEffect(() => {
        if (!coords || !user_id) return;

        const sendLocation = async () => {
            try {
                await updateTruckLocation(user_id, {
                    type: 'Point',
                    coordinates: [coords.longitude, coords.latitude],
                });
            } catch (err) {
                console.log('Failed to update trucker location', err);
            }
        };

        sendLocation();
        const interval = setInterval(sendLocation, 5000);

        return () => clearInterval(interval);
    }, [coords, user_id]);
};
*/