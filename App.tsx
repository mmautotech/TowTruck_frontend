import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import FlashMessage from 'react-native-flash-message';

import { navigationRef } from './src/navigation/RootNavigation';
import RootStackNavigator from './src/navigation/RootStackNavigator';
import { RootStackParamList } from './src/types';
import { disconnectSocket } from './src/utils/socket';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('SigninScreen');

  useEffect(() => {
    // You can replace this logic later with async login token check
    setInitialRoute('SigninScreen');
    setLoading(false);

    return () => {
      disconnectSocket();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer ref={navigationRef}>
            <RootStackNavigator initialRouteName={initialRoute} />
          </NavigationContainer>
          <FlashMessage position="top" />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
