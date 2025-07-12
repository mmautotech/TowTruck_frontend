import React, { useCallback, useState, useRef } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import styles from './style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../../components/CustomHeader';
import { fetchTruckHistory } from '../../../api/History';
import HistoryCard from '../../../components/HistoryCard';
import { useFocusEffect } from '@react-navigation/native';

type HistoryItem = {
  id: string;
  origin: [number, number];
  destination: [number, number];
  date: string;
  price: string;
  statusLabel: string;
};

const TruckHistoryScreen = () => {
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const refreshingRef = useRef(false);

  const loadHistory = useCallback(async () => {
    if (!refreshingRef.current) setLoading(true);

    const user_token = await AsyncStorage.getItem('user_token');
    if (!user_token) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const history = await fetchTruckHistory();
      const mapped = history.map((item): HistoryItem => {
        const pickupDate = new Date(item.pickup_date);
        return {
          id: item.request_id,
          origin: item.origin_location.coordinates,
          destination: item.dest_location.coordinates,
          date: pickupDate.toDateString().slice(4, 10),
          price: item.offer?.accepted ? `£${item.offer.offered_price}` : '',
          statusLabel: item.ride_status.label,
        };
      });
      setHistoryData(mapped);
    } catch (err) {
      console.error('Failed to load truck history', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      refreshingRef.current = false;
    }
  }, []);

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
      dotColors={{ pickup: '#357EBD', dropoff: '#448844' }}
    />
  );

  return (
    <View style={styles.container}>
      <CustomHeader title="History" showMenuButton />
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

export default TruckHistoryScreen;
