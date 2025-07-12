import { StyleSheet } from 'react-native';
import { wp, hp } from '../../../utils/responsive';

const styles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 8,
    color: '#357EBD',
  },
  // ← Add this block:
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
    color: '#357EBD',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
    color: '#333',
  },
  footerNote: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 24,
    color: '#666',
  },
});

export default styles;
