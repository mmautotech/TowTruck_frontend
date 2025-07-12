import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';

interface LogEntry {
  action: string;
  note?: string;
  by?: string;
  at?: string | Date;
}

interface TransactionLogModalProps {
  visible: boolean;
  logs: LogEntry[];
  onClose: () => void;
}

const TransactionLogModal: React.FC<TransactionLogModalProps> = ({
  visible,
  logs,
  onClose,
}) => (
  <Modal visible={visible} transparent animationType="slide">
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.modalOverlay}
    >
      <View style={styles.logModalContainer}>
        <Text style={styles.modalTitle} allowFontScaling={false}>
          Transaction Log
        </Text>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {logs && logs.length > 0 ? (
            logs.map((logEntry, idx) => (
              <View key={idx} style={styles.logItem}>
                <Text style={styles.logAction} allowFontScaling={false}>
                  <Text style={{ fontWeight: 'bold' }}>{logEntry.action}:</Text>{' '}
                  {logEntry.note || '—'}
                </Text>
                <Text style={styles.logMeta} allowFontScaling={false}>
                  By: {logEntry.by || 'N/A'}{' '}
                  {logEntry.at
                    ? `| ${new Date(logEntry.at).toLocaleString()}`
                    : ''}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText} allowFontScaling={false}>
              No log entries.
            </Text>
          )}
        </ScrollView>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancelText} allowFontScaling={false}>Close</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logModalContainer: {
    backgroundColor: '#fff',
    width: '100%',
    maxHeight: '80%',
    padding: 20,
    borderRadius: 10,
    maxWidth: 420,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  scroll: {
    maxHeight: 300,
  },
  logItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  logAction: {
    fontSize: 15,
    marginBottom: 2,
    color: '#222',
  },
  logMeta: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginVertical: 24,
    fontStyle: 'italic',
  },
  cancelText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 15,
    marginTop: 14,
  },
});

export default TransactionLogModal;
