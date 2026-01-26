import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, MapPressEvent, Region, LatLng, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import GlowingMarker from './GlowingMarker';

interface MapProps {
  region: Region;
  originCoords: LatLng | null;
  destCoords: LatLng | null;
  onMapPress: (e: MapPressEvent) => void;
  currentCoords?: LatLng | null;
  bottomOffset?: number;
  autoFitRoute?: boolean;
  googleApiKey: string; // ✅ Pass Google API Key from TruckServiceScreen
}

const Map: React.FC<MapProps> = ({
  region,
  originCoords,
  destCoords,
  onMapPress,
  currentCoords,
  bottomOffset = 0,
  autoFitRoute = true,
  googleApiKey,
}) => {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!autoFitRoute) return;

    const basePad = 100;
    const edgePadding = {
      top: basePad,
      bottom: basePad + bottomOffset,
      left: basePad,
      right: basePad,
    };

    if (currentCoords && originCoords) {
      mapRef.current.fitToCoordinates([currentCoords, originCoords], { edgePadding, animated: true });
    } else if (originCoords && destCoords) {
      mapRef.current.fitToCoordinates([originCoords, destCoords], { edgePadding, animated: true });
    } else if (originCoords) {
      mapRef.current.animateToRegion({ ...originCoords, latitudeDelta: 0.01, longitudeDelta: 0.01 });
    } else {
      mapRef.current.animateToRegion(region);
    }
  }, [currentCoords, originCoords, destCoords, region, bottomOffset, autoFitRoute]);

  const currentToOrigin = currentCoords && originCoords ? [currentCoords, originCoords] : [];
  const originToDest = originCoords && destCoords ? [originCoords, destCoords] : [];

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      region={region}
      onPress={onMapPress}
      showsUserLocation={!currentCoords}
    >
      {/* Driving route: current → pickup */}
      {currentCoords && originCoords && googleApiKey && (
        <MapViewDirections
          origin={currentCoords}
          destination={originCoords}
          apikey={googleApiKey}
          strokeWidth={3}
          strokeColor="red"
          optimizeWaypoints
          mode="DRIVING"
        />
      )}

      {/* Driving route: pickup → drop-off */}
      {originCoords && destCoords && googleApiKey && (
        <MapViewDirections
          origin={originCoords}
          destination={destCoords}
          apikey={googleApiKey}
          strokeWidth={3}
          strokeColor="green"
          optimizeWaypoints
          mode="DRIVING"
        />
      )}

      {/* Glowing marker for current location */}
      {currentCoords && (
        <GlowingMarker latitude={currentCoords.latitude} longitude={currentCoords.longitude} />
      )}

      {/* Pickup marker */}
      {originCoords && <Marker coordinate={originCoords} title="Pickup" pinColor="green" />}

      {/* Drop-off marker */}
      {destCoords && <Marker coordinate={destCoords} title="Drop-off" pinColor="red" />}
    </MapView>
  );
};

export default Map;
