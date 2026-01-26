import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp } from '../../src/utils/responsive';

interface CancelRideModalProps {
  visible: boolean;
  onClose: () => void;
  onCancelPermanent: (reason: string) => void;
  onReopen: (reason: string) => void;
  loading?: boolean;
}

export const CancelRideModal: React.FC<CancelRideModalProps> = ({
  visible,
  onClose,
  onCancelPermanent,
  onReopen,
  loading,
}) => {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!visible) setReason('');
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // adjust if needed
            style={{ width: '100%' }}
          >
            <ScrollView
              contentContainerStyle={styles.container}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.title}>Cancel Ride</Text>
              <Text style={styles.subtitle}>Please provide a reason:</Text>

              <TextInput
                style={styles.textInput}
                placeholder="Enter cancellation reason"
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={3}
                maxLength={140}
              />

              <TouchableOpacity
                style={[styles.permanentButton, (loading || !reason.trim()) && { opacity: 0.5 }]}
                onPress={() => onCancelPermanent(reason)}
                disabled={loading || !reason.trim()}
              >
                <Text style={styles.permanentText}>Cancel Permanently</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.reopenButton, (loading || !reason.trim()) && { opacity: 0.5 }]}
                onPress={() => onReopen(reason)}
                disabled={loading || !reason.trim()}
              >
                <Text style={styles.reopenText}>Reopen for New Offers</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeModal} onPress={onClose}>
                <Ionicons name="close" size={wp(6)} color="#888" />
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.32)',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  container: {
    width: '100%',
    padding: wp(6),
    backgroundColor: '#fff',
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    alignItems: 'center',
    shadowColor: '#333',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 12,
    elevation: 24,
  },
  title: {
    fontSize: wp(5.2),
    fontWeight: 'bold',
    marginBottom: hp(1),
    color: '#357EBD',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: wp(4),
    color: '#555',
    marginBottom: hp(1.5),
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp(2),
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    marginBottom: hp(2),
    width: '100%',
    fontSize: wp(3.8),
    textAlignVertical: 'top',
  },
  permanentButton: {
    width: '100%',
    backgroundColor: '#E74C3C',
    borderRadius: wp(3),
    paddingVertical: hp(1.6),
    marginBottom: hp(1.5),
    alignItems: 'center',
  },
  permanentText: {
    color: '#fff',
    fontSize: wp(4.2),
    fontWeight: 'bold',
  },
  reopenButton: {
    width: '100%',
    backgroundColor: '#357EBD',
    borderRadius: wp(3),
    paddingVertical: hp(1.6),
    marginBottom: hp(1.5),
    alignItems: 'center',
  },
  reopenText: {
    color: '#fff',
    fontSize: wp(4.2),
    fontWeight: 'bold',
  },
  closeModal: {
    position: 'absolute',
    right: wp(4),
    top: wp(4),
    padding: wp(1),
  },
});
