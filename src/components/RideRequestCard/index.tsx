// src/components/RideRequestCard/index.tsx

import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { getDistance } from 'geolib';
import styles from './styles';
import useReverseGeocode from '../../hooks/useReverseGeocode';
import type { VehicleDetails } from '../../api/types';

export type RideRequestCardProps = {
  item: {
    request_id: string;
    username: string;
    user_photo?: string;
    origin_location: { coordinates: [number, number] };
    dest_location: { coordinates: [number, number] };
    vehicle_details: VehicleDetails;
    pickup_date: string;
    updatedAt: string;
    offered_price?: number;
    time_to_reach?: string;
    client_counter_price?: number;
    offer?: {
      offered_price: number;
      time_to_reach: string;
      client_counter_price?: number;
      updatedAt?: string;
    };
  };
  userLocation?: { latitude: number; longitude: number };
  onPress?: (item: any) => void;
  tab: 'new' | 'applied'; // Passed from RequestList
};

function formatTimeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

function formatTimeToReach(str: string): string {
  const dMatch = str.match(/(\d+)d/);
  const hMatch = str.match(/(\d+)h/);
  const mMatch = str.match(/(\d+)m/);
  const d = dMatch ? parseInt(dMatch[1], 10) : 0;
  const h = hMatch ? parseInt(hMatch[1], 10) : 0;
  const m = mMatch ? parseInt(mMatch[1], 10) : 0;

  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m} mins`;
}

const categoryLabels: Record<VehicleDetails['vehicle_category'], string> = {
  'donot-apply': '',
  'Short Wheel Base': 'Short Wheel Base',
  'Medium Wheel Base': 'Medium Wheel Base',
  'Long Wheel Base': 'Long Wheel Base',
};


const RideRequestCard: React.FC<RideRequestCardProps> = React.memo(
  ({ item, userLocation, onPress, tab }) => {
    const [lng1, lat1] = item.origin_location.coordinates;
    const [lng2, lat2] = item.dest_location.coordinates;

    const { address: pickupAddress } = useReverseGeocode(lat1, lng1);
    const { address: dropoffAddress } = useReverseGeocode(lat2, lng2);


    const distMiles = useMemo(() => {
      if (!userLocation) return 'N/A';
      return (
        getDistance(
          { latitude: userLocation.latitude, longitude: userLocation.longitude },
          { latitude: lat1, longitude: lng1 }
        ) / 1609.344
      ).toFixed(2);
    }, [userLocation, lat1, lng1]);

    const tripMiles = useMemo(() => (
      getDistance(
        { latitude: lat1, longitude: lng1 },
        { latitude: lat2, longitude: lng2 }
      ) / 1609.344
    ).toFixed(2), [lat1, lng1, lat2, lng2]);

    const {
      registration,
      make,
      model,
      year_of_manufacture,
      wheels_category,
      vehicle_category,
      loaded,
    } = item.vehicle_details;

    const offeredPrice = tab === 'applied' ? item.offer?.offered_price : item.offered_price;
    const counterPrice = tab === 'applied' ? item.offer?.client_counter_price : item.client_counter_price;
    const timeToReach = tab === 'applied' ? item.offer?.time_to_reach : item.time_to_reach;

    return (
      <TouchableOpacity style={styles.card} onPress={() => onPress?.(item)}>
        {/* date row */}
        <View style={styles.dateRow}>
          <Text style={styles.pickupDate}>
            Pickup date: {new Date(item.pickup_date).toLocaleDateString()}
          </Text>
          <Text style={styles.updatedAt}>
            Updated: {formatTimeAgo(item.updatedAt)}
          </Text>
        </View>

        {/* header */}
        <View style={styles.headerRow}>
          <Image
            source={{ uri: item.user_photo || 'https://cdn-icons-png.flaticon.com/512/847/847969.png' }}
            style={styles.avatar}
          />
          <View style={styles.titleBlock}>
            <Text style={styles.username}>
              {item.username}{' '}
              <Text style={styles.miles}>({distMiles} mi away)</Text>
            </Text>
            <Text style={styles.makeModel}>
              {make} {model} ({year_of_manufacture})
            </Text>
            <Text>
              Registration Number: <Text style={styles.makeModel}>{registration}</Text>
            </Text>
          </View>
        </View>

        {/* addresses */}
        <Text style={styles.geoText}>
          Pickup: <Text style={styles.address}>{pickupAddress}</Text>
        </Text>
        <Text style={styles.geoText}>
          Dropoff: <Text style={styles.address}>{dropoffAddress}</Text>
        </Text>

        {/* trip distance */}
        <Text style={styles.geoText}>
          Distance: <Text style={styles.miles}>{tripMiles} mi</Text>
        </Text>

        {/* vehicle metadata */}
        {vehicle_category !== 'donot-apply' && (
          <Text style={styles.metaText}>
            Category: {categoryLabels[vehicle_category]}
          </Text>
        )}
        <Text style={styles.metaText}>Wheels: {wheels_category}</Text>
        {loaded === 'Loaded' && (
          <Text style={styles.metaText}>Status: Loaded</Text>
        )}

        {/* offer summary */}
        {offeredPrice != null && timeToReach != null && (
          <View style={styles.offerSummary}>
            <Text style={styles.offerText}>
              Offered Price:{' '}
              <Text style={styles.offerValue}>£{offeredPrice}</Text>{' '}
              ({formatTimeToReach(timeToReach)})
            </Text>
            {counterPrice != null && (
              <Text style={styles.counterText}>
                Requested Price: £{counterPrice}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

export default RideRequestCard;
