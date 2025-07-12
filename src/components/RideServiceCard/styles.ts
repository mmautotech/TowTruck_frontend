import { StyleSheet } from 'react-native';
import { wp, hp } from '../../utils/responsive'; // adjust the path based on your project structure

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: wp(3),
    marginVertical: hp(1),
    marginHorizontal: wp(4),
    padding: wp(4),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  upperContainer:{ flex: 1 },
  driverRow: {
    flexDirection: 'row',
    marginBottom: hp(1),
  },
  avatar: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    marginRight: wp(3),
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  truckName: {
    fontSize: wp(4.2),
    fontWeight: '600',
    color: '#333',
  },
  distanceText: {
    fontSize: wp(3.8),
    color: '#777',
  },
  rating: {
    fontSize: wp(3.8),
    color: '#444',
    marginTop: hp(0.3),
  },
  meta: {
    fontSize: wp(3.8),
    color: '#777',
    marginTop: hp(0.5),
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: hp(1),
  },
  offerLabel: {
    fontSize: wp(3.8),
    color: '#777',
  },
  offerValue: {
    marginTop: hp(0.5),
    fontSize: wp(4),
    fontWeight: '900',
    color: '#357EBD',
  },
  counterBadge: {
    marginTop: hp(0.5),
    fontSize: wp(4),
    fontWeight: '900',
    color: '#FFA555', 
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2),
  },
  buttonView:{
    alignItems: 'center', marginTop: hp(2) 
  },
  acceptBtn: {
    backgroundColor: '#357EBD',
    paddingVertical: hp(1.3),
    paddingHorizontal: wp(15),
    borderRadius: wp(2),
  },
  acceptText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp(4),
  },
  counterText: {
    fontSize: 14,
    color: '#E91E63',
    marginTop: 4,
  },
});

export default styles;
