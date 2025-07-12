// src/components/IncompleteProfileMessage.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HeaderMenuButton from './HeaderMenuButton';

type Props = {
  status: string;
  profile_complete: boolean;
};

const IncompleteProfileMessage: React.FC<Props> = ({   status = 'active',profile_complete = false }) => {
  let message = '';
  let title = '';

  if (status === 'blocked') {
    title = 'Access Denied';
    message = 'Your services have been blocked by the admin. Please contact support for more information.';
  } else if (!profile_complete) {
    title = 'Profile Incomplete';
    message = 'Your profile is incomplete. Please complete your profile to continue using the app.';
  } else {
    title = 'Setup Required';
    message = 'You cannot proceed until your account is fully set up.';
  }

  return (
    <View style={styles.container}>
      <HeaderMenuButton />
      <View style={styles.messageBox}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  messageBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    color: '#C00',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

export default IncompleteProfileMessage;
