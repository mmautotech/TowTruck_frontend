import { StyleSheet } from 'react-native';
import { wp, hp } from '../../utils/responsive';

const AVATAR_SIZE = Math.min(wp(22), 90);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    paddingHorizontal: wp(6),
    paddingTop: hp(2.5),
    paddingBottom: hp(2),
  },

  avatarSection: {
    alignItems: 'center',
    marginBottom: hp(3),
  },

  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginBottom: hp(1),
  },

  name: {
    fontSize: wp(4.5),
    fontWeight: '600',
    color: '#333',
  },

  rating: {
    fontSize: wp(3.6),
    color: '#555',
    marginTop: hp(0.5),
    fontWeight: '500',
  },

  item: {
    fontSize: wp(4.2),
    paddingVertical: hp(1.7),
    color: '#004AAD',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  activeItem: {
    color: '#28A745',
    fontWeight: '700',
  },

  logoutContainer: {
    paddingHorizontal: wp(6),
    paddingBottom: hp(2),
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },

  logoutText: {
    color: '#D9534F',
    fontWeight: '700',
  },
});

export default styles;
