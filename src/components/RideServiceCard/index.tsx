import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import styles from './styles';
import { hp } from '../../utils/responsive';

type Props = {
  item: {
    truck_username: string;
    offered_price: number;
    time_to_reach: string;
    rating?: number | null;
    client_counter_price?: number;
    offer_updated_at?: string;
    truck_photo?: string;
  };
  onAccept?: () => void;
  onPress?: () => void;
  /** true while this offer is being accepted */
  isAccepting?: boolean;
};

const getTimeAgo = (timestamp?: string) => {
  if (!timestamp) return 'Just now';
  const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff} min ago`;
  const hours = Math.floor(diff / 60);
  return `${hours}h ${diff % 60}m ago`;
};

const renderStars = (rating: number = 0) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push('★');
    } else if (i === fullStars && hasHalfStar) {
      stars.push('☆');
    } else {
      stars.push('☆');
    }
  }

  return (
    <Text style={styles.rating}>
      {stars.join(' ')} ({rating.toFixed(1)})
    </Text>
  );
};

const RideServiceCard: React.FC<Props> = ({
  item,
  onAccept,
  onPress,
  isAccepting,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.driverRow}>
        <Image
          source={{
            uri:
              item.truck_photo ||
              'https://cdn-icons-png.flaticon.com/128/10412/10412383.png',
          }}
          style={styles.avatar}
        />

        <View style={styles.upperContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.truckName}>{item.truck_username}</Text>
            <Text style={styles.distanceText}>
              {getTimeAgo(item.offer_updated_at)}
            </Text>
          </View>
          {renderStars(item.rating ?? 0)}
          <Text style={styles.meta}>ETA: {item.time_to_reach}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View>
        <Text style={styles.offerLabel}>
          Offered Price:{' '}
          <Text style={styles.offerValue}>£{item.offered_price}</Text>
        </Text>

        {item.client_counter_price != null && (
          <Text style={[styles.offerLabel, { marginTop: hp(0.6) }]}>
            Counter Price:{' '}
            <Text style={styles.counterBadge}>
              £{item.client_counter_price}
            </Text>
          </Text>
        )}
      </View>

      <View style={styles.buttonView}>
        <TouchableOpacity
          style={[styles.acceptBtn, isAccepting && { opacity: 0.6 }]}
          onPress={onAccept}
          disabled={isAccepting}
        >
          {isAccepting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.acceptText}>Accept</Text>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default RideServiceCard;
