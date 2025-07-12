import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, MapPressEvent, Region, LatLng, Polyline } from 'react-native-maps';
import GlowingMarker from './GlowingMarker'; // adjust path as needed

interface MapProps {
  region: Region;
  originCoords: LatLng | null;
  destCoords: LatLng | null;
  onMapPress: (e: MapPressEvent) => void;
  currentCoords?: LatLng | null;
  bottomOffset?: number; // Height (in px) of any panel covering map from bottom
  autoFitRoute?: boolean; // If false, disables auto route fitting (e.g. when panel is maximized)
}

const Map: React.FC<MapProps> = ({
  region,
  originCoords,
  destCoords,
  onMapPress,
  currentCoords,
  bottomOffset = 0,
  autoFitRoute = true, // default: true
}) => {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!autoFitRoute) return; // Skip fitting when not needed

    const basePad = 100;
    const edgePadding = {
      top: basePad,
      bottom: basePad + bottomOffset,
      left: basePad,
      right: basePad,
    };

    if (currentCoords && originCoords) {
      mapRef.current.fitToCoordinates([currentCoords, originCoords], {
        edgePadding,
        animated: true,
      });
    } else if (originCoords && destCoords) {
      mapRef.current.fitToCoordinates([originCoords, destCoords], {
        edgePadding,
        animated: true,
      });
    } else if (originCoords) {
      mapRef.current.animateToRegion({
        ...originCoords,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } else {
      mapRef.current.animateToRegion(region);
    }
  }, [currentCoords, originCoords, destCoords, region, bottomOffset, autoFitRoute]);

  const currentToOrigin =
    currentCoords && originCoords ? [currentCoords, originCoords] : [];
  const originToDest =
    originCoords && destCoords ? [originCoords, destCoords] : [];

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      region={region}
      onPress={onMapPress}
      showsUserLocation={!currentCoords}
    >
      {/* Polyline: current → pickup (red) */}
      {currentToOrigin.length === 2 && (
        <Polyline
          coordinates={currentToOrigin}
          strokeColor="red"
          strokeWidth={3}
        />
      )}

      {/* Polyline: pickup → drop-off (green) */}
      {originToDest.length === 2 && (
        <Polyline
          coordinates={originToDest}
          strokeColor="green"
          strokeWidth={3}
        />
      )}

      {/* Glowing marker for current location */}
      {currentCoords && (
        <GlowingMarker latitude={currentCoords.latitude} longitude={currentCoords.longitude} />
      )}

      {/* Pickup marker */}
      {originCoords && (
        <Marker
          coordinate={originCoords}
          title="Pickup"
          pinColor="green"
        />
      )}

      {/* Drop-off marker */}
      {destCoords && (
        <Marker
          coordinate={destCoords}
          title="Drop-off"
          pinColor="red"
        />
      )}
    </MapView>
  );
};

export default Map;
