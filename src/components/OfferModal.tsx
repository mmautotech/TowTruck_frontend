import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import PriceInputFields from './PriceInputFields';
import TimeInputFields from './TimeInputFields';
import { wp, hp } from '../utils/responsive';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  isValid: boolean;
  price: string;
  onChangePrice: (v: string) => void;
  showTimeInputs: boolean;
  days?: string;
  hours?: string;
  minutes?: string;
  onChangeDays?: (v: string) => void;
  onChangeHours?: (v: string) => void;
  onChangeMinutes?: (v: string) => void;
  title: string;
};

const OfferModal: React.FC<Props> = ({
  isVisible,
  onClose,
  onSubmit,
  isLoading,
  isValid,
  price,
  onChangePrice,
  showTimeInputs,
  days = '',
  hours = '',
  minutes = '',
  onChangeDays = () => {},
  onChangeHours = () => {},
  onChangeMinutes = () => {},
  title,
}) => (
  <Modal isVisible={isVisible} onBackdropPress={onClose}>
    <View style={styles.box}>
      <Text style={styles.title} allowFontScaling={false}>
        {title}
      </Text>

      <PriceInputFields price={price} onChange={onChangePrice} />

      {showTimeInputs && (
        <TimeInputFields
          days={days}
          hours={hours}
          minutes={minutes}
          onChangeDays={onChangeDays}
          onChangeHours={onChangeHours}
          onChangeMinutes={onChangeMinutes}
        />
      )}

      {isLoading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#357EBD" />
          <Text style={styles.loadingText} allowFontScaling={false}>
            Submitting...
          </Text>
        </View>
      )}

      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={onClose}
          disabled={isLoading}
          style={styles.cancelBtn}
        >
          <Text style={styles.cancelText} allowFontScaling={false}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSubmit}
          disabled={!isValid || isLoading}
          style={[
            styles.submitBtn,
            (!isValid || isLoading) && { opacity: 0.6 },
          ]}
        >
          <Text style={styles.submitText} allowFontScaling={false}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#fff',
    borderRadius: wp(3),
    padding: wp(5),
    elevation: Platform.OS === 'android' ? 5 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  title: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    marginBottom: hp(2),
    color: '#357EBD',
    textAlign: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(1),
    gap: wp(2), // modern RN
    // or fallback if `gap` isn't reliable:
    marginLeft: wp(1.5),
    ...Platform.select({
      android: {
        marginLeft: wp(1),
      },
    }),
  },
  loadingText: {
    fontSize: wp(3.8),
    color: '#357EBD',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2.5),
  },
  cancelBtn: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
  },
  cancelText: {
    color: '#999',
    fontSize: wp(4),
  },
  submitBtn: {
    backgroundColor: '#357EBD',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: wp(2),
  },
  submitText: {
    color: '#fff',
    fontSize: wp(4),
    fontWeight: 'bold',
  },
});

export default OfferModal;
