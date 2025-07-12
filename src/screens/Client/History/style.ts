// screens/Client/History/style.ts
import { StyleSheet } from 'react-native';
import { wp, hp } from '../../../utils/responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: hp(0.05),
    paddingHorizontal: hp(0.05),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },

});

export default styles;
