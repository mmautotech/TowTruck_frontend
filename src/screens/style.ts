import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
import { wp, hp } from '../utils/responsive';

const PRIMARY_BLUE = '#357EBD';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
    scrollContent: {
    padding: wp(5),
    paddingBottom: hp(4),
  },
  headingContainer: {
    marginTop: 100,
    marginBottom: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PRIMARY_BLUE,
  },
  subHeading: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  formContainer: {
    paddingVertical: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  phoneNumberContainer: {
    marginBottom: 16,
  },
  passwordContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#F9F9F9',
  },
  passwordInput: {
    paddingRight: 60,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 12,
  },
  eyeText: {
    color: PRIMARY_BLUE,
    fontWeight: '600',
  },
  buttonContainer: {
    marginVertical: 20,
  },
  button: {
    backgroundColor: PRIMARY_BLUE,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    textAlign: 'center',
    color: PRIMARY_BLUE,
    fontSize: 15,
    marginBottom: 20,
    fontWeight: '500',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  footerText: {
    color: '#333',
    fontSize: width * 0.04,
  },
  footerLink: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: width * 0.04,
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
  passwordHintContainer: {
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  passwordHint: {
    fontSize: 13,
    marginBottom: 4,
  },
  valid: {
    color: 'green',
  },
  invalid: {
    color: 'red',
  },
  messageText: {
    fontSize: width * 0.045,
    color: 'green',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default styles;
