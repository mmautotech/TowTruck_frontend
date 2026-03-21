import React, { useEffect, useRef } from "react";
import MapView, { Marker, Polyline, LatLng, Region } from "react-native-maps";
import { View, StyleSheet, Image } from "react-native";

interface MapProps {
  originCoords?: LatLng | null;
  destCoords?: LatLng | null;
  routeCoords?: LatLng[];
  truckers?: LatLng[];
  onMapPress?: (e: any) => void;
  bottomOffset?: number;
  autoFitRoute?: boolean;
  currentCoords?: LatLng | null;
  onUserPan?: () => void;
}

// London bounds
const londonBounds = {
  latMin: 51.3,
  latMax: 51.7,
  lngMin: -0.5,
  lngMax: 0.3,
};

// Initial London region
const initialLondonRegion: Region = {
  latitude: 51.5074, // London latitude
  longitude: -0.1278, // London longitude
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};
const Map: React.FC<MapProps> = ({
  originCoords,
  destCoords,
  routeCoords = [],
  truckers = [],
  onMapPress,
  bottomOffset = 0,
  autoFitRoute = true,
  currentCoords,
  onUserPan,
}) => {
  const mapRef = useRef<MapView>(null);

  // Auto-fit map to all coordinates inside London only
  useEffect(() => {
    if (!mapRef.current || !autoFitRoute) return;

    const coordinates: LatLng[] = [
      ...(originCoords ? [originCoords] : []),
      ...(destCoords ? [destCoords] : []),
      ...(currentCoords ? [currentCoords] : []),
      ...truckers,
      ...routeCoords,
    ].filter(
      (c) =>
        c.latitude >= londonBounds.latMin &&
        c.latitude <= londonBounds.latMax &&
        c.longitude >= londonBounds.lngMin &&
        c.longitude <= londonBounds.lngMax
    );

    if (coordinates.length === 0) return;

    mapRef.current.fitToCoordinates(coordinates, {
      edgePadding: {
        top: 100,
        right: 50,
        bottom: 100 + bottomOffset,
        left: 50,
      },
      animated: true,
    });
  }, [
    originCoords,
    destCoords,
    truckers,
    routeCoords,
    currentCoords,
    autoFitRoute,
    bottomOffset,
  ]);

  // User panning
  const handleRegionChange = () => {
    if (onUserPan) onUserPan();
  };

  // Restrict map to London bounds
  const onRegionChangeComplete = (region: Region) => {
    let { latitude, longitude, latitudeDelta, longitudeDelta } = region;

    if (latitude < londonBounds.latMin) latitude = londonBounds.latMin;
    if (latitude > londonBounds.latMax) latitude = londonBounds.latMax;
    if (longitude < londonBounds.lngMin) longitude = londonBounds.lngMin;
    if (longitude > londonBounds.lngMax) longitude = londonBounds.lngMax;

    mapRef.current?.animateToRegion(
      { latitude, longitude, latitudeDelta, longitudeDelta },
      100
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        onPress={onMapPress}
        onRegionChange={handleRegionChange}
        onRegionChangeComplete={onRegionChangeComplete}
        minZoomLevel={10}
        maxZoomLevel={15}
        initialRegion={initialLondonRegion}
      >
        {/* Pickup Marker */}
        {originCoords && (
          <Marker coordinate={originCoords} title="Pickup Location" pinColor="green" />
        )}

        {/* Destination Marker */}
        {destCoords && (
          <Marker coordinate={destCoords} title="Destination" pinColor="red" />
        )}

        {/* Current Tow Truck */}
        {currentCoords && (
          <Marker coordinate={currentCoords} title="Tow Truck">
            <Image
              source={require("../../assets/trucker.png")}
              style={{ width: 42, height: 42 }}
              resizeMode="contain"
            />
          </Marker>
        )}

        {/* Other Truckers */}
        {truckers.map((truck, index) => (
          <Marker key={index} coordinate={truck} title={`Trucker ${index + 1}`}>
            <Image
              source={require("../../assets/trucker.png")}
              style={{ width: 36, height: 36 }}
              resizeMode="contain"
            />
          </Marker>
        ))}

        {/* Route Line */}
        {routeCoords.length > 1 && (
          <Polyline coordinates={routeCoords} strokeColor="#357EBD" strokeWidth={4} />
        )}
      </MapView>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});