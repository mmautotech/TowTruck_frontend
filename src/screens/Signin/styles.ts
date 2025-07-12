// src/screens/Signin/styles.ts
import { StyleSheet } from 'react-native';
import { wp, hp } from '../../utils/responsive';
import { COLORS, FONT_SIZE, FONT_WEIGHT, SPACING, BORDERS } from '../../utils/style';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  heading: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.primary,
    opacity: 0.8,
    marginBottom: hp(4),
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  logo: {
    width: wp(40),
    height: wp(40),
    marginBottom: hp(4),
    alignSelf: 'center',
  },
  input: {
    width: '100%',
    height: hp(6.5),
    backgroundColor: COLORS.white,
    borderRadius: BORDERS.radius,
    borderWidth: BORDERS.borderWidth,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZE.md,
    marginBottom: hp(2),
    color: COLORS.text,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(6.5),
    backgroundColor: COLORS.white,
    borderRadius: BORDERS.radius,
    borderWidth: BORDERS.borderWidth,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    marginBottom: hp(2),
  },
  passwordInput: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  showText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semiBold,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: hp(2),
  },
  checkboxText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  button: {
    width: '100%',
    height: hp(6.5),
    backgroundColor: COLORS.primary,
    borderRadius: BORDERS.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2.5),
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    marginBottom: hp(3),
    alignSelf: 'flex-end',
  },
  signupContainer: {
    flexDirection: 'row',
    marginBottom: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: FONT_SIZE.md,
    color: '#444',
  },
  signupLink: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.semiBold,
    marginLeft: SPACING.xs,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: hp(2.4),
  },
  rememberText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
});

export default styles;
