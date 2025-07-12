// components/ServiceModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { wp, hp } from '../utils/responsive';

interface ServiceModalProps {
  visible: boolean;
  loading: boolean;
  clientName?: string;
  originAddress?: string;
  destinationAddress?: string;
  price?: number;
  onClose: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  visible,
  loading,
  clientName = '',
  originAddress = '',
  destinationAddress = '',
  price = 0,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerText} allowFontScaling={false}>
              Offer Accepted
            </Text>
          </View>

          <View style={styles.body}>
            {loading ? (
              <>
                <ActivityIndicator size="large" color="#357EBD" />
                <Text style={styles.loadingText} allowFontScaling={false}>
                  Loading address...
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.offerTitle} allowFontScaling={false}>
                  Your offer for {clientName}
                </Text>

                <Text style={styles.centerText} allowFontScaling={false}>
                  📍 From: {originAddress}
                </Text>
                <Text style={styles.centerText} allowFontScaling={false}>
                  📍 To: {destinationAddress}
                </Text>
                <Text style={styles.centerText} allowFontScaling={false}>
                  💷 Offer Price : £ {price.toFixed(2)}
                </Text>

                <Pressable style={styles.button} onPress={onClose}>
                  <Text style={styles.buttonText} allowFontScaling={false}>
                    View Service
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ServiceModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: wp(85),
    backgroundColor: '#fff',
    borderRadius: wp(4),
    overflow: 'hidden',
    ...Platform.select({
      android: { elevation: 5 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
    }),
  },
  header: {
    backgroundColor: '#357EBD',
    paddingVertical: hp(1.5),
    alignItems: 'center',
    borderTopLeftRadius: wp(4),
    borderTopRightRadius: wp(4),
  },
  headerText: {
    color: '#fff',
    fontSize: wp(4.5),
    fontWeight: '700',
  },
  body: {
    padding: wp(5),
    alignItems: 'center',
  },
  offerTitle: {
    fontWeight: '600',
    fontSize: wp(4),
    marginBottom: hp(1.5),
    textAlign: 'center',
  },
  centerText: {
    textAlign: 'center',
    fontSize: wp(3.8),
    color: '#444',
    marginBottom: hp(0.5),
  },
  button: {
    marginTop: hp(2),
    backgroundColor: '#357EBD',
    paddingVertical: hp(1.3),
    paddingHorizontal: wp(10),
    borderRadius: wp(10),
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp(4),
  },
  loadingText: {
    marginTop: hp(1),
    fontSize: wp(4),
    color: '#333',
  },
});
