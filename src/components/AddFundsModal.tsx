// src/components/AddFundsModal.tsx

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { wp, hp } from '../utils/responsive';

interface AddFundsModalProps {
  visible: boolean;
  amount: string;
  setAmount: (amt: string) => void;
  proofDetails: string;
  setProofDetails: (val: string) => void;
  onTopUp: () => void;
  onClose: () => void;
  loading?: boolean;
}

const AddFundsModal: React.FC<AddFundsModalProps> = ({
  visible,
  amount,
  setAmount,
  proofDetails,
  setProofDetails,
  onTopUp,
  onClose,
  loading = false,
}) => {
  const [error, setError] = useState('');

  const numAmount = parseFloat(amount);
  const isTopUpDisabled =
    loading ||
    !proofDetails.trim() ||
    isNaN(numAmount) ||
    numAmount <= 0 ||
    numAmount > 1_000_000;

  const handleTopUp = () => {
    if (!proofDetails.trim()) {
      setError('Proof details are required.');
      return;
    }
    setError('');
    onTopUp();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Top Up Wallet</Text>

          <TextInput
            placeholder="Enter amount"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
            editable={!loading}
          />

          <TextInput
            placeholder="Proof details (e.g. Bank Ref#) or Car Reg"
            placeholderTextColor="#999"
            value={proofDetails}
            onChangeText={setProofDetails}
            style={styles.input}
            editable={!loading}
            maxLength={255}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.modalButton, isTopUpDisabled && { opacity: 0.5 }]}
            onPress={handleTopUp}
            disabled={isTopUpDisabled}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.modalButtonText}>Top Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} disabled={loading}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(5),
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '100%',
    padding: wp(5),
    borderRadius: wp(2.5),
  },
  modalTitle: {
    fontSize: wp(4.8),
    fontWeight: 'bold',
    marginBottom: hp(1.5),
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(1.5),
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    marginBottom: hp(1.2),
    fontSize: wp(3.8),
  },
  errorText: {
    color: '#e34e4e',
    fontSize: wp(3.4),
    marginBottom: hp(1),
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#357EBD',
    paddingVertical: hp(1.3),
    borderRadius: wp(1.8),
    marginBottom: hp(1.5),
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: wp(4),
  },
  cancelText: {
    textAlign: 'center',
    color: '#777',
    fontSize: wp(3.6),
  },
});

export default AddFundsModal;
