import { StyleSheet } from 'react-native';
import { wp, hp } from '../../../utils/responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loaderContainer: {
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  formContainer: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(5),
  },
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#357EBD',
    paddingVertical: hp(1.8),
    borderRadius: wp(2),
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: wp(4.5),
    fontWeight: 'bold',
  },

});

export default styles;
