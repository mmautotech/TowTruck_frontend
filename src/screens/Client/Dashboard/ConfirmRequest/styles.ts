import { StyleSheet } from 'react-native';
import { wp, hp } from '../../../../utils/responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  scrollContent: {
    padding: wp(5),
    paddingBottom: hp(4),
  },
  detailContainer: {
    backgroundColor: '#fff',
    padding: wp(4),
    borderRadius: wp(2),
    marginBottom: hp(2),
    elevation: 2,
  },
  label: {
    fontSize: wp(3.8),
    fontWeight: '600',
    color: '#357EBD',
    marginBottom: hp(0.5),
  },
  value: {
    fontSize: wp(3.8),
    color: '#222',
  },
  confirmButton: {
    backgroundColor: '#357EBD',
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
    alignItems: 'center',
    marginVertical: hp(1.5),
    marginHorizontal: wp(5),
  },
  confirmText: {
    color: '#fff',
    fontSize: wp(4.2),
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#357EBD',
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
    alignItems: 'center',
    marginVertical: hp(1.5),
    marginHorizontal: wp(5),
  },
  FooterContainer:{
    backgroundColor: '#fff',
  },
  cancelText: {
    color: '#222',
    fontSize: wp(4.1),
    fontWeight: '600',
  },
});

export default styles;
