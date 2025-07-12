// src/api/settings.ts
import axiosInstance from '../utils/axios';
import type { Language, Currency, DistanceUnit, TimeFormat } from './types';

interface SettingsResponse {
  success: boolean;
  message: string;
  data?: {
    language: Language;
    currency: Currency;
    distance_unit: DistanceUnit;
    time_format: TimeFormat;
    radius: string;
  };
}

/** GET the authenticated user's settings */
export async function fetchUserSettings(): Promise<SettingsResponse> {
  const res = await axiosInstance.get<SettingsResponse>('/user/settings');
  return res.data;   // ← return the whole object
}

/** UPDATE the authenticated user's settings */
export async function updateUserSettings(
  settings: Partial<SettingsResponse['data']>
): Promise<void> {
  await axiosInstance.put('/user/settings', settings);
}
