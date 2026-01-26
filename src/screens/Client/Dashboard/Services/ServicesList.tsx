// src/screens/Client/Dashboard/Services/ServicesList.tsx

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchOffers, Offer } from '../../../../api';
import RideServiceCard from '../../../../components/RideServiceCard';
import { LatLng } from 'react-native-maps';
import styles from './styles';

type ServicesListProps = {
  requestId: string;
  originCoords: LatLng;
  userCoords: LatLng;
  onAccept: (offerId: string) => void;
  onCounterPress: (offerId: string) => void;
  onRefetchReady?: (refetch: () => void) => void;
  isAccepting?: boolean;
};

const ServicesList: React.FC<ServicesListProps> = ({
  requestId,
  originCoords,
  userCoords,
  onAccept,
  onCounterPress,
  onRefetchReady,
}) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadOffers = useCallback(async () => {
    try {
      if (!refreshing) {
        setLoading(true);
      }
      // JWT in headers is enough; no user_id needed here
      const data = await fetchOffers(requestId);
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.offer_updated_at).getTime() -
          new Date(a.offer_updated_at).getTime()
      );
      setOffers(sorted);
    } catch (e: any) {
      Alert.alert(
        'Error',
        e.response?.data?.message || e.message || 'Failed to load offers'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing, requestId]);

  // Expose refetch to parent
  useEffect(() => {
    if (onRefetchReady) {
      onRefetchReady(loadOffers);
    }
  }, [loadOffers, onRefetchReady]);

  // Auto-polling every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadOffers();
    }, 30000);
    return () => clearInterval(interval);
  }, [loadOffers]);

  // Refresh on screen focus
  useFocusEffect(
    useCallback(() => {
      loadOffers();
    }, [loadOffers])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={offers}
      keyExtractor={(item, index) => item.offer_id || `fallback-${index}`}
      renderItem={({ item }) => {
        if (!item.offer_id) return null;

        return (
          <RideServiceCard
            item={{
              truck_username: item.truck_username || 'Truck Driver',
              offered_price: item.offered_price,
              time_to_reach: item.time_to_reach!,
              rating: item.truck_rating,
              client_counter_price: item.client_counter_price,
              offer_updated_at: item.offer_updated_at,
              truck_photo: item.truck_photo,
            }}
            onAccept={() => onAccept(item.offer_id!)}
            onPress={() => onCounterPress(item.offer_id!)}
          />
        );
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadOffers();
          }}
        />
      }
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>⏳ Waiting for services...</Text>
        </View>
      }
    />
  );
};

export default React.memo(ServicesList);
