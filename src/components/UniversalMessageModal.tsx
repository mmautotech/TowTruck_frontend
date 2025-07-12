import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';

export type ModalType =
  | 'success'
  | 'cancel'
  | 'reopen'
  | 'info'
  | 'error'
  | 'notice'
  | 'rideReopened'
  | 'rideCancelled'
  | 'rideCompleted';

export interface UniversalMessageModalProps {
  visible: boolean;
  onClose: () => void;
  type?: ModalType;
  title?: string;
  message: string;
  reason?: string;
  actor?: string;
  buttonText?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
}

const typeColors: Record<ModalType, string> = {
  success: '#2ECC40',
  cancel: '#E74C3C',
  reopen: '#357EBD',
  info: '#357EBD',
  error: '#E74C3C',
  notice: '#357EBD',
  rideReopened: '#357EBD',
  rideCancelled: '#E74C3C',
  rideCompleted: '#2ECC40',
};

const typeTitles: Record<ModalType, string> = {
  success: 'Congratulations!',
  cancel: 'Ride Cancelled',
  reopen: 'Ride Reopened',
  info: 'Notice',
  error: 'Error',
  notice: 'Notice',
  rideReopened: 'Ride Reopened',
  rideCancelled: 'Ride Cancelled',
  rideCompleted: 'Ride Completed',
};

const UniversalMessageModal: React.FC<UniversalMessageModalProps> = ({
  visible,
  onClose,
  type = 'info',
  title,
  message,
  reason,
  actor,
  buttonText = 'OK',
  children,
  style,
}) => {
  const color = typeColors[type] || '#357EBD';
  const defaultTitle = title || typeTitles[type] || 'Notice';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.modal, style]}>
          <Text style={[styles.title, { color }]} allowFontScaling={false}>
            {defaultTitle}
          </Text>

          <Text style={styles.message} allowFontScaling={false}>
            {message}
          </Text>

          {!!reason && (
            <Text style={styles.reason} allowFontScaling={false}>
              Reason: {reason}
            </Text>
          )}

          {!!actor && (
            <Text style={styles.actor} allowFontScaling={false}>
              By: {actor}
            </Text>
          )}

          {children}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: color }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText} allowFontScaling={false}>
              {buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default UniversalMessageModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 24, 36, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 24,
    minWidth: 280,
    maxWidth: '90%',
    alignItems: 'center',
    elevation: 8,
  },
  title: {
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  reason: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 6,
  },
  actor: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 6,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
    minWidth: 100,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});
