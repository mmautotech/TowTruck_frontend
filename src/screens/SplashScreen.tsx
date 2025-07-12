import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('user_token');
        const role = await AsyncStorage.getItem('role');

        const target =
          token && role === 'client'
            ? 'ClientDrawerNavigator'
            : token && role === 'truck'
            ? 'TruckDrawerNavigator'
            : 'SigninScreen';

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: target }],
          })
        );
      } catch (error) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'SigninScreen' }],
          })
        );
      }
    };

    checkAuth();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/splash-icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#357EBD" />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#357EBD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
});
