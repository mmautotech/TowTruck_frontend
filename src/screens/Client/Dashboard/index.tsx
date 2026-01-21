// src/screens/Client/Dashboard/ClientDashboardScreen.tsx

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  ActivityIndicator,
  Alert,
  Keyboard,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions, useNavigation, useFocusEffect } from '@react-navigation/native';
import MapView, { Marker, Polyline, MapPressEvent, LatLng, Region } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Constants from 'expo-constants';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

import styles from './styles';
import HeaderMenuButton from '../../../components/HeaderMenuButton';
import IncompleteProfileMessage from '../../../components/IncompleteProfileMessage';

import type { StackNavigationProp } from '@react-navigation/stack';
import type { ClientStackParamList } from '../../../types';
import { fetchActiveRequest, createRideRequest, CreateRequestPayload } from '../../../api/rideRequest';
import { fetchProfileStatus } from '../../../api/Profile';
import { useLocation } from '../../../hooks/useLocation';
import { SignoutUser } from '../../../utils/Signout_User';
import { useReverseGeocode } from '../../../hooks/useReverseGeocode';

type NavProp = StackNavigationProp<ClientStackParamList, 'ClientDashboardScreen'>;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const GOOGLE_API_KEY =
  Platform.OS === 'ios'
    ? Constants.expoConfig?.extra?.iosMapsApiKey
    : Constants.expoConfig?.extra?.androidMapsApiKey;

const ClientDashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const mapRef = useRef<MapView>(null);

  const [checkingProfile, setCheckingProfile] = useState(true);
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);

  const { coords, loading: locLoading } = useLocation();
  const { reverseGeocode, loading: geoLoading } = useReverseGeocode();

  const [region, setRegion] = useState<Region | null>(null);
  const [originCoords, setOriginCoords] = useState<LatLng | null>(null);
  const [destCoords, setDestCoords] = useState<LatLng | null>(null);
  const [originAddress, setOriginAddress] = useState('');
  const [destAddress, setDestAddress] = useState('');

  const [pickupDate, setPickupDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [vehicleMakeModel, setVehicleMakeModel] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [year, setYear] = useState('');
  const [isVan, setIsVan] = useState(false);
  const [vehicleCategory, setVehicleCategory] = useState<'donot-apply' | 'Short Wheel Base' | 'Medium Wheel Base' | 'Long Wheel Base'>('donot-apply');
  const [loadedStatus, setLoadedStatus] = useState<'Unloaded' | 'Loaded'>('Unloaded');
  const [wheelsCategory, setWheelsCategory] = useState<'Wheels Are Rolling' | 'Wheels Are Not Rolling'>('Wheels Are Rolling');
  const [submitting, setSubmitting] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [routes, setRoutes] = useState<{ coordinates: LatLng[]; distance: number; duration: number }[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  // Keyboard animation
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

  // Check profile
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
      return () => { active = false; };
    }, [])
  );

  // Redirect active request
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
            case 'created': target = 'ClientConfirmRequestScreen'; break;
            case 'posted': target = 'ClientServicesScreen'; break;
            case 'accepted': target = 'ClientDriverTrackingScreen'; break;
            default: return;
          }
          navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: target }] }));
        } catch (err: any) {
          if (err.response?.status === 401) {
            Alert.alert('Session expired', 'Please sign in again');
            await SignoutUser();
            navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'SigninScreen' }] }));
          }
        }
      })();
      return () => { active = false; };
    }, [profileComplete, navigation])
  );

  // Set initial region
  useEffect(() => {
    if (!coords) return;
    setRegion({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  }, [coords]);

  const mapFlex = keyboardVisible ? 0.4 : 0.7;
  const formFlex = keyboardVisible ? 0.6 : 0.3;

  // Map press handler
  const handleMapPress = async (e: MapPressEvent) => {
    const c = e.nativeEvent.coordinate;
    const address = await reverseGeocode(c);

    if (!originCoords) {
      setOriginCoords(c);
      setOriginAddress(address);
    } else if (!destCoords) {
      setDestCoords(c);
      setDestAddress(address);
    } else {
      Alert.alert('Both locations are set', 'Drag markers to change their position.');
    }

    mapRef.current?.animateToRegion({ ...c, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 500);
  };

  // Drag end handlers
  const handleOriginDragEnd = async (e: any) => {
    const c = e.nativeEvent.coordinate;
    setOriginCoords(c);
    setOriginAddress(await reverseGeocode(c));
  };

  const handleDestDragEnd = async (e: any) => {
    const c = e.nativeEvent.coordinate;
    setDestCoords(c);
    setDestAddress(await reverseGeocode(c));
  };

  const handleDateChange = (_: DateTimePickerEvent, d?: Date) => {
    setShowDatePicker(false);
    if (d) setPickupDate(d);
  };

  const handleSubmit = async () => {
    if (!originCoords || !destCoords) return Alert.alert('Missing Info', 'Set both origin and destination.');
    if (!vehicleMakeModel || !regNumber || !year) return Alert.alert('Missing Info', 'All fields are required.');
    if (!GOOGLE_API_KEY) return Alert.alert('Error', 'Google API key is missing.');

    const [make, ...rest] = vehicleMakeModel.trim().split(' ');
    const model = rest.join(' ') || 'UNKNOWN';

    const payload: CreateRequestPayload = {
      origin_location: { type: 'Point', coordinates: [originCoords.longitude, originCoords.latitude] },
      dest_location: { type: 'Point', coordinates: [destCoords.longitude, destCoords.latitude] },
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
        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'SigninScreen' }] }));
      } else {
        Alert.alert('API Error', err.response?.data?.message || err.message || 'Submission failed.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderFormHeader = () => (
    <>
      <Text style={styles.hintText}>Enter origin and destination directly</Text>

      {/* Origin */}
      <GooglePlacesAutocomplete
        placeholder="From"
        fetchDetails
        onPress={async (data, details = null) => {
          if (!details) return;
          const coords: LatLng = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          };
          setOriginCoords(coords);
          setOriginAddress(data.description);
          mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 500);
        }}
        query={{ key: GOOGLE_API_KEY || '', language: 'en' }}
        styles={{ textInput: styles.input, container: { flex: 0, marginBottom: 10 }, listView: { backgroundColor: '#fff' } }}
        textInputProps={{ value: originAddress, onChangeText: setOriginAddress }}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={300}
      />

      {/* Destination */}
      <GooglePlacesAutocomplete
        placeholder="To"
        fetchDetails
        onPress={async (data, details = null) => {
          if (!details) return;
          const coords: LatLng = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          };
          setDestCoords(coords);
          setDestAddress(data.description);
          mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 500);
        }}
        query={{ key: GOOGLE_API_KEY || '', language: 'en' }}
        styles={{ textInput: styles.input, container: { flex: 0, marginBottom: 10 }, listView: { backgroundColor: '#fff' } }}
        textInputProps={{ value: destAddress, onChangeText: setDestAddress }}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={300}
      />

      <Text style={styles.label}>Pickup Date</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text>{pickupDate.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && <DateTimePicker value={pickupDate} mode="date" display="default" minimumDate={new Date()} onChange={handleDateChange} />}

      <TextInput style={styles.input} placeholder="Make & Model (e.g. AUDI A3)" value={vehicleMakeModel} onChangeText={setVehicleMakeModel} />
      <TextInput style={styles.input} placeholder="Registration Number" value={regNumber} onChangeText={setRegNumber} />
      <TextInput style={styles.input} placeholder="Year of Manufacture" keyboardType="numeric" value={year} onChangeText={setYear} />

      <TouchableOpacity style={styles.checkbox} onPress={() => setIsVan(v => !v)}>
        <View style={[styles.checkboxBox, isVan && styles.checkboxBoxChecked]} />
        <Text style={styles.checkboxLabel}>Is this a Van?</Text>
      </TouchableOpacity>

      {isVan && (
        <>
          <Text style={styles.label}>Vehicle Category</Text>
          <Picker selectedValue={vehicleCategory} onValueChange={v => setVehicleCategory(v as any)}>
            <Picker.Item label="Options" value="donot-apply" />
            <Picker.Item label="Short Wheel Base" value="Short Wheel Base" />
            <Picker.Item label="Medium Wheel Base" value="Medium Wheel Base" />
            <Picker.Item label="Long Wheel Base" value="Long Wheel Base" />
          </Picker>

          <Text style={styles.label}>Loaded Status</Text>
          <Picker selectedValue={loadedStatus} onValueChange={v => setLoadedStatus(v as any)}>
            <Picker.Item label="Unloaded" value="Unloaded" />
            <Picker.Item label="Loaded" value="Loaded" />
          </Picker>
        </>
      )}

      <Text style={styles.label}>Wheels Category</Text>
      <Picker selectedValue={wheelsCategory} onValueChange={v => setWheelsCategory(v as any)}>
        <Picker.Item label="Wheels Are Rolling" value="Wheels Are Rolling" />
        <Picker.Item label="Wheels Are Not Rolling" value="Wheels Are Not Rolling" />
      </Picker>
    </>
  );

  const renderFormFooter = () => (
    <TouchableOpacity
      style={styles.submit}
      onPress={handleSubmit}
      disabled={submitting || !originCoords || !destCoords || !vehicleMakeModel || !regNumber || !year}
    >
      {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>FIND SERVICES</Text>}
    </TouchableOpacity>
  );

  if (checkingProfile || profileComplete === null || locLoading || !region || geoLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#357EBD" />
        <Text style={{ marginTop: 12 }}>Loading...</Text>
      </View>
    );
  }

  if (!profileComplete) return <IncompleteProfileMessage status="incomplete" profile_complete={false} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F0F0' }}>
      <View style={[styles.container, { flex: 1, backgroundColor: '#F0F0F0' }]}>
        <HeaderMenuButton />

        {/* Map */}
        <View style={{ flex: mapFlex }}>
          <MapView ref={mapRef} style={{ flex: 1 }} region={region} onPress={handleMapPress}>
            {originCoords && (
              <Marker
                coordinate={originCoords}
                title="From"
                pinColor="green"
                draggable
                onDragEnd={handleOriginDragEnd}
              />
            )}
            {destCoords && (
              <Marker
                coordinate={destCoords}
                title="To"
                pinColor="red"
                draggable
                onDragEnd={handleDestDragEnd}
              />
            )}
            {originCoords && destCoords && routes.length === 0 && GOOGLE_API_KEY && (
              <MapViewDirections
                origin={originCoords}
                destination={destCoords}
                apikey={GOOGLE_API_KEY}
                strokeWidth={4}
                strokeColor="#357EBD"
                mode="DRIVING"
                onReady={result => {
                  const mainRoute = { coordinates: result.coordinates, distance: result.distance, duration: result.duration };
                  setRoutes([mainRoute]);
                  setSelectedRouteIndex(0);
                  setDistance(mainRoute.distance);
                  setDuration(mainRoute.duration);
                  mapRef.current?.fitToCoordinates(mainRoute.coordinates, { edgePadding: { top: 50, bottom: 50, left: 50, right: 50 } });
                }}
              />
            )}
            {routes.map((r, i) => (
              <Polyline
                key={i}
                coordinates={r.coordinates}
                strokeWidth={i === selectedRouteIndex ? 6 : 4}
                strokeColor={i === selectedRouteIndex ? '#357EBD' : '#AAA'}
              />
            ))}
          </MapView>

          {distance && duration && (
            <View style={styles.distanceBox}>
              <Text>Distance: {(distance * 0.621371).toFixed(1)} miles</Text>
              <Text>ETA: {Math.ceil(duration)} mins</Text>
            </View>
          )}

        </View>

        {/* Form */}
        <KeyboardAwareFlatList
          keyboardShouldPersistTaps="handled"
          style={{ flex: formFlex }}
          contentContainerStyle={{ padding: 10 }}
          data={[]}
          renderItem={null}
          ListHeaderComponent={renderFormHeader()}
          ListFooterComponent={renderFormFooter()}
          keyExtractor={() => 'form'}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={20}
          enableOnAndroid
          enableResetScrollToCoords={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default ClientDashboardScreen;
