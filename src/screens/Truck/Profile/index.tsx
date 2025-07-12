// src/screens/Truck/Profile/index.tsx

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  ToastAndroid,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';

import {
  getDriverProfile,
  updateDriverProfile,
  getVehicleProfile,
  updateVehicleProfile
} from '../../../api';
import CustomHeader from '../../../components/CustomHeader';
import UploadImageBox from '../../../components/UploadImageBox';
import LabeledTextInput from '../../../components/LabeledTextInput';
import styles from './styles';
import { TruckDrawerParamList } from '../../../types';

export default function TruckProfileScreen() {
  const navigation = useNavigation<DrawerNavigationProp<TruckDrawerParamList>>();
  const [activeTab, setActiveTab] = useState<'driver' | 'vehicle'>('driver');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // driver state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [frontImg, setFrontImg] = useState<string | null>(null);
  const [backImg, setBackImg] = useState<string | null>(null);
  const [selfieImg, setSelfieImg] = useState<string | null>(null);
  const [driverErrors, setDriverErrors] = useState<{ [key: string]: string }>({});

  // vehicle state
  const [registration, setRegistration] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [vehicleImg, setVehicleImg] = useState<string | null>(null);
  const [vehicleErrors, setVehicleErrors] = useState<{ [key: string]: string }>({});

  // load data on focus / tab-change
  useFocusEffect(
    useCallback(() => {
      let active = true;
      const load = async () => {
        setLoading(true);
        try {
          if (activeTab === 'driver') {
            const p = await getDriverProfile();
            if (!active) return;
            setFirstName(p.firstName || '');
            setLastName(p.lastName || '');
            setDob(p.dateOfBirth || '');
            setLicenseNumber(p.licenseNumber || '');
            setLicenseExpiry(p.licenseExpiry || '');
            setEmail(p.email || '');
            setPhoneNumber(p.phone || '');
            setFrontImg(p.licenseFront || null);
            setBackImg(p.licenseBack || null);
            setSelfieImg(p.licenseSelfie || null);
          } else {
            const v = await getVehicleProfile();
            if (!active) return;
            setRegistration(v.registration_number || '');
            setMake(v.make || '');
            setModel(v.model || '');
            setColor(v.color || '');
            setVehicleImg(v.vehiclePhoto || null);
          }
        } catch {
          ToastAndroid.show('Failed to load profile.', ToastAndroid.LONG);
        } finally {
          if (active) setLoading(false);
        }
      };
      load();
      return () => { active = false; };
    }, [activeTab])
  );

  // image picker
  const handlePickImage = (type: string) => {
    Alert.alert('Select Image Source', '', [
      {
        text: 'Camera',
        onPress: async () => {
          const perm = await ImagePicker.requestCameraPermissionsAsync();
          if (!perm.granted) return;
          const res = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.7 });
          if (!res.canceled && res.assets.length) {
            const uri = res.assets[0].uri;
            if (activeTab === 'driver') {
              if (type === 'frontImg') setFrontImg(uri);
              if (type === 'backImg')  setBackImg(uri);
              if (type === 'selfieImg')setSelfieImg(uri);
            } else {
              setVehicleImg(uri);
            }
          }
        }
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7
          });
          if (!res.canceled && res.assets.length) {
            const uri = res.assets[0].uri;
            if (activeTab === 'driver') {
              if (type === 'frontImg') setFrontImg(uri);
              if (type === 'backImg')  setBackImg(uri);
              if (type === 'selfieImg')setSelfieImg(uri);
            } else {
              setVehicleImg(uri);
            }
          }
        }
      },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  // validators
  const validateDriver = () => {
    const errs: any = {};
    if (!firstName.trim()) errs.firstName = 'Required';
    if (!lastName.trim())  errs.lastName  = 'Required';
    if (!dob.trim())       errs.dob       = 'Required';
    if (!licenseNumber.trim()) errs.licenseNumber = 'Required';
    if (!licenseExpiry.trim()) errs.licenseExpiry = 'Required';
    if (!email.trim())     errs.email     = 'Required';
    if (!phoneNumber.trim()) errs.phoneNumber = 'Required';
    setDriverErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateVehicle = () => {
    const errs: any = {};
    if (!registration.trim()) errs.registration = 'Required';
    if (!make.trim())         errs.make         = 'Required';
    if (!model.trim())        errs.model        = 'Required';
    if (!color.trim())        errs.color        = 'Required';
    setVehicleErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // save handler
  const handleSave = async () => {
    // driver tab: save & switch
    if (activeTab === 'driver') {
      if (!validateDriver()) return;
      setSaving(true);
      try {
        const form = new FormData();
        form.append('first_name', firstName);
        form.append('last_name', lastName);
        form.append('date_of_birth', dob);
        form.append('license_number', licenseNumber);
        form.append('license_expiry', licenseExpiry);
        form.append('email', email);
        form.append('phone_number', phoneNumber);
        if (frontImg?.startsWith('file'))
          form.append('license_Front', { uri: frontImg, name: 'front.jpg', type: 'image/jpeg' } as any);
        if (backImg?.startsWith('file'))
          form.append('license_Back', { uri: backImg,  name: 'back.jpg',  type: 'image/jpeg' } as any);
        if (selfieImg?.startsWith('file'))
          form.append('license_Selfie', { uri: selfieImg, name: 'selfie.jpg', type: 'image/jpeg' } as any);

        await updateDriverProfile(form);
        ToastAndroid.show('Driver profile updated!', ToastAndroid.SHORT);
        setActiveTab('vehicle');
      } catch (err: any) {
        ToastAndroid.show(err?.message || 'Failed to update driver.', ToastAndroid.LONG);
      } finally {
        setSaving(false);
      }
      return;
    }

    // vehicle tab: save & navigate
    if (!validateVehicle()) return;
    setSaving(true);
    try {
      const form = new FormData();
      form.append('registration_number', registration);
      form.append('make', make);
      form.append('model', model);
      form.append('color', color);
      if (vehicleImg?.startsWith('file'))
        form.append('vehiclePhoto', { uri: vehicleImg, name: 'vehicle.jpg', type: 'image/jpeg' } as any);

      await updateVehicleProfile(form);
      ToastAndroid.show('Vehicle profile updated!', ToastAndroid.SHORT);
      navigation.navigate('TruckDashboardStackNavigator');
    } catch (err: any) {
      ToastAndroid.show(err?.message || 'Failed to update vehicle.', ToastAndroid.LONG);
    } finally {
      setSaving(false);
    }
  };

  // forms
  const renderDriverForm = () => (
    <>
      <LabeledTextInput label="First Name" value={firstName} onChangeText={setFirstName} error={driverErrors.firstName} />
      <LabeledTextInput label="Last Name"  value={lastName}  onChangeText={setLastName}  error={driverErrors.lastName} />
      <LabeledTextInput
        label="Email"
        value={email}
        onChangeText={() => {}}
        editable={false}
        style={{ backgroundColor: '#f2f2f2' }}
      />
      <LabeledTextInput
        label="Phone"
        value={phoneNumber}
        onChangeText={() => {}}
        editable={false}
        style={{ backgroundColor: '#f2f2f2' }}
      />
      <LabeledTextInput label="Date of Birth"    value={dob}            onChangeText={setDob} error={driverErrors.dob} placeholder="DD-MM-YYYY" />
      <LabeledTextInput label="License Number"   value={licenseNumber} onChangeText={setLicenseNumber} error={driverErrors.licenseNumber} />
      <LabeledTextInput label="License Expiry"   value={licenseExpiry} onChangeText={setLicenseExpiry} error={driverErrors.licenseExpiry} placeholder="DD-MM-YYYY" />
      <UploadImageBox label="License Front" image={frontImg}    onPress={()=>handlePickImage('frontImg')}    onRemove={()=>setFrontImg(null)} />
      <UploadImageBox label="License Back"  image={backImg}     onPress={()=>handlePickImage('backImg')}     onRemove={()=>setBackImg(null)} />
      <UploadImageBox label="Selfie"        image={selfieImg} onPress={()=>handlePickImage('selfieImg')} onRemove={()=>setSelfieImg(null)} />
    </>
  );

  const renderVehicleForm = () => (
    <>
      <LabeledTextInput label="Registration" value={registration} onChangeText={setRegistration} error={vehicleErrors.registration} />
      <LabeledTextInput label="Make"         value={make}         onChangeText={setMake}         error={vehicleErrors.make} />
      <LabeledTextInput label="Model"        value={model}        onChangeText={setModel}        error={vehicleErrors.model} />
      <LabeledTextInput label="Color"        value={color}        onChangeText={setColor}        error={vehicleErrors.color} />
      <UploadImageBox label="Truck View" image={vehicleImg} onPress={()=>handlePickImage('vehicleImg')} onRemove={()=>setVehicleImg(null)} />
    </>
  );

  return (
    <View style={styles.container}>
      <CustomHeader title="Profile" />
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'driver'  && styles.activeToggleButton]}
          onPress={() => setActiveTab('driver')}
        >
          <Text style={[styles.toggleText, activeTab === 'driver'  && styles.activeToggleText]}>Driver</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'vehicle' && styles.activeToggleButton]}
          onPress={() => setActiveTab('vehicle')}
        >
          <Text style={[styles.toggleText, activeTab === 'vehicle' && styles.activeToggleText]}>Vehicle</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {loading ? (
          <View style={localStyles.loaderContent}>
            <ActivityIndicator size="large" color="#357EBD" />
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
              {activeTab === 'driver' ? renderDriverForm() : renderVehicleForm()}
            </ScrollView>
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.saveButton, saving && { opacity: 0.6 }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </>
        )}

        {saving && (
          <View style={localStyles.overlay}>
            <ActivityIndicator size="large" color="#357EBD" />
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loaderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
