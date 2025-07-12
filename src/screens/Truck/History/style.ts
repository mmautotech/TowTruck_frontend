import { StyleSheet } from 'react-native';
import { wp, hp } from '../../../utils/responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
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
  statusText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },

});

export default styles;
