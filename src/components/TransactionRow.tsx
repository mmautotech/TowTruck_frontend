import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { WalletTransaction } from '../types';

interface TransactionRowProps {
  tx: WalletTransaction;
  onPress: () => void;
  balance: number;
  index: number;
  filteredTransactions: WalletTransaction[];
  activeTab: string;
}

const TransactionRow: React.FC<TransactionRowProps> = ({
  tx,
  onPress,
  balance,
}) => {
  const isCredit = tx.type === 'credit';
  const arrow = isCredit ? '↑' : '↓';
  const arrowColor = isCredit ? '#25b358' : '#e34e4e';

  let statusText = '';
  let statusColor = '';
  switch (tx.status) {
    case 'pending':
      statusText = 'Pending';
      statusColor = '#FFC107';
      break;
    case 'confirmed':
      statusText = 'Confirmed';
      statusColor = '#25b358';
      break;
    case 'cancelled':
      statusText = 'Cancelled';
      statusColor = '#e34e4e';
      break;
    default:
      statusText = tx.status || '—';
      statusColor = '#777';
  }

  const proofOrRemarks = tx.proof_details || tx.remarks || '—';
  const amountText = `${isCredit ? '+' : '-'}£${Number(tx.amount ?? 0).toFixed(2)}`;

  let balanceCol = '';
  if (tx.status === 'pending') {
    balanceCol = 'waiting';
  } else if (tx.status === 'confirmed') {
    balanceCol = tx.balanceAfter !== undefined ? Number(tx.balanceAfter).toFixed(2) : '';
  } else if (tx.status === 'cancelled') {
    balanceCol = '--';
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={styles.transactionRow}
    >
      <Text style={[styles.arrow, { color: arrowColor }]} allowFontScaling={false}>
        {arrow}
      </Text>

      <View style={styles.txMain}>
        <Text style={styles.proofDetails} numberOfLines={1} allowFontScaling={false}>
          {proofOrRemarks}
        </Text>
        <View style={[styles.statusBox, { backgroundColor: statusColor + '22' }]}>
          <Text style={{ color: statusColor, fontWeight: 'bold', fontSize: 12 }} allowFontScaling={false}>
            {statusText}
          </Text>
        </View>
      </View>

      <Text style={[styles.amount, { color: arrowColor }]} allowFontScaling={false}>
        {amountText}
      </Text>

      <Text style={styles.balanceCol} allowFontScaling={false}>
        {balanceCol}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 6,
    marginBottom: 2,
    backgroundColor: '#fff',
  },
  arrow: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
    width: 24,
    textAlign: 'center',
  },
  txMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
  },
  proofDetails: {
    flex: 1,
    fontSize: 15,
    color: '#222',
  },
  statusBox: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6,
    alignItems: 'center',
    minWidth: 68,
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 16,
    minWidth: 75,
    textAlign: 'right',
  },
  balanceCol: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    minWidth: 60,
    textAlign: 'right',
    marginLeft: 6,
  },
});

export default TransactionRow;
