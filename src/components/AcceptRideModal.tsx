// src/components/AcceptRideModal.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { wp, hp } from '../utils/responsive';

interface AcceptRideModalProps {
  visible: boolean;
  clientName: string;
  fromAddress: string;
  toAddress: string;
  offerPrice: string;
  onOk: () => void;
}

const AcceptRideModal: React.FC<AcceptRideModalProps> = ({
  visible,
  clientName,
  fromAddress,
  toAddress,
  offerPrice,
  onOk,
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.header}>Offer Accepted</Text>
        <Text style={styles.subHeader}>
          Your offer for <Text style={styles.bold}>{clientName}</Text>
        </Text>

        <View style={styles.row}>
          <MaterialCommunityIcons name="map-marker" size={wp(4.5)} color="#E74C3C" />
          <Text style={styles.addressLabel}>From:</Text>
          <Text style={styles.address}>{fromAddress || 'Loading...'}</Text>
        </View>
        <View style={styles.row}>
          <FontAwesome5 name="location-arrow" size={wp(4)} color="#2980B9" style={{ marginRight: wp(1) }} />
          <Text style={styles.addressLabel}>To:</Text>
          <Text style={styles.address}>{toAddress || 'Loading...'}</Text>
        </View>
        <View style={[styles.row, { marginTop: hp(1.2) }]}>
          <MaterialCommunityIcons name="cash-multiple" size={wp(4.5)} color="#27AE60" />
          <Text style={styles.priceLabel}>Offer Price :</Text>
          <Text style={styles.price}>£ {offerPrice}</Text>
        </View>

        <TouchableOpacity style={styles.okButton} onPress={onOk}>
          <Text style={styles.okButtonText}>View Service</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#0007',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: wp(6),
    paddingHorizontal: wp(6),
    paddingVertical: hp(3),
    alignItems: 'center',
    minWidth: wp(78),
    elevation: 8,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.13,
    shadowRadius: 6,
  },
  header: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#357EBD',
    marginBottom: hp(1),
  },
  subHeader: {
    fontSize: wp(3.7),
    fontWeight: '600',
    color: '#222',
    marginBottom: hp(2),
    textAlign: 'center',
  },
  bold: { fontWeight: 'bold', color: '#004AAD' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.8),
    width: '100%',
  },
  addressLabel: {
    fontWeight: '600',
    marginLeft: wp(1.5),
    marginRight: wp(1),
    fontSize: wp(3.3),
    color: '#555',
    minWidth: wp(10),
  },
  address: {
    fontSize: wp(3.5),
    color: '#222',
    flexShrink: 1,
    flex: 1,
    marginLeft: wp(1),
  },
  priceLabel: {
    fontWeight: '600',
    marginLeft: wp(1.5),
    color: '#555',
    fontSize: wp(3.8),
  },
  price: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: wp(3.8),
    marginLeft: wp(1.5),
  },
  okButton: {
    backgroundColor: '#357EBD',
    borderRadius: wp(4),
    marginTop: hp(2.5),
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(10),
    alignSelf: 'center',
    elevation: 2,
  },
  okButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp(4),
    letterSpacing: 0.2,
  },
});

export default AcceptRideModal;
