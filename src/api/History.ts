// src/api/History.ts

import axiosInstance from '../utils/axios';
import type { ClientHistoryItem, TruckHistoryItem } from './types';

export async function fetchClientHistory(): Promise<ClientHistoryItem[]> {
  const { data } = await axiosInstance.get<{ data: ClientHistoryItem[] }>(
    '/history/ride-requests'
  );
  return data.data || [];
}

export async function fetchTruckHistory(): Promise<TruckHistoryItem[]> {
  const { data } = await axiosInstance.get<{ data: TruckHistoryItem[] }>(
    '/history/ride-requests/truck'
  );
  return data.data || [];
}
