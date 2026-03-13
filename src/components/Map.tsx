import React, { useEffect, useRef } from "react";
import MapView, { Marker, Polyline, Region, LatLng } from "react-native-maps";
import { View, StyleSheet, Image } from "react-native";

interface MapProps {
  region?: Region | null;
  originCoords?: LatLng | null;
  destCoords?: LatLng | null;
  routeCoords?: LatLng[];
  truckers?: LatLng[];
  onMapPress?: (e: any) => void;
  bottomOffset?: number;
  autoFitRoute?: boolean;
  currentCoords?: LatLng | null; // live driver location
}

const Map: React.FC<MapProps> = ({
  region,
  originCoords,
  destCoords,
  routeCoords = [],
  truckers = [],
  onMapPress,
  bottomOffset = 0,
  autoFitRoute = true,
  currentCoords,
}) => {
  const mapRef = useRef<MapView>(null);

  /**
   * Auto fit map to show:
   * driver + pickup + dropoff + truckers + route
   */
  useEffect(() => {
    if (!mapRef.current || !autoFitRoute) return;

    const coordinates: LatLng[] = [
      ...(originCoords ? [originCoords] : []),
      ...(destCoords ? [destCoords] : []),
      ...(currentCoords ? [currentCoords] : []),
      ...truckers,
      ...routeCoords,
    ];

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

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region || undefined}
        onPress={onMapPress}
      >
        {/* Pickup Marker */}
        {originCoords && (
          <Marker
            coordinate={originCoords}
            title="Pickup Location"
            pinColor="green"
          />
        )}

        {/* Destination Marker */}
        {destCoords && (
          <Marker
            coordinate={destCoords}
            title="Destination"
            pinColor="red"
          />
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
        {truckers.length > 0 &&
          truckers.map((truck, index) => (
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
          <Polyline
            coordinates={routeCoords}
            strokeColor="#357EBD"
            strokeWidth={4}
          />
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