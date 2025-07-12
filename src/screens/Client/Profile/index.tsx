// src/screens/Client/Profile/ClientProfileScreen.tsx

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  ToastAndroid,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { setItem } from '../../../utils/asyncStorage';
import * as ImagePicker from 'expo-image-picker';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

import { getClientProfile, updateClientProfile } from '../../../api/Profile';
import { compressImage } from '../../../hooks/useCompressedImage';
import CustomHeader from '../../../components/CustomHeader';
import ProfileImageHandler from '../../../components/ProfileImageHandler';
import LabeledTextInput from '../../../components/LabeledTextInput';
import styles from './styles';

export default function ClientProfileScreen() {
  const navigation = useNavigation();

  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<any>(null);

  const [originalProfile, setOriginalProfile] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const skipUnsavedGuard = useRef(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function loadProfile() {
        setLoading(true);
        try {
          const profile = await getClientProfile();
          if (!active) return;
          setFirstName(profile.first_name || '');
          setLastName(profile.last_name || '');
          setEmail(profile.email || '');
          setAddress(profile.address || '');
          setPhoneNumber(profile.phone || '');
          setAvatarUri(profile.profile_photo || null);
          setCompressedImage(null);
          setOriginalProfile({
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            email: profile.email || '',
            address: profile.address || '',
            phone_number: profile.phone || '',
            avatarUri: profile.profile_photo || null,
          });
        } catch (err) {
          console.error('Profile fetch error:', err);
          ToastAndroid.show('Failed to load profile.', ToastAndroid.LONG);
        } finally {
          if (active) setLoading(false);
        }
      }
      loadProfile();
      return () => {
        active = false;
      };
    }, [])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (skipUnsavedGuard.current) return;

      const hasChanges =
        JSON.stringify({
          first_name,
          last_name,
          email,
          address,
          phone_number,
          avatarUri,
        }) !== JSON.stringify(originalProfile);

      if (!hasChanges) return;

      e.preventDefault();
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Discard them and leave?',
        [
          { text: 'Stay', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });
    return unsubscribe;
  }, [
    navigation,
    first_name,
    last_name,
    email,
    address,
    phone_number,
    avatarUri,
    originalProfile,
  ]);

  const handlePickImage = () => {
    Alert.alert('Select Image Source', '', [
      {
        text: 'Camera',
        onPress: async () => {
          const perm = await ImagePicker.requestCameraPermissionsAsync();
          if (!perm.granted) return;
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.7,
          });
          if (!result.canceled && result.assets.length > 0) {
            const asset = result.assets[0];
            setAvatarUri(asset.uri);
            const compressed = await compressImage(asset.uri);
            setCompressedImage(compressed);
          }
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
          });
          if (!result.canceled && result.assets.length > 0) {
            const asset = result.assets[0];
            setAvatarUri(asset.uri);
            const compressed = await compressImage(asset.uri);
            setCompressedImage(compressed);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!first_name.trim()) newErrors.first_name = 'First name is required';
    if (!last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!email.trim() || !email.includes('@'))
      newErrors.email = 'Valid email required';
    if (!address.trim()) newErrors.address = 'Address required';
    if (!phone_number.trim()) newErrors.phone_number = 'Phone required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const form = new FormData();
      form.append('first_name', first_name.trim());
      form.append('last_name', last_name.trim());
      form.append('email', email.trim());
      form.append('address', address.trim());
      form.append('phone_number', phone_number.trim());

      let imageChanged = false;

      if (compressedImage) {
        form.append('profile_photo', {
          uri: compressedImage.uri,
          name: compressedImage.name,
          type: compressedImage.type,
        } as any);
        imageChanged = true;
      }

      await updateClientProfile(form);
      ToastAndroid.show('Profile updated successfully!', ToastAndroid.SHORT);

      if (imageChanged) {
        await setItem('setDrawer', 'true');
      }

      setOriginalProfile({
        first_name,
        last_name,
        email,
        address,
        phone_number,
        avatarUri,
      });

      skipUnsavedGuard.current = true;
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'ClientDashboardStackNavigator' }],
        })
      );
    } catch (err: any) {
      console.error('Update profile error:', err);
      ToastAndroid.show(err?.message || 'Failed to update profile.', ToastAndroid.LONG);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="My Profile" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {loading ? (
          <View style={localStyles.loaderContainer}>
            <ActivityIndicator size="large" color="#357EBD" />
          </View>
        ) : (
          <View style={{ flex: 1 }} pointerEvents={saving ? 'none' : 'auto'}>
            <ScrollView contentContainerStyle={styles.formContainer}>
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <ProfileImageHandler
                  label="Profile Image"
                  imageUri={avatarUri}
                  onPickImage={handlePickImage}
                />
              </View>
              <LabeledTextInput
                label="First Name"
                value={first_name}
                onChangeText={setFirstName}
                error={errors.first_name}
              />
              <LabeledTextInput
                label="Last Name"
                value={last_name}
                onChangeText={setLastName}
                error={errors.last_name}
              />
              <LabeledTextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                editable={false}
                style={{ backgroundColor: '#f2f2f2', color: '#666' }}
              />
              <LabeledTextInput
                label="Address"
                value={address}
                onChangeText={setAddress}
                error={errors.address}
              />
              <LabeledTextInput
                label="Phone"
                value={phone_number}
                onChangeText={setPhoneNumber}
                editable={false}
                style={{ backgroundColor: '#f2f2f2', color: '#666' }}
              />
            </ScrollView>
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.saveButton, saving && { opacity: 0.6 }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
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
    zIndex: 999,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
