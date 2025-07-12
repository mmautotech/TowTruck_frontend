import React, { ReactNode } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { wp, hp } from '../utils/responsive';

interface ConfirmModalProps {
  visible: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title = 'Confirmation',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  children,
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <View style={styles.overlay}>
      <View style={styles.container}>
        {title ? <Text style={styles.title}>{title}</Text> : null}

        <Text style={styles.message}>{message}</Text>

        {children}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>{cancelText}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default ConfirmModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 24, 36, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    width: wp(80),
    borderRadius: wp(3.5),
    padding: wp(6),
    alignItems: 'center',
    elevation: 7,
  },
  title: {
    fontSize: wp(5.2),
    fontWeight: '700',
    color: '#357EBD',
    marginBottom: hp(1),
    textAlign: 'center',
  },
  message: {
    fontSize: wp(4.1),
    color: '#222',
    textAlign: 'center',
    marginBottom: hp(3),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: hp(1),
  },
  cancelButton: {
    flex: 1,
    marginRight: wp(2),
    backgroundColor: '#E0E0E0',
    borderRadius: wp(2),
    paddingVertical: hp(1.4),
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
    fontWeight: '600',
    fontSize: wp(4),
  },
  confirmButton: {
    flex: 1,
    marginLeft: wp(2),
    backgroundColor: '#357EBD',
    borderRadius: wp(2),
    paddingVertical: hp(1.4),
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: wp(4),
  },
});
