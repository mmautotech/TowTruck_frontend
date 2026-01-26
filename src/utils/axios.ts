// src/utils/axios.ts

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestConfig
} from 'axios';
import { SignoutUser } from './Signout_User';

const DEV_API = process.env.EXPO_PUBLIC_API_URL_DEV ?? 'https://towly-backend.onrender.com/api';
const PROD_API = process.env.EXPO_PUBLIC_API_URL_PROD ?? 'https://towly-backend.onrender.com/api';
const baseURL = __DEV__ ? DEV_API : PROD_API;

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 60000,
});

// In-memory auth token
let authToken: string | null = null;

/** Call once after login/register to set the JWT header */
export function setAuthToken(token: string) {
  authToken = token;
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

/** Call on logout to remove the JWT header */
export function clearAuthToken() {
  authToken = null;
  delete axiosInstance.defaults.headers.common['Authorization'];
}

// Attach Authorization header automatically
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (authToken && !config.headers?.Authorization) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    // Remove content-type override for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response handler
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalReq = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    const url = originalReq.url || '';

    // ** ONLY** auto‐signout on 401 for *protected* endpoints.
    // Skip signout if the call was to auth or T&C endpoints:
    if (status === 401
      && !url.startsWith('/auth/')
      && !url.startsWith('/terms/')  // adjust if you fetch terms from another path
    ) {
      clearAuthToken();
      await SignoutUser();
    }

    return Promise.reject(error);
  }
);
export const API_BASE_URL = baseURL;
export default axiosInstance;