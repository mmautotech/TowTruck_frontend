import { StyleSheet } from 'react-native';
import { wp, hp } from '../../../../utils/responsive'; // if you are using percentage-based utils

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: hp(2),
    fontSize: wp(4),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestDetailsCompact: {
    borderRadius: wp(2),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    marginBottom: hp(1.2),
    borderBottomColor:"#000",
    alignItems: 'center',
  },
  requestHeader: {
    fontSize: wp(3.5),
    color: '#666',
  },
  compactLine: {
    fontSize: wp(4),
    marginVertical: hp(0.3),
    textAlign: 'center',
  },
  labelGray: {
    color: '#666',
    fontSize: wp(3.5),
  },
  valueTheme: {
    color: '#357EBD',
    fontWeight: 'bold',
    fontSize: wp(3.6),
  },
  listContent: {
    paddingBottom: hp(1.5),
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(10),
  },
  emptyText: {
    fontSize: wp(4.5),
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#357EBD',
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
    alignItems: 'center',
    marginVertical: hp(1.5),
    marginHorizontal: wp(5),
  },
  cancelText: {
    color: '#357EBD',
    fontSize: wp(4.5),
    fontWeight: '600',
  },
});

export default styles;
