// src/screens/Truck/Dashboard/style.ts
import { StyleSheet } from 'react-native';
import { wp, hp } from '../../../utils/responsive';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* ========== toggle row ========== */
    toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2),
    marginHorizontal: wp(4),
    backgroundColor: '#fff',
    borderRadius: wp(2),
    overflow: 'hidden',
    elevation: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: hp(1.2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: wp(3.5),
    color: '#666',
  },
  activeToggleButton: {
    backgroundColor: '#357EBD',
  },
  activeToggleText: {
    color: '#fff',
    fontWeight: '600',
  },

  /* ========== list ========== */
  listContent: {
    padding: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(4),
  },
  /* ========== loading / empty states ========== */
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(4),
  },
  loadingContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(4),
  },
  loadingText: {
    fontSize: wp(4.5),
    color: '#444',
    textAlign: 'center',
    fontWeight: '500',
  },
    center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
