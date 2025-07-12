import { StyleSheet } from 'react-native';
import { wp, hp } from '../../utils/responsive';

const PRIMARY = '#357EBD';
const LINK = '#007FFF';
const BORDER = '#ccc';
const SUCCESS = 'green';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  heading: {
    fontSize: wp(8),
    fontWeight: '500' as const,
    color: PRIMARY,
    opacity: 0.8,
    marginBottom: hp(5),
    marginTop: hp(6),
    textAlign: 'center',
  },

  formContainer: {
    marginTop: hp(4),
    marginHorizontal: wp(6),
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  phoneNumberContainer: {
    width: '90%',
    height: hp(6),
    marginBottom: hp(2),
  },

  input: {
    width: '100%',
    height: hp(6),
    fontSize: wp(4),
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: wp(1.3),
    marginBottom: hp(2),
    paddingHorizontal: wp(3),
    backgroundColor: '#fff',
    color: '#222',
  },

  passwordContainer: {
    width: '90%',
    height: hp(6),
    position: 'relative',
    marginBottom: hp(2),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: wp(1.3),
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: wp(3),
  },

  passwordInput: {
    flex: 1,
    fontSize: wp(4),
    color: '#222',
  },

  eyeButton: {
    position: 'absolute',
    right: wp(3),
    top: (hp(6) - hp(2.5)) / 2,
    height: hp(2.5),
    width: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },

  eyeText: {
    fontSize: wp(4),
    color: PRIMARY,
  },

  buttonContainer: {
    marginVertical: hp(2),
    width: '90%',
    alignItems: 'center',
  },

  button: {
    height: hp(5.8),
    width: '100%',
    backgroundColor: LINK,
    borderRadius: wp(1.7),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
  },

  buttonText: {
    color: '#fff',
    fontSize: wp(5),
    fontWeight: '700' as const,
    textAlign: 'center',
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(2),
  },

  signupText: {
    color: '#333',
    fontSize: wp(4),
  },

  signupLink: {
    color: LINK,
    textDecorationLine: 'underline',
    fontSize: wp(4),
    fontWeight: '600' as const,
    marginLeft: wp(1),
  },

  messageContainer: {
    marginTop: hp(2),
    width: '90%',
    alignItems: 'center',
  },

  messageText: {
    fontSize: wp(4.2),
    color: SUCCESS,
    textAlign: 'center',
  },

  passwordHintContainer: {
    marginTop: hp(1.2),
    marginBottom: hp(2),
    alignSelf: 'flex-start',
  },

  passwordHint: {
    fontSize: wp(3.8),
    marginVertical: hp(0.3),
  },
  valid: { color: SUCCESS },
  invalid: { color: 'red' },
});

export default styles;
