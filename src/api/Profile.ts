import axiosInstance from '../utils/axios';
import { getItem } from '../utils/asyncStorage';
import type { ClientProfile, DriverProfile, VehicleProfile } from './types';

export const fetchProfileStatus = async () => {
  const response = await axiosInstance.get('/profile/profile_status');
  return response.data;
};

const DEV_API = process.env.EXPO_PUBLIC_API_URL_DEV ?? 'http://192.168.18.69:5000/api';
const PROD_API = process.env.EXPO_PUBLIC_API_URL_PROD ?? 'http://192.168.18.69:5000/api';

const BASE_URL = __DEV__ ? DEV_API : PROD_API;

/** Fetch authenticated client's profile */
export async function getClientProfile(): Promise<ClientProfile> {
  const { data } = await axiosInstance.get<{ data: ClientProfile }>('/profile');
  return data.data;
}

/** Update client's profile using FormData (uses fetch for RN compatibility) */
export async function updateClientProfile(payload: FormData): Promise<ClientProfile> {
  const token = await getItem('user_token');
  const response = await fetch(`${BASE_URL}/profile`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: payload,
  });

  if (!response.ok) {
    let err = {};
    try { err = await response.json(); } catch { }
    throw new Error((err as any).message || 'Failed to update profile');
  }
  const data = await response.json();
  return data.data;
}

/** Fetch authenticated truck driver's profile */
export async function getDriverProfile(): Promise<DriverProfile> {
  const { data } = await axiosInstance.get<{ data: DriverProfile }>('/profile/driver');
  return data.data;
}

/** Update truck driver's profile using FormData (now uses POST!) */
export async function updateDriverProfile(form: FormData): Promise<DriverProfile> {
  const token = await getItem('user_token');
  const response = await fetch(`${BASE_URL}/profile/driver`, {
    method: 'POST', // changed from 'PATCH' to 'POST'
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!response.ok) {
    let err = {};
    try { err = await response.json(); } catch { }
    throw new Error((err as any).message || 'Failed to update driver profile');
  }
  const data = await response.json();
  return data.data;
}

/** Fetch vehicle profile */
export async function getVehicleProfile(): Promise<VehicleProfile> {
  const { data } = await axiosInstance.get<{ data: VehicleProfile }>('/profile/vehicle');
  return data.data;
}

/** Update vehicle profile using FormData (now uses POST!) */
export async function updateVehicleProfile(form: FormData): Promise<VehicleProfile> {
  const token = await getItem('user_token');
  const response = await fetch(`${BASE_URL}/profile/vehicle`, {
    method: 'POST', // changed from 'PATCH' to 'POST'
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!response.ok) {
    let err = {};
    try { err = await response.json(); } catch { }
    throw new Error((err as any).message || 'Failed to update vehicle profile');
  }
  const data = await response.json();
  return data.data;
}
