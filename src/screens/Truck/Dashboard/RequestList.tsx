// src/screens/Truck/RequestList.tsx

import React, { useState, useCallback, useEffect } from 'react';
import {
  FlatList,
  RefreshControl,
  ActivityIndicator,
  View,
  Text,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import RideRequestCard from '../../../components/RideRequestCard';
import {
  fetchNewRideRequests,
  fetchAppliedRideRequests,
  TruckRideRequest,
} from '../../../api';
import styles from './styles';

type OfferListProps = {
  tab: 'new' | 'applied';
  userLocation?: { latitude: number; longitude: number };
  onPress: (req: TruckRideRequest) => void;
  refreshTrigger?: number;
};

const RequestList: React.FC<OfferListProps> = ({
  tab,
  userLocation,
  onPress,
  refreshTrigger,
}) => {
  const [data, setData] = useState<TruckRideRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      if (!refreshing) setLoading(true);

      const list =
        tab === 'new'
          ? await fetchNewRideRequests()
          : await fetchAppliedRideRequests();

      list.sort((a, b) => {
        const timeA = tab === 'new'
          ? new Date(a.updatedAt).getTime()
          : new Date(a.offer?.updatedAt || 0).getTime();

        const timeB = tab === 'new'
          ? new Date(b.updatedAt).getTime()
          : new Date(b.offer?.updatedAt || 0).getTime();

        return timeB - timeA;
      });

      setData(list);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [tab, refreshing]);

  useFocusEffect(
    useCallback(() => {
      setRefreshing(false);
      load();
    }, [load])
  );

  useEffect(() => {
    if (tab === 'new') {
      load();
    }
  }, [refreshTrigger]);

  useEffect(() => {
    if (!loading && !refreshing && data.length === 0) {
      const timer = setTimeout(() => {
        load();
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [data, loading, refreshing, load]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#357EBD" />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.request_id}
      contentContainerStyle={
        data.length === 0
          ? styles.emptyContainer
          : styles.listContent
      }
      renderItem={({ item }) => (
        <RideRequestCard
          item={item}
          userLocation={userLocation}
          onPress={onPress}
          tab={tab}
        />
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            load();
          }}
        />
      }
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.loadingText}>⏳ Waiting for requests...</Text>
        </View>
      }
    />
  );
};

export default React.memo(RequestList);
