// src/api/auth.ts

import axiosInstance from '../utils/axios';

export interface LoginResponseData {
  token: string;
  user_id: string;
  role: 'client' | 'truck' | 'admin';
}

export async function login(
  phone: string,
  password: string
): Promise<LoginResponseData> {
  try {
    const response = await axiosInstance.post<{
      message: string;
      data: LoginResponseData;
    }>('/auth/login', { phone, password });

    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Login failed';
    throw new Error(message);
  }
}

// ✅ Client Registration
export async function registerClient(
  user_name: string,
  phone: string,
  email: string,
  password: string
): Promise<LoginResponseData> {
  try {
    const response = await axiosInstance.post<{
      message: string;
      data: LoginResponseData;
    }>('/auth/register', {
      user_name,
      phone,
      email,
      password,
    });

    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Registration failed';
    throw new Error(message);
  }
}

// ✅ Trucker Registration
export async function registerTrucker(
  user_name: string,
  phone: string,
  email: string,
  password: string
): Promise<LoginResponseData> {
  try {
    const response = await axiosInstance.post<{
      message: string;
      data: LoginResponseData;
    }>('/auth/register-trucker', {
      user_name,
      phone,
      email,
      password,
    });

    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Trucker registration failed';
    throw new Error(message);
  }
}

// ✅ Forgot Password
export async function forgotPassword(
  phone: string,
  password: string
): Promise<{ message: string }> {
  try {
    const response = await axiosInstance.post<{ message: string }>(
      '/auth/forgot-password',
      { phone, password }
    );
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Password reset failed';
    throw new Error(message);
  }
}
