import { StyleSheet } from 'react-native';
import { wp, hp } from '../../utils/responsive';
import { spacing, typography, colors } from '../../theme';

export default StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: hp(1.5),
  },
  label: {
    fontSize: typography.body,
    marginBottom: spacing.xs,
    color: colors.muted,
  },
  input: {
    width: '100%',
    paddingVertical: hp(1),
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: spacing.sm,
    fontSize: typography.body,
    color: colors.text,
    backgroundColor: '#fff',
  },
});
