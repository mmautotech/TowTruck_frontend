// src/screens/ClientDashboardScreen/styles.ts

import { StyleSheet } from 'react-native';
import { wp, hp } from '../../../utils/responsive';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(5),
  },
  scrollForm: {
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: wp(5),
    paddingBottom: hp(6),
  },
  hintText: {
    fontSize: wp(3.2),
    color: '#666',
    marginBottom: hp(1.2),
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(2),
    padding: wp(3),
    marginBottom: hp(1.5),
    fontSize: wp(3.8),
  },
  label: {
    fontSize: wp(3.8),
    fontWeight: '600',
    color: '#444',
    marginTop: hp(1),
    marginBottom: hp(0.5),
  },
  checkboxContainer: {
    marginVertical: hp(1.5),
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: wp(4.5),
    height: wp(4.5),
    borderRadius: wp(1),
    borderWidth: 1,
    borderColor: '#444',
    marginRight: wp(3),
    backgroundColor: '#fff',
  },
  checkboxBoxChecked: {
    backgroundColor: '#357EBD',
    borderColor: '#357EBD',
  },
  checkboxLabel: {
    fontSize: wp(3.8),
    color: '#333',
  },
  submit: {
    backgroundColor: '#357EBD',
    paddingVertical: hp(1.8),
    borderRadius: wp(2),
    alignItems: 'center',
    marginTop: hp(2),
  },
  submitText: {
    color: '#fff',
    fontSize: wp(4.2),
    fontWeight: 'bold',
  },
});
