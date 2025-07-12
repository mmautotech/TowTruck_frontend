import { StyleSheet } from 'react-native';
import { wp, hp } from '../../utils/responsive';
import { colors, spacing, typography } from '../../theme';

export default StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: hp(1.5),
    backgroundColor: colors.primary,
    borderRadius: spacing.sm,
    alignItems: 'center',
    marginVertical: hp(1),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    color: '#fff',
    fontSize: typography.body,
    fontWeight: 'bold',
  },
});
