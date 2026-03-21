import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import AuthInput from '../../components/AuthInput';
import PasswordField from '../../components/PasswordField';
import AuthButton from '../../components/AuthButton';
import FooterLink from '../../components/FooterLink';

import { forgotPassword } from '../../api';
import styles from './styles';
import type { RootStackParamList } from '../../types';

type ForgotPasswordNav = StackNavigationProp<RootStackParamList, 'ForgotPasswordScreen'>;
type Props = { navigation: ForgotPasswordNav };

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [phoneNo, setPhoneNo] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('#F0F0F0');
    }, [])
  );

  const phoneRegex = /^\+44\d{10}$/;
  const isValidPhone = phoneRegex.test(phoneNo.trim());

  const isValidPass = (pwd: string) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(pwd);

  const passwordsMatch = newPassword === confirmPassword;

  const isFormValid =
    isValidPhone &&
    isValidPass(newPassword) &&
    passwordsMatch &&
    !!newPassword &&
    !!confirmPassword;

  const handleReset = async () => {
    if (!isFormValid) {
      let errorMsg = 'Please correct the following:\n';
      if (!isValidPhone) errorMsg += '- Invalid phone number (+44XXXXXXXXXX required)\n';
      if (!isValidPass(newPassword))
        errorMsg += '- Password must be at least 8 chars, include a capital letter, a number & a special char\n';
      if (!passwordsMatch) errorMsg += '- Passwords do not match';
      Alert.alert('Validation Error', errorMsg.trim());
      return;
    }

    setLoading(true);
    try {
      const { message } = await forgotPassword(phoneNo.trim(), newPassword);
      Alert.alert('Success', message);
      setTimeout(() => navigation.navigate('SigninScreen'), 2000);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#F0F0F0' }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.formContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.heading}>Reset Password</Text>

            <AuthInput
              placeholder="Phone Number"

              value={phoneNo}
              onChange={setPhoneNo}
              keyboardType="phone-pad"
            />

            <PasswordField
              placeholder="New Password"
              value={newPassword}
              onChange={setNewPassword}
              secure={secureNew}
              toggleSecure={() => setSecureNew(p => !p)}
            />

            <PasswordField
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              secure={secureConfirm}
              toggleSecure={() => setSecureConfirm(p => !p)}
            />

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

            <AuthButton
              title="Reset Password"
              onPress={handleReset}
              loading={loading}
              disabled={!isFormValid || loading}
            />

            <FooterLink
              prompt="Remembered your password?"
              linkText="Sign In"
              onPress={() => navigation.navigate('SigninScreen')}
            />

            <FooterLink
              prompt="Don't have an account?"
              linkText="Sign Up"
              onPress={() => navigation.navigate('SignupScreen')}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgotPasswordScreen;
