// src/api/rideRequest.ts

import axiosInstance from '../utils/axios';
import type {
  RideRequest,
  GeoPoint,
  VehicleDetails,
} from './types';

/** Create a new ride request */
export interface CreateRequestPayload {
  origin_location: GeoPoint;
  dest_location: GeoPoint;
  pickup_date: string;
  vehicle_details: VehicleDetails;
}
export interface CreateRequestResponse {
  request_id: string;
}
export async function createRideRequest(
  payload: CreateRequestPayload
): Promise<{ request_id: string }> {
  const { data } = await axiosInstance.post<CreateRequestResponse>(
    '/ride-request/create',
    payload
  );
  return data;
}

/** Confirm (post) an existing ride request */
export interface ConfirmRideResponse {
  success: boolean;
  message?: string;
  timestamp?: string;
}
export async function confirmRideRequest(
  request_id: string
): Promise<ConfirmRideResponse> {
  const { data } = await axiosInstance.patch<ConfirmRideResponse>(
    '/ride-request/post',
    { request_id }
  );
  return data;
}

/** Cancel a ride request */
export interface CancelRideResponse {
  success: boolean;
  message?: string;
}

export async function cancelRideRequest(
  request_id: string,
  reason?: string
): Promise<CancelRideResponse> {
  const { data } = await axiosInstance.patch<CancelRideResponse>(
    '/ride-request/cancel',
    { request_id, reason }
  );
  return data;
}

/** ReOpen a ride request */
export interface ReopenRideResponse {
  success: boolean;
  message?: string;
}
export async function reopenRideRequest(
  request_id: string,
  reason?: string
): Promise<ReopenRideResponse> {
  const { data } = await axiosInstance.patch<ReopenRideResponse>(
    '/ride-request/re-open',
    { request_id, reason }
  );
  return data;
}

// Complete Ride Request
export interface CompleteRideResponse {
  success: boolean;
  message?: string;
}

export async function CompleteRide(
  request_id: string,
): Promise<CompleteRideResponse> {
  const { data } = await axiosInstance.post<CompleteRideResponse>(
    '/ride-request/complete',
    { request_id}
  );
  return data;
}

/**
 * Fetch the authenticated user's single active ride request.
 * The server reads your JWT; no user_id in the body.
 */
export async function fetchActiveRequest(): Promise<RideRequest | null> {
  const { data } = await axiosInstance.get<{ data: RideRequest | null }>(
    '/ride-request/fetch-active'
  );
  return data.data;
}

export const fetchDriverTrackingInfo = async () => {
  const res = await axiosInstance.get('/ride-request/fetch-truck/tracking');
  return res.data?.data;
};
