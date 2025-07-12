// src/api/truck.ts
import axiosInstance  from '../utils/axios';
import type { TruckRideRequest, TruckOffer , ServiceResponse} from './types';

/**
 * Fetch the authenticated truck's single active (accepted) service.
 * Returns { success, message, timestamp, data } where data is either the RideRequest object or null.
 */
export async function fetchActiveServiceForTruck(): Promise<ServiceResponse | null> {
  const { data } = await axiosInstance.get<{ data: ServiceResponse | null }>(
    '/ride-request/fetch-active/truck'
  );
  return data.data;
}

//
// 1) Use GET for reads, and drop any `truck_id` in the body—your JWT already tells the server
//

/**
 * Fetch all "new" (unapplied) ride requests.
 */
export async function fetchNewRideRequests(): Promise<TruckRideRequest[]> {
  const { data } = await axiosInstance.get<{ data: TruckRideRequest[] }>('/ride-requests/fetch-new');
  return data.data ?? [];
}

/**
 * Fetch all "applied" ride requests.
 */
export async function fetchAppliedRideRequests(): Promise<TruckRideRequest[]> {
  const { data } = await axiosInstance.get<{ data: TruckRideRequest[] }>('/ride-requests/fetch-applied');
  return data.data ?? [];
}


//
// 3) Fetch the truck’s own offers on a ride (still POST, or you could switch to GET+query)
//

export async function fetchTruckOffers(
  requestId: string
): Promise<TruckOffer[]> {
  // we drop `truck_id` here because JWT → req.user.id on the server
  const { data } = await axiosInstance.post<{ data: TruckOffer[] }>(
    '/ride-request/offers',
    { request_id: requestId }
  );
  return data.data ?? [];
}

// export const fetchServiceByRequestId = async (requestId: string): Promise<ServiceResponse> => {
//   const res = await axiosInstance.get(`/truck/services/${requestId}`);
//   return res.data;
// };