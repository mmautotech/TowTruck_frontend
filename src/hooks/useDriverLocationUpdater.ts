import { useEffect } from "react";
import { updateLocation } from "../api/user";

type Coords = {
  latitude: number;
  longitude: number;
} | null;

const UPDATE_INTERVAL = 10000;

export const useDriverLocationUpdater = (coords: Coords) => {
  useEffect(() => {
    if (!coords) return;

    const sendLocation = async () => {
      try {
        const geo_location = {
          type: "Point" as const,
          coordinates: [
            coords.longitude,
            coords.latitude,
          ] as [number, number],
        };

        await updateLocation(geo_location);

        console.log("🚚 Driver location updated:", geo_location);
      } catch (err) {
        console.log("❌ Location update error:", err);
      }
    };

    sendLocation();

    const interval = setInterval(sendLocation, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [coords]);
};