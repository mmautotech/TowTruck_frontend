// src/api/offers.ts
import axiosInstance from '../utils/axios';
import type { Offer } from './types';

export async function fetchOffers(
  request_id: string
): Promise<Offer[]> {
  const { data } = await axiosInstance.post<{ offers: Offer[] }>(
    '/ride-request/offers',
    { request_id }
  );
  return data.offers || [];
}

export interface CounterOfferResponse {
  success: boolean;
  message?: string;
}

export async function postCounterOffer(
  offer_id: string,
  client_counter_price: number
): Promise<CounterOfferResponse> {
  const { data } = await axiosInstance.patch<CounterOfferResponse>(
    '/ride-request/counter-offer',
    { offer_id, client_counter_price }
  );
  return data;
}

export interface AcceptOfferResponse {
  success: boolean;
  message?: string;
}

export async function acceptRideOffer(
  request_id: string,
  offer_id: string
): Promise<AcceptOfferResponse> {
  const { data } = await axiosInstance.patch<AcceptOfferResponse>(
    '/ride-request/accept',
    { request_id, offer_id }
  );
  return data;
}

//
// 2) Offer endpoints
//    • POST → PATCH for both create & update
//    • Server pulls your truck_id from JWT
//

export interface AddOfferResponse {
  success: boolean;
  message?: string;
}

/**
 * Create or update your offer on a ride.
 *
 * @param requestId    The ride request’s ID
 * @param offeredPrice Your price in GBP
 * @param days         Time-to-reach days
 * @param hours        Time-to-reach hours
 * @param minutes      Time-to-reach minutes
 * @param location     Your current location as a GeoJSON Point
 */
export async function upsertRideOffer(
  requestId: string,
  offeredPrice: number,
  days: number,
  hours: number,
  minutes: number,
  location: { type: 'Point'; coordinates: [number, number] }
): Promise<AddOfferResponse> {
  const payload = {
    request_id: requestId,
    offered_price: offeredPrice,
    days,
    hours,
    minutes,
    location, // ← include the GeoJSON point here
  };

  const { data } = await axiosInstance.patch<AddOfferResponse>(
    '/ride-request/add-offer',
    payload
  );

  return data;
}