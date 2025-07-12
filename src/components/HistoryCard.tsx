import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useReverseGeocode from '../hooks/useReverseGeocode';
import { wp, hp } from '../utils/responsive';

type Props = {
  from: [number, number]; // [lng, lat]
  to: [number, number];   // [lng, lat]
  date: string;
  price: string;
  status: string;
  dotColors?: {
    pickup: string;
    dropoff: string;
  };
};

const HistoryCard: React.FC<Props> = ({ from, to, date, price, status, dotColors }) => {
  const { address: fromAddress } = useReverseGeocode(from[1], from[0]); // lat, lng
  const { address: toAddress } = useReverseGeocode(to[1], to[0]);       // lat, lng

  return (
    <View style={styles.card}>
      <View style={styles.locations}>
        <View style={styles.dotContainer}>
          <View style={[styles.dot, { backgroundColor: dotColors?.pickup || '#357EBD' }]} />
          <View style={styles.line} />
          <View style={[styles.dot, { backgroundColor: dotColors?.dropoff || '#4CAF50' }]} />
        </View>
        <View>
          <Text style={styles.locationText}>
            {fromAddress || 'Loading pickup...'}
          </Text>
          <Text style={styles.locationText}>
            {toAddress || 'Loading dropoff...'}
          </Text>
        </View>
      </View>
      <View style={styles.rightBlock}>
        <Text style={styles.datetime}>{date}</Text>
        <Text style={styles.statusText}>{status}</Text>
        {price ? <Text style={styles.price}>{price}</Text> : null}
      </View>
    </View>
  );
};

export default HistoryCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: wp(3),
    padding: wp(4),
    marginVertical: hp(1),
    marginHorizontal: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  locations: {
    flexDirection: 'row',
    flex: 1,
  },
  dotContainer: {
    alignItems: 'center',
    marginRight: wp(3),
  },
  dot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
  },
  line: {
    width: 2,
    height: hp(3),
    backgroundColor: '#ccc',
    marginVertical: 2,
  },
  locationText: {
    fontSize: wp(3.5),
    color: '#333',
    marginBottom: hp(0.5),
    width: wp(55),
  },
  rightBlock: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: wp(2),
  },
  datetime: {
    fontSize: wp(3),
    color: '#999',
  },
  statusText: {
    fontSize: wp(3),
    color: '#666',
    marginTop: hp(0.5),
  },
  price: {
    fontSize: wp(4),
    color: '#357EBD',
    fontWeight: '600',
    marginTop: hp(0.5),
  },
});
