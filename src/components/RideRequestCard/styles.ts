import { StyleSheet } from 'react-native';
import { wp, hp } from '../../utils/responsive';

const themeColor = '#357EBD';
const backColor = '#fff';
const shadowColor = '#000';

export default StyleSheet.create({
  card: {
    backgroundColor: backColor,
    // shadow for iOS
    shadowColor: shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    // elevation for Android
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2),
    marginHorizontal: wp(0.5),
    elevation: 10,
    position: 'relative',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  pickupDate: {
    fontSize: wp(3.5),
    color: themeColor,
    fontWeight: '600',

  },
  updatedAt: {
    fontSize: wp(3.5),
    color: '#777',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  avatar: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(4.5),
    marginRight: wp(3),
    backgroundColor: '#EEE',
  },
  titleBlock: {
    flex: 1,
  },
  username: {
    fontSize: wp(4),
    fontWeight: '500',
    color: '#222',
  },
  miles: {
    fontSize: wp(3.5),
    color: themeColor,
    fontWeight: '600',
  },
  makeModel: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: themeColor,
  },
  year: {
    fontSize: wp(3.5),
    color: themeColor,
    fontWeight: '400',
  },
  arrow: {
    position: 'absolute',
    right: wp(3),
    top: '50%',
    transform: [{ translateY: -wp(3.5) }],
    zIndex: 2,
    fontSize: wp(10),
    color: themeColor,
  },
  geoText: {
    fontSize: wp(3.6),
    marginBottom: hp(0.5),
    color: '#222',
    marginTop: hp(0.5),
  },
  addressText: {
    fontStyle: 'italic',
    color: '#333',
  },
  metaText: {
    fontSize: wp(3.3),
    color: '#666',
  },
  offerSummary: {
    marginTop: hp(1.5),
    paddingTop: hp(1),
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  offerText: {
    fontSize: wp(3.8),
    color: '#222',
    marginBottom: hp(0.5),
  },
  offerValue: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#357EBD',
  },
  counterText: {
    fontSize: wp(3.8),
    marginTop: 4,
    color: '#FF5722', // orange highlight
    fontWeight: '500',
  },
  address: {
    fontStyle: 'italic',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: hp(1),
  },
});
