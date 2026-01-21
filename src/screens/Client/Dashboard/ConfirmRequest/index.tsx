import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import CustomHeader from '../../../../components/CustomHeader';
import styles from './styles';
import {
  fetchActiveRequest,
  confirmRideRequest,
  cancelRideRequest,
} from '../../../../api';
import type { RideRequest } from '../../../../api/types';
import type { ClientStackParamList } from '../../../../types';
import { useReverseGeocode } from '../../../../hooks/useReverseGeocode';
import { SignoutUser } from '../../../../utils/Signout_User';

type NavProp = StackNavigationProp<
  ClientStackParamList,
  'ClientConfirmRequestScreen'
>;

const ClientConfirmRequestScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();

  const [request, setRequest] = useState<RideRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [originAddress, setOriginAddress] = useState('Loading...');
  const [destAddress, setDestAddress] = useState('Loading...');

  // 🔹 TWO separate hooks (origin & destination)
  const originGeo = useReverseGeocode();
  const destGeo = useReverseGeocode();

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);

      (async () => {
        try {
          const res = await fetchActiveRequest();
          if (!active) return;

          if (!res) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'ClientDashboardScreen' }],
              })
            );
            return;
          }

          setRequest(res);

          if (
            res.origin_location?.coordinates &&
            res.dest_location?.coordinates
          ) {
            const oCoords = {
              latitude: res.origin_location.coordinates[1],
              longitude: res.origin_location.coordinates[0],
            };

            const dCoords = {
              latitude: res.dest_location.coordinates[1],
              longitude: res.dest_location.coordinates[0],
            };

            // Temporary placeholders
            setOriginAddress('Loading...');
            setDestAddress('Loading...');

            // 🔹 Trigger reverse geocoding (NO await)
            originGeo.reverseGeocode(oCoords);
            destGeo.reverseGeocode(dCoords);
          }
        } catch (err: any) {
          if (err?.response?.status === 401) {
            Alert.alert('Session expired', 'Please sign in again');
            await SignoutUser();
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'SigninScreen' }],
              })
            );
          } else {
            Alert.alert('Error', err.message || 'Failed to load request');
          }
        } finally {
          if (active) setLoading(false);
        }
      })();

      return () => {
        active = false;
      };
    }, [navigation])
  );

  // 🔹 Sync origin address
  useEffect(() => {
    if (originGeo.address) {
      setOriginAddress(originGeo.address);
    }
  }, [originGeo.address]);

  // 🔹 Sync destination address
  useEffect(() => {
    if (destGeo.address) {
      setDestAddress(destGeo.address);
    }
  }, [destGeo.address]);

  const handleConfirm = async () => {
    if (!request) return;
    setLoading(true);

    try {
      const { success, message } = await confirmRideRequest(request._id);
      if (!success) throw new Error(message || 'Confirm failed');

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'ClientServicesScreen' }],
        })
      );
    } catch (err: any) {
      if (err?.response?.status === 401) {
        Alert.alert('Session expired', 'Please sign in again');
        await SignoutUser();
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'SigninScreen' }],
          })
        );
      } else {
        Alert.alert('Error', err.message || 'Could not confirm');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!request) return;
    setLoading(true);

    try {
      await cancelRideRequest(request._id);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'ClientDashboardScreen' }],
        })
      );
    } catch (err: any) {
      if (err?.response?.status === 401) {
        Alert.alert('Session expired', 'Please sign in again');
        await SignoutUser();
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'SigninScreen' }],
          })
        );
      } else {
        Alert.alert('Error', err.message || 'Could not cancel');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading || !request) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#357EBD" />
      </View>
    );
  }

  const { pickup_date, vehicle_details } = request;

  const Detail: React.FC<{ label: string; value: string }> = ({
    label,
    value,
  }) => (
    <View style={styles.detailContainer}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomHeader title="Confirm Your Request" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Detail
          label="Pickup Date"
          value={new Date(pickup_date).toDateString()}
        />
        <Detail label="Pickup Location" value={originAddress} />
        <Detail label="Dropoff Location" value={destAddress} />
        <Detail label="Make" value={vehicle_details.make} />
        <Detail label="Model" value={vehicle_details.model} />
        <Detail label="Registration No" value={vehicle_details.registration} />
        <Detail
          label="Year"
          value={vehicle_details.year_of_manufacture.toString()}
        />
        <Detail
          label="Wheels Category"
          value={vehicle_details.wheels_category}
        />

        {vehicle_details.vehicle_category !== 'donot-apply' && (
          <Detail
            label="Vehicle Category"
            value={vehicle_details.vehicle_category}
          />
        )}

        {vehicle_details.loaded !== 'Unloaded' && (
          <Detail label="Status" value={vehicle_details.loaded} />
        )}
      </ScrollView>

      <View style={styles.FooterContainer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
          disabled={loading}
        >
          <Text style={styles.confirmText}>CONFIRM REQUEST</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          disabled={loading}
        >
          <Text style={styles.cancelText}>CANCEL REQUEST</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ClientConfirmRequestScreen;
