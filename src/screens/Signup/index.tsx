import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AuthInput from '../../components/AuthInput';
import PasswordField from '../../components/PasswordField';
import AuthButton from '../../components/AuthButton';
import FooterLink from '../../components/FooterLink';

import { registerClient, registerTrucker } from '../../api/auth';
import { useLoginHandler } from '../../hooks/useLoginHandler';

import styles from './styles';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';

import ClientTermsAndConditionsScreen from '../Client/Terms_Conditions';
import TruckTermsAndConditionsScreen from '../Truck/Terms_Conditions';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const loginHandler = useLoginHandler();

  const [user_name, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isTruck, setIsTruck] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);

  const isValidPass = (pwd: string) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(pwd);

  const emailRegex = /^\S+@\S+\.\S+$/;
  const ukPhoneRegex = /^\+44\d{10}$/;

  const formValid =
    user_name.trim().length >= 3 &&
    ukPhoneRegex.test(phone.trim()) &&
    emailRegex.test(email.trim()) &&
    password === confirmPassword &&
    isValidPass(password);

  const handlePreValidation = () => {
    if (!formValid) {
      Alert.alert('Validation Error', 'Please complete all fields correctly.');
      return;
    }

    setTermsVisible(true);
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const registerFn = isTruck ? registerTrucker : registerClient;
      const { token, user_id, role } = await registerFn(
        user_name,
        phone,
        email,
        password
      );

      await loginHandler(token, user_id, role);

      const successMessage =
        role === 'client'
          ? 'Client Registered! Please complete your profile.'
          : 'Trucker Registered! Please complete your profile.';

      Alert.alert('Success', successMessage);

      navigation.reset({
        index: 0,
        routes: [
          {
            name: role === 'client' ? 'ClientDrawerNavigator' : 'TruckDrawerNavigator',
            state: {
              routes: [
                {
                  name:
                    role === 'client' ? 'ClientProfileScreen' : 'TruckProfileScreen',
                },
              ],
            },
          },
        ],
      });
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong. Please try again.';
      Alert.alert('Please check Credentials', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal visible={termsVisible} animationType="slide" transparent>
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>
            <ScrollView contentContainerStyle={modalStyles.scrollContent}>
              {isTruck ? (
                <TruckTermsAndConditionsScreen hideHeader />
              ) : (
                <ClientTermsAndConditionsScreen hideHeader />
              )}
            </ScrollView>
            <TouchableOpacity
              style={modalStyles.acceptButton}
              onPress={() => {
                setTermsVisible(false);
                handleRegister();
              }}
            >
              <Text style={modalStyles.acceptText}>I Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={modalStyles.declineButton}
              onPress={() => setTermsVisible(false)}
            >
              <Text style={modalStyles.declineText}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.root}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleOption, !isTruck && styles.toggleSelected]}
              onPress={() => setIsTruck(false)}
            >
              <Text
                style={
                  !isTruck ? styles.toggleSelectedText : styles.toggleUnselectedText
                }
              >
                Register as Client
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleOption, isTruck && styles.toggleSelected]}
              onPress={() => setIsTruck(true)}
            >
              <Text
                style={
                  isTruck ? styles.toggleSelectedText : styles.toggleUnselectedText
                }
              >
                Register as Trucker
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.heading}>Create Account</Text>

          <AuthInput placeholder="Username" value={user_name} onChange={setUserName} />
          <AuthInput
            placeholder="Phone (+44XXXXXXXXXX)"
            value={phone}
            onChange={setPhone}
            keyboardType="phone-pad"
          />
          <AuthInput
            placeholder="Email"
            value={email}
            onChange={setEmail}
            keyboardType="email-address"
          />
          <PasswordField
            placeholder="Password"
            value={password}
            onChange={setPassword}
            secure={secure}
            toggleSecure={() => setSecure(!secure)}
          />
          <PasswordField
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            secure={secureConfirm}
            toggleSecure={() => setSecureConfirm(!secureConfirm)}
          />

          <Text
            style={[
              styles.passwordHint,
              password.length >= 8 ? styles.valid : styles.invalid,
            ]}
          >
            • At least 8 characters
          </Text>
          <Text
            style={[
              styles.passwordHint,
              /[A-Z]/.test(password) ? styles.valid : styles.invalid,
            ]}
          >
            • Contains an uppercase letter
          </Text>
          <Text
            style={[
              styles.passwordHint,
              /\d/.test(password) ? styles.valid : styles.invalid,
            ]}
          >
            • Contains a number
          </Text>
          <Text
            style={[
              styles.passwordHint,
              /[^A-Za-z0-9]/.test(password) ? styles.valid : styles.invalid,
            ]}
          >
            • Contains a special character
          </Text>

          <AuthButton
            title="Register"
            onPress={handlePreValidation}
            loading={loading}
            disabled={!formValid || loading}
          />

          <FooterLink
            prompt="Already have an account?"
            linkText="Sign In"
            onPress={() => navigation.navigate('SigninScreen')}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignupScreen;

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  acceptButton: {
    marginTop: 12,
    backgroundColor: '#357EBD',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptText: {
    color: '#fff',
    fontWeight: '600',
  },
  declineButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  declineText: {
    color: '#357EBD',
  },
});
