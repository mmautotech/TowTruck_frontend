import React, { useCallback, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import styles from './style';
import CustomHeader from '../../../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchClientHistory } from '../../../api/History';
import HistoryCard from '../../../components/HistoryCard';
import { useFocusEffect } from '@react-navigation/native';
import { useReverseGeocode } from '../../../hooks/useReverseGeocode';

type HistoryItem = {
  id: string;
  origin: [number, number];
  destination: [number, number];
  date: string;
  price: string;
  statusLabel: string;
  originAddress: string;
  destinationAddress: string;
};

const ClientHistoryScreen = () => {
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const refreshingRef = useRef(false);

  const { reverseGeocode } = useReverseGeocode();
  const cache = useRef<Map<string, string>>(new Map());

  const getKey = (coords: [number, number]) =>
    `${coords[1].toFixed(5)},${coords[0].toFixed(5)}`;

  const loadHistory = useCallback(async () => {
    if (!refreshingRef.current) setLoading(true);

    const user_token = await AsyncStorage.getItem('user_token');
    if (!user_token) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const history = await fetchClientHistory();
      const mapped: HistoryItem[] = [];

      for (const item of history) {
        const pickupDate = new Date(item.pickup_date);
        const statusCode = item.ride_status?.code || '';
        const statusLabel = item.ride_status?.label || '';
        const price =
          statusCode === 'cancelled' || !item.accepted_offer
            ? ''
            : `£${item.accepted_offer.offered_price}`;

        // --- origin ---
        const originKey = getKey(item.origin_location.coordinates);
        let originAddress = cache.current.get(originKey);
        if (!originAddress) {
          originAddress =
            (await reverseGeocode({
              latitude: item.origin_location.coordinates[1],
              longitude: item.origin_location.coordinates[0],
            })) || 'Unknown pickup';
          cache.current.set(originKey, originAddress);
        }

        // --- destination ---
        const destinationKey = getKey(item.dest_location.coordinates);
        let destinationAddress = cache.current.get(destinationKey);
        if (!destinationAddress) {
          destinationAddress =
            (await reverseGeocode({
              latitude: item.dest_location.coordinates[1],
              longitude: item.dest_location.coordinates[0],
            })) || 'Unknown dropoff';
          cache.current.set(destinationKey, destinationAddress);
        }

        mapped.push({
          id: item.request_id,
          origin: item.origin_location.coordinates,
          destination: item.dest_location.coordinates,
          date: pickupDate.toDateString().slice(4, 10),
          price,
          statusLabel,
          originAddress,
          destinationAddress,
        });
      }

      setHistoryData(mapped);
    } catch (err) {
      console.error('Failed to load client history', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      refreshingRef.current = false;
    }
  }, [reverseGeocode]);

  useFocusEffect(
    useCallback(() => {
      refreshingRef.current = false;
      loadHistory();
    }, [loadHistory])
  );

  const onRefresh = () => {
    setRefreshing(true);
    refreshingRef.current = true;
    loadHistory();
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <HistoryCard
      from={item.origin}
      to={item.destination}
      date={item.date}
      price={item.price}
      status={item.statusLabel}
      originAddress={item.originAddress}
      destinationAddress={item.destinationAddress}
      dotColors={{ pickup: '#357EBD', dropoff: '#448844' }}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: '#F0F0F0' }]}>
      <CustomHeader title="History" />
      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#357EBD" />
        </View>
      ) : (
        <FlatList
          data={historyData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#357EBD']}
              tintColor="#357EBD"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No history available</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default ClientHistoryScreen;
