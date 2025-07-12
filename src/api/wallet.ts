import axiosInstance from '../utils/axios';
import { WalletTransaction } from '../types';

export interface WalletResponse {
  balance: number;
  currency: string;
}

/**
 * Fetch the current wallet balance
 */
export const fetchWalletBalance = async (): Promise<WalletResponse> => {
  const response = await axiosInstance.get('/wallet/balance');
  return response.data;
};

/**
 * Fetch the full wallet transaction log
 */
export const fetchTransactionLog = async (): Promise<WalletTransaction[]> => {
  const response = await axiosInstance.get('/wallet/transactions');
  return response.data.transactions;
};

/**
 * Top-up the wallet with a specified amount
 * @param amount Amount in number (e.g. 100)
 */
export interface CreditWalletPayload {
  amount: number;
  proof_details?: string;
  remarks: string;
}

export const creditWallet = async (payload: CreditWalletPayload): Promise<any> => {
  const response = await axiosInstance.post('/wallet/credit', payload);
  return response.data;
};

/**
 * Debit (withdraw) from the wallet with a specified amount (Client only)
 * @param amount Amount in number (e.g. 50)
 * @param remarks Optional remarks string
 */
export const debitWallet = async (amount: number, remarks?: string): Promise<any> => {
  const response = await axiosInstance.post('/wallet/debit', { amount, remarks });
  return response.data;
};
