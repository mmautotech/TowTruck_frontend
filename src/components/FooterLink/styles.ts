import { StyleSheet } from 'react-native';
import { typography, colors, spacing } from '../../theme';
import { hp } from '../../utils/responsive';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp(2),
  },
  prompt: {
    fontSize: typography.body,
    color: colors.muted,
  },
  link: {
    fontSize: typography.body,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
});
