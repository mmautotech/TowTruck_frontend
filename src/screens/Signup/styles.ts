// src/screens/Signup/styles.ts

import { StyleSheet } from 'react-native';
import { wp, hp } from '../../utils/responsive';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: wp(5),
    paddingTop: hp(4),
    alignItems: 'center',
  },
  heading: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: '#357EBD',
    marginBottom: hp(2),
  },
  passwordHint: {
    alignSelf: 'flex-start',
    marginLeft: wp(2),
    fontSize: wp(3.2),
    marginTop: hp(0.5),
  },
  valid: {
    color: 'green',
  },
  invalid: {
    color: 'red',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginVertical: hp(1.2),
    marginLeft: wp(1),
  },
  rememberText: {
    fontSize: wp(3.5),
    color: '#333',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: hp(2),
    marginTop: hp(1.5),
  },
  toggleOption: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(5),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(2),
    marginHorizontal: wp(1.5),
  },
  toggleSelected: {
    backgroundColor: '#357EBD',
    borderColor: '#357EBD',
  },
  toggleSelectedText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp(3.8),
  },
  toggleUnselectedText: {
    color: '#808080',
    fontWeight: '600',
    fontSize: wp(3.8),
  },

  
});

export default styles;
