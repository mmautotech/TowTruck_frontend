import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ToastAndroid,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../../../components/CustomHeader';
import styles from './style';
import { forgotPassword } from '../../../api';
import { getClientProfile } from '../../../api/Profile';
import { useFocusEffect } from '@react-navigation/native';

const ClientSettingsScreen: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

  const isValidPhone = /^\+44\d{10}$/.test(phone.trim());
  const isValidPassword = (pwd: string) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pwd);
  const passwordsMatch = newPassword === confirmPassword;

  const isFormValid = isValidPhone && isValidPassword(newPassword) && passwordsMatch;

  // Autofill phone from client profile
  useFocusEffect(
    useCallback(() => {
      let active = true;

      const fetchPhone = async () => {
        try {
          const profile = await getClientProfile();
          if (active && profile?.phone) {
            setPhone(profile.phone);
          }
        } catch (err) {
          console.error('Failed to fetch phone number:', err);
        }
      };

      fetchPhone();

      return () => {
        active = false;
      };
    }, [])
  );

  const handleChangePassword = async () => {
    if (!isFormValid) {
      ToastAndroid.show('❌ Please fix the form errors first', ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(phone.trim(), newPassword);
      ToastAndroid.show(`✅ ${res.message}`, ToastAndroid.SHORT);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      ToastAndroid.show(`❌ ${err.message}`, ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordField = (
    label: string,
    value: string,
    onChange: (val: string) => void,
    secure: boolean,
    toggleSecure: () => void
  ) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={{ position: 'relative' }}>
        <TextInput
          style={styles.input}
          placeholder={label}
          secureTextEntry={secure}
          value={value}
          onChangeText={onChange}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 12,
            top: 18,
          }}
          onPress={toggleSecure}
        >
          <Ionicons name={secure ? 'eye-off' : 'eye'} size={22} color="#666" />
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <CustomHeader title="Change Password" showMenuButton />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#f2f2f2', color: '#666' }]}
            placeholder="+44XXXXXXXXXX"
            keyboardType="phone-pad"
            value={phone}
            editable={false}
          />

          {renderPasswordField('New Password', newPassword, setNewPassword, secureNew, () => setSecureNew(p => !p))}
          {renderPasswordField('Confirm Password', confirmPassword, setConfirmPassword, secureConfirm, () => setSecureConfirm(p => !p))}

          {/* Password Hint Section */}
          <View style={styles.passwordHintContainer}>
            <Text style={[styles.passwordHint, newPassword.length >= 8 ? styles.valid : styles.invalid]}>
              • At least 8 characters
            </Text>
            <Text style={[styles.passwordHint, /[0-9]/.test(newPassword) ? styles.valid : styles.invalid]}>
              • Contains a number
            </Text>
            <Text style={[styles.passwordHint, /[^A-Za-z0-9]/.test(newPassword) ? styles.valid : styles.invalid]}>
              • Contains a special character
            </Text>
            <Text style={[styles.passwordHint, /[A-Z]/.test(newPassword) ? styles.valid : styles.invalid]}>
              • Contains an uppercase letter
            </Text>
            {newPassword && confirmPassword ? (
              <Text style={[styles.passwordHint, passwordsMatch ? styles.valid : styles.invalid]}>
                • Passwords match
              </Text>
            ) : null}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.footerButton,
                { opacity: loading || !isFormValid ? 0.5 : 1 },
              ]}
              onPress={handleChangePassword}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.footerButtonText}>Change Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ClientSettingsScreen;
