import React, { useEffect, useRef } from "react";
import MapView, { Marker, Polyline, Region, LatLng } from "react-native-maps";
import { View, StyleSheet, Image } from "react-native";

interface MapProps {
  region?: Region | null;
  originCoords?: LatLng | null;
  destCoords?: LatLng | null;
  routeCoords?: LatLng[];
  truckers?: LatLng[]; // Trucker locations
  onMapPress?: (e: any) => void;
  bottomOffset?: number; // To offset fitting for bottom panel
  autoFitRoute?: boolean; // Fit map to route automatically
  currentCoords?: LatLng | null; // ← add this

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
}) => {
  const mapRef = useRef<MapView>(null);

  // Auto fit map when route available
  useEffect(() => {
    if (routeCoords.length > 0 && mapRef.current && autoFitRoute) {
      mapRef.current.fitToCoordinates(routeCoords, {
        edgePadding: {
          top: 100,
          right: 50,
          bottom: 100 + bottomOffset, // add bottom offset
          left: 50,
        },
        animated: true,
      });
    }
  }, [routeCoords, autoFitRoute, bottomOffset]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={
          region || {
            latitude: 31.5204,
            longitude: 74.3587,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }
        }
        onPress={onMapPress}
      >
        {/* Pickup Marker */}
        {originCoords && (
          <Marker coordinate={originCoords} title="Pickup Location" pinColor="green" />
        )}

        {/* Destination Marker */}
        {destCoords && (
          <Marker coordinate={destCoords} title="Destination" pinColor="red" />
        )}

        {/* Truckers */}
        {truckers.length > 0 &&
          truckers.map((truck, index) => (
            <Marker key={index} coordinate={truck} title={`Trucker ${index + 1}`}>
              <Image
                source={require('../../assets/trucker.png')}
                style={{ width: 40, height: 40 }} // slightly bigger for visibility
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
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});