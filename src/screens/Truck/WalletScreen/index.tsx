import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styles from './styles';
import CustomHeader from '../../../components/CustomHeader';
import {
  fetchWalletBalance,
  fetchTransactionLog,
  creditWallet,
} from '../../../api/wallet';
import { WalletTransaction } from '../../../types';
import AddFundsModal from '../../../components/AddFundsModal';
import TransactionLogModal from '../../../components/TransactionLogModal';
import TransactionRow from '../../../components/TransactionRow';

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Cancelled', value: 'cancelled' }
];

const TruckWalletScreen: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('User Top up balance');
  const [proofDetails, setProofDetails] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<any[]>([]);
  const [logModalVisible, setLogModalVisible] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Fetch balance and transactions (sorted backend)
  const loadWalletData = useCallback(async () => {
    try {
      if (!refreshing) setLoading(true);
      const wallet = await fetchWalletBalance();
      const txs = await fetchTransactionLog();
      setBalance(Number(wallet.balance) || 0);
      setTransactions(Array.isArray(txs) ? txs : []);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to load wallet data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);
  
  // Refresh when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadWalletData();
    }, [loadWalletData])
  );

  // Pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadWalletData();
  }, [loadWalletData]);

  // Top-up Handler: validates proof, uploads image if needed, and sends all fields
  const handleTopUp = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid', 'Enter a valid amount');
      return;
    }

    if (!proofDetails.trim()) {
      Alert.alert('Validation', 'Proof details are required.');
      return;
    }

    try {
      setSubmitting(true);

      await creditWallet({
        amount: numAmount,
        proof_details: proofDetails.trim(),
        remarks: 'User funds top up request',
      });

      Alert.alert('Pending', 'Your top-up request has been submitted and waiting for approval.');
      setModalVisible(false);
      setAmount('');
      setProofDetails('');
      loadWalletData();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || err?.message || 'Top-up failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter using backend status
  const filterByTab = (tabValue: string) => {
    if (tabValue === 'all') return transactions;
    return transactions.filter((t) => t.status === tabValue);
  };

  const filteredTransactions = filterByTab(activeTab);

  return (
    <View style={styles.container}>
      <CustomHeader title="Wallet" showMenuButton />
      {loading ? (
        <ActivityIndicator size="large" color="#357EBD" style={styles.loader} />
      ) : (
        <>
          <View style={styles.scrollContainer}>
            <Text style={styles.balanceLabel}> Balance</Text>
            <Text style={styles.balanceValue}>
              £ {typeof balance === 'number' && !isNaN(balance) ? balance.toFixed(2) : '0.00'}
            </Text>

            <AddFundsModal
              visible={modalVisible}
              amount={amount}
              setAmount={setAmount}
              proofDetails={proofDetails}
              setProofDetails={setProofDetails}
              onTopUp={handleTopUp}
              onClose={() => setModalVisible(false)}
              loading={submitting}
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addButtonText}>Add Funds</Text>
            </TouchableOpacity>

            <Text style={styles.transactionHeading}>Transactions</Text>
            <View style={styles.tabRow}>
              {TABS.map((tab) => (
                <TouchableOpacity
                  key={tab.value}
                  style={styles.tabItem}
                  onPress={() => setActiveTab(tab.value)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab.value && styles.tabTextActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                  {activeTab === tab.value && <View style={styles.activeUnderline} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <FlatList
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
            data={filteredTransactions}
            keyExtractor={(item, idx) => (item._id ? item._id : idx.toString())}
            renderItem={({ item, index }) => (
              <TransactionRow
                tx={item}
                onPress={() => {
                  if (Array.isArray(item.log) && item.log.length) {
                    setSelectedLog(item.log);
                    setLogModalVisible(true);
                  }
                }}
                balance={balance}
                index={index}
                filteredTransactions={filteredTransactions}
                activeTab={activeTab}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#357EBD']}
              />
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>No transactions found.</Text>
            }
          />

          <TransactionLogModal
            visible={logModalVisible}
            logs={selectedLog}
            onClose={() => setLogModalVisible(false)}
          />
        </>
      )}
    </View>
  );
};

export default TruckWalletScreen;
