// src/screens/Client/Dashboard/ClientDashboardScreen.tsx

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Keyboard,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import {
  CommonActions,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';

import styles from './styles';
import HeaderMenuButton from '../../../components/HeaderMenuButton';
import Map from '../../../components/Map';
import IncompleteProfileMessage from '../../../components/IncompleteProfileMessage';

import type { Region, LatLng } from 'react-native-maps';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ClientStackParamList } from '../../../types';

import {
  fetchActiveRequest,
  createRideRequest,
  CreateRequestPayload,
} from '../../../api/rideRequest';

import { fetchProfileStatus } from '../../../api/Profile';
import { useLocation } from '../../../hooks/useLocation';
import useReverseGeocode from '../../../hooks/useReverseGeocode';
import { SignoutUser } from '../../../utils/Signout_User';
import { getRoute } from '../../../api/location';
import usePlaces from '../../../hooks/usePlaces';

type NavProp = StackNavigationProp<ClientStackParamList, 'ClientDashboardScreen'>;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ClientDashboardScreen: React.FC = () => {
  const [mapAutoFitEnabled, setMapAutoFitEnabled] = useState(true);
  const navigation = useNavigation<NavProp>();

  const [checkingProfile, setCheckingProfile] = useState(true);
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);

  const { coords, loading: locLoading } = useLocation();

  const [region, setRegion] = useState<Region | null>(null);
  const [originCoords, setOriginCoords] = useState<LatLng | null>(null);
  const [destCoords, setDestCoords] = useState<LatLng | null>(null);

  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]); const {
    originText,
    destText,
    originResults,
    destResults,
    handleOriginSearch,
    handleDestSearch,
    selectOrigin,
    selectDest,
  } = usePlaces({ setOriginCoords, setDestCoords });

  const [focusedField, setFocusedField] =
    useState<'origin' | 'destination' | null>(null);

  const [pickupDate, setPickupDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [vehicleMakeModel, setVehicleMakeModel] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [year, setYear] = useState('');

  const [isVan, setIsVan] = useState(false);

  const [vehicleCategory, setVehicleCategory] =
    useState<'donot-apply' | 'Short Wheel Base' | 'Medium Wheel Base' | 'Long Wheel Base'>('donot-apply');

  const [loadedStatus, setLoadedStatus] =
    useState<'Unloaded' | 'Loaded'>('Unloaded');

  const [wheelsCategory, setWheelsCategory] =
    useState<'Wheels Are Rolling' | 'Wheels Are Not Rolling'>('Wheels Are Rolling');

  const [submitting, setSubmitting] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {

    const onShow = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardVisible(true);
    };

    const onHide = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardVisible(false);
    };

    const showSub = Keyboard.addListener('keyboardDidShow', onShow);
    const hideSub = Keyboard.addListener('keyboardDidHide', onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };

  }, []);

  useFocusEffect(
    useCallback(() => {

      let active = true;
      setCheckingProfile(true);

      (async () => {
        try {
          const res = await fetchProfileStatus();
          if (active) setProfileComplete(res.profile_complete);
        } catch {
          if (active) setProfileComplete(false);
        } finally {
          if (active) setCheckingProfile(false);
        }
      })();

      return () => {
        active = false;
      };

    }, [])
  );

  useFocusEffect(
    useCallback(() => {

      if (profileComplete !== true) return;

      let active = true;

      (async () => {

        try {

          const req = await fetchActiveRequest();

          if (!active || !req) return;

          let target: keyof ClientStackParamList;

          switch (req.status) {
            case 'created':
              target = 'ClientConfirmRequestScreen';
              break;
            case 'posted':
              target = 'ClientServicesScreen';
              break;
            case 'accepted':
              target = 'ClientDriverTrackingScreen';
              break;
            default:
              return;
          }

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: target }],
            })
          );

        } catch (err: any) {

          if (err.response?.status === 401) {

            Alert.alert('Session expired', 'Please sign in again');

            await SignoutUser();

            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'SigninScreen' }],
              })
            );
          }
        }

      })();

      return () => {
        active = false;
      };

    }, [profileComplete, navigation])
  );

  useEffect(() => {

    if (!coords) return;

    setRegion({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

  }, [coords]);

  useEffect(() => {

    const loadRoute = async () => {

      if (!originCoords || !destCoords) return;

      try {
        const route = await getRoute(originCoords, destCoords);
        setRouteCoords(route);
      } catch (err) {
        console.log('Route error', err);
      }

    };

    loadRoute();

  }, [originCoords, destCoords]);

  const { address: originAddress } =
    useReverseGeocode(originCoords?.latitude ?? 0, originCoords?.longitude ?? 0);

  const { address: destAddress } =
    useReverseGeocode(destCoords?.latitude ?? 0, destCoords?.longitude ?? 0);

  const mapFlex = keyboardVisible ? 0.4 : 0.7;
  const formFlex = keyboardVisible ? 0.6 : 0.3;

  const handleMapPress = (e: any) => {

    const c = e.nativeEvent.coordinate;

    if (focusedField === 'origin') {
      setOriginCoords(c);
      setRouteCoords([]);
    } else if (focusedField === 'destination') {
      setDestCoords(c);
      setRouteCoords([]);
    }

    Keyboard.dismiss();
    setFocusedField(null);

  };

  const handleDateChange = (_: DateTimePickerEvent, d?: Date) => {
    setShowDatePicker(false);
    if (d) setPickupDate(d);
  };

  const handleSubmit = async () => {

    if (!originCoords || !destCoords) {
      return Alert.alert('Missing Info', 'Set both origin and destination.');
    }

    if (!vehicleMakeModel || !regNumber || !year) {
      return Alert.alert('Missing Info', 'All fields are required.');
    }

    const [make, ...rest] = vehicleMakeModel.trim().split(' ');
    const model = rest.join(' ') || 'UNKNOWN';

    const payload: CreateRequestPayload = {

      origin_location: {
        type: 'Point',
        coordinates: [originCoords.longitude, originCoords.latitude],
      },

      dest_location: {
        type: 'Point',
        coordinates: [destCoords.longitude, destCoords.latitude],
      },

      pickup_date: pickupDate.toISOString(),

      vehicle_details: {
        registration: regNumber.trim(),
        make: make.trim(),
        model: model.trim(),
        year_of_manufacture: parseInt(year, 10),
        wheels_category: wheelsCategory,
        vehicle_category: vehicleCategory,
        loaded: loadedStatus,
      },
    };

    setSubmitting(true);

    try {

      await createRideRequest(payload);

      navigation.navigate('ClientConfirmRequestScreen');

    } catch (err: any) {

      if (err.response?.status === 401) {

        Alert.alert('Session expired', 'Please sign in again');

        await SignoutUser();

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'SigninScreen' }],
          })
        );

      } else {
        Alert.alert('API Error', err.message || 'Submission failed.');
      }

    } finally {
      setSubmitting(false);
    }

  };

  if (checkingProfile || profileComplete === null || locLoading || !region) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#357EBD" />
        <Text style={{ marginTop: 12 }}>Loading...</Text>
      </View>
    );
  }

  if (!profileComplete) {
    return <IncompleteProfileMessage status="incomplete" profile_complete={false} />;
  }

  return (
    <View style={[styles.container, { flex: 1, backgroundColor: '#F0F0F0' }]}>

      <HeaderMenuButton />

      <View style={{ flex: mapFlex }}>
        <Map
          originCoords={originCoords}
          destCoords={destCoords}
          routeCoords={routeCoords}
          onMapPress={handleMapPress}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: formFlex }}
      >

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollForm}
        >

          <Text style={styles.hintText}>
            Tap “From” or “To”, then tap the map to set your location
          </Text>

          <TextInput
            style={styles.input}
            placeholder="From"
            value={originText}
            onChangeText={handleOriginSearch}
          />

          {originResults.map((item) => (
            <TouchableOpacity
              key={item.place_id}
              onPress={() => selectOrigin(item.place_id, item.description)}
            >
              <Text style={{ padding: 10 }}>{item.description}</Text>
            </TouchableOpacity>
          ))}

          <TextInput
            style={styles.input}
            placeholder="To"
            value={destText}
            onChangeText={handleDestSearch}
          />

          {destResults.map((item) => (
            <TouchableOpacity
              key={item.place_id}
              onPress={() => selectDest(item.place_id, item.description)}
            >
              <Text style={{ padding: 10 }}>{item.description}</Text>
            </TouchableOpacity>
          ))}
          <Text style={styles.label}>Pickup Date</Text>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{pickupDate.toDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={pickupDate}
              mode="date"

              display="default"
              minimumDate={new Date()}
              onChange={handleDateChange}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Make & Model (e.g. AUDI A3)"
            placeholderTextColor="#999"
            value={vehicleMakeModel}
            onChangeText={setVehicleMakeModel}
          />

          <TextInput
            style={styles.input}
            placeholder="Registration Number"
            placeholderTextColor="#999"
            value={regNumber}
            onChangeText={setRegNumber}
          />

          <TextInput
            style={styles.input}
            placeholder="Year of Manufacture"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={year}
            onChangeText={setYear}
          />

          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setIsVan(v => !v)}
          >
            <View style={[styles.checkboxBox, isVan && styles.checkboxBoxChecked]} />
            <Text style={styles.checkboxLabel}>Is this a Van?</Text>
          </TouchableOpacity>

          {isVan && (
            <>
              <Text style={styles.label}>Vehicle Category</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={vehicleCategory}
                  onValueChange={v => setVehicleCategory(v as any)}
                  mode="dropdown"  // <-- ADD THIS
                  style={{ color: vehicleCategory ? '#000' : '#999' }}
                >
                  <Picker.Item label="Select Vehicle Category" value="" enabled={false} />
                  <Picker.Item label="Short Wheel Base" value="Short Wheel Base" />
                  <Picker.Item label="Medium Wheel Base" value="Medium Wheel Base" />
                  <Picker.Item label="Long Wheel Base" value="Long Wheel Base" />
                </Picker>
              </View>

              <Text style={styles.label}>Loaded Status</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={loadedStatus}
                  onValueChange={v => setLoadedStatus(v as any)}
                  mode="dropdown"  // <-- ADD THIS
                  style={{ color: vehicleCategory ? '#000' : '#999' }}
                >

                  <Picker.Item label="Unloaded" value="Unloaded" />
                  <Picker.Item label="Loaded" value="Loaded" />
                </Picker>
              </View>
            </>
          )}

          <Text style={styles.label}>Wheels Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={wheelsCategory}
              onValueChange={v => setWheelsCategory(v as any)}
              mode="dropdown"  // <-- ADD THIS
              style={{ color: vehicleCategory ? '#000' : '#999' }}
            >
              <Picker.Item label="Wheels Are Rolling" value="Wheels Are Rolling" />
              <Picker.Item label="Wheels Are Not Rolling" value="Wheels Are Not Rolling" />
            </Picker>
          </View>

          <TouchableOpacity
            style={styles.submit}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>FIND SERVICES</Text>
            )}
          </TouchableOpacity>

        </ScrollView>

      </KeyboardAvoidingView>

    </View>
  );
};

export default ClientDashboardScreen;