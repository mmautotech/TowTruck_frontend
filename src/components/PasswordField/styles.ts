import { StyleSheet } from 'react-native';
import { spacing, typography, colors } from '../../theme';
import { wp, hp } from '../../utils/responsive';

export default StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: hp(1.5),
  },
  eyeButton: {
    position: 'absolute',
    right: spacing.md,
    top: hp(2.5),
  },
  eyeText: {
    fontSize: typography.small,
    color: colors.primary,
  },
});
