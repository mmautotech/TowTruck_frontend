// styles.ts
import { StyleSheet } from 'react-native';
import { wp, hp } from '../../../../utils/responsive'; // Adjust import path if needed

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#357EBD',
    borderTopLeftRadius: wp(4.3),
    borderTopRightRadius: wp(4.3),
    paddingHorizontal: wp(4.3),
    alignItems: 'center',
    overflow: 'hidden',
  },
  chevron: {
    marginTop: hp(1),
    marginBottom: hp(0.5),
    alignSelf: 'center',
  },
  headline: {
    fontSize: wp(4.8), // ~18/375*100
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: hp(1),
  },
  avatar: {
    width: wp(21.3),   // ~80/375*100
    height: wp(21.3),
    borderRadius: wp(10.6),
    marginBottom: hp(1.2),
  },
  name: {
    fontSize: wp(5.3), // ~20/375*100
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: hp(0.7),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  rides: {
    color: '#fff',
    marginLeft: wp(1.6),
    fontSize: wp(3.7),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(0.7),
  },
  infoText: {
    color: '#fff',
    fontSize: wp(4.3),
    marginHorizontal: wp(1.6),
  },
  // Button Row
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1.7),
    marginBottom: hp(1),
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#E74C3C',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(6.4),
    paddingVertical: hp(1.6),
    marginRight: wp(2),
  },
  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp(4.3),
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#00C853',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(6.4),
    paddingVertical: hp(1.6),
    marginLeft: wp(2),
    position: 'relative',
  },
  messageIcon: {
    marginRight: wp(1.9),
    alignSelf: 'center',
  },
  messageText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp(4.3),
    marginRight: wp(1.6),
  },
  unreadBadge: {
    marginLeft: wp(2.1),
    backgroundColor: '#FF3B30',
    borderRadius: wp(2.7),
    minWidth: wp(5.3),
    paddingHorizontal: wp(1.6),
    paddingVertical: hp(0.25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: wp(3.2),
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.32)',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
    padding: wp(7.5),
    backgroundColor: '#fff',
    borderTopLeftRadius: wp(5.3),
    borderTopRightRadius: wp(5.3),
    alignItems: 'center',
    shadowColor: '#333',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 12,
    elevation: 24,
  },
  modalTitle: {
    fontSize: wp(5.6),
    fontWeight: 'bold',
    marginBottom: hp(0.7),
    color: '#357EBD',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: wp(4.3),
    color: '#555',
    marginBottom: hp(2.2),
    textAlign: 'center',
  },
  modalPermanentButton: {
    width: '100%',
    backgroundColor: '#E74C3C',
    borderRadius: wp(3.2),
    paddingVertical: hp(1.5),
    marginBottom: hp(1.5),
    alignItems: 'center',
  },
  modalPermanentText: {
    color: '#fff',
    fontSize: wp(4.5),
    fontWeight: 'bold',
  },
  modalReopenButton: {
    width: '100%',
    backgroundColor: '#357EBD',
    borderRadius: wp(3.2),
    paddingVertical: hp(1.5),
    marginBottom: hp(1.5),
    alignItems: 'center',
  },
  modalReopenText: {
    color: '#fff',
    fontSize: wp(4.5),
    fontWeight: 'bold',
  },
  modalClose: {
    position: 'absolute',
    right: wp(3.7),
    top: wp(3.7),
    padding: wp(1.6),
  },
});
