import { StyleSheet } from 'react-native';
import { wp, hp } from '../../../utils/responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    padding: wp(5),
    paddingBottom: hp(6),
  },
  label: {
    fontSize: wp(3.8),
    fontWeight: '600',
    color: '#444',
    marginTop: hp(2),
    marginBottom: hp(0.8),
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(2),
    overflow: 'hidden',
    marginBottom: hp(2),
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(2),
    padding: wp(3.5),
    fontSize: wp(3.8),
    color: '#000',
    marginBottom: hp(3),
  },
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  footerButton: {
    backgroundColor: '#357EBD',
    paddingVertical: hp(1.8),
    borderRadius: wp(2),
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#fff',
    fontSize: wp(4.5),
    fontWeight: 'bold',
  },
  readOnlyField: {
    backgroundColor: '#F4F4F4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  // ➕ Password validation styles
  passwordHintContainer: {
    marginBottom: hp(2.5),
  },
  passwordHint: {
    fontSize: wp(3.5),
    marginBottom: hp(0.8),
  },
  valid: {
    color: 'green',
  },
  invalid: {
    color: 'red',
  },
});

export default styles;
