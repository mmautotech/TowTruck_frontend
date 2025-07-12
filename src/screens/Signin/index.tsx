import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';

import styles from './styles';
import { login } from '../../api/auth';
// import Logo from '../../../assets/logo.png';
import type { RootStackParamList } from '../../types';
import { useLoginHandler } from '../../hooks/useLoginHandler';

type Props = {
  navigation: NavigationProp<RootStackParamList, 'SigninScreen'>;
};

const SigninScreen: React.FC<Props> = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [pass, setPass] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const loginHandler = useLoginHandler();

  const trimmedPhone = phone.trim();
  const trimmedPass = pass.trim();

  // UK phone format: +44 followed by exactly 10 digits
  const phoneRegex = /^\+44\d{10}$/;

  // Password: at least 8 characters, 1 uppercase, 1 number, 1 special character
  const isValidPassword = (pwd: string) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pwd);

  const isPhoneValid = phoneRegex.test(trimmedPhone);
  const isPasswordValid = isValidPassword(trimmedPass);

  const formValid = isPhoneValid && isPasswordValid;

  const handleSignIn = async () => {
    if (!formValid) {
      let msg = 'Please correct the following:\n';
      if (!isPhoneValid) msg += '- Phone must be in format +44XXXXXXXXXX\n';
      if (!isPasswordValid) {
        msg += '- Password must be at least 8 characters,\n';
        msg += '  include an uppercase letter, a number,\n';
        msg += '  and a special character';
      }
      return Alert.alert('Validation Error', msg.trim());
    }

    setLoading(true);
    try {
      const { token, user_id, role } = await login(trimmedPhone, trimmedPass);
      await loginHandler(token, user_id, role);
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'Login failed';
      Alert.alert('Login Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Image source={require('../../../assets/logo.png')} style={styles.logo} />
            <Text style={styles.heading}>Sign In</Text>

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                secureTextEntry={secure}
                value={pass}
                onChangeText={setPass}
              />
              <TouchableOpacity onPress={() => setSecure(s => !s)}>
                <Text style={styles.showText}>{secure ? 'Show' : 'Hide'}</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 24 }} />

            <TouchableOpacity
              style={[
                styles.button,
                (!formValid || loading) && { opacity: 0.6 },
              ]}
              onPress={handleSignIn}
              disabled={!formValid || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPasswordScreen')}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignupScreen')}
              >
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SigninScreen;
