// src/components/ClientDrawerContent/styles.ts
import { StyleSheet } from 'react-native';
import { wp, hp } from '../../utils/responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: wp(6),
    paddingTop: hp(3),
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: hp(3),
  },
  avatar: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    marginBottom: hp(1),
  },
  name: {
    fontSize: wp(4.5),
    fontWeight: '600',
    color: '#333',
  },
  rating: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    marginBottom: 4,
    fontWeight: '500',
  },
  item: {
    fontSize: wp(4.2),
    paddingVertical: hp(1.8),
    color: '#004AAD',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  activeItem: {
    color: '#28A745', // Bootstrap success green
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: hp(2),
  },
  logoutText: {
    color: '#D9534F',
    fontWeight: 'bold',
  },
});

export default styles;
