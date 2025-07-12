// src/api/types.ts

// ─────────────────────────────────────────────
// ENUM TYPES
// ─────────────────────────────────────────────

export type VehicleCategory = 'donot-apply' | 'Short Wheel Base' | 'Medium Wheel Base' | 'Long Wheel Base';
export type WheelsCategory = 'Wheels Are Rolling' | 'Wheels Are Not Rolling';
export type LoadedStatus = 'Unloaded' | 'Loaded';
export type RideStatus = 'created' | 'posted' | 'accepted' | 'completed' | 'cancelled';
export type UserRole = 'admin' | 'client' | 'driver';
export type Currency = 'GBP';
export type Language = 'English'; // extend if needed
export type TimeFormat = '12 Hour' | '24 Hour';
export type DistanceUnit = 'Miles' | 'Kilometers';

// ─────────────────────────────────────────────
// SHARED INTERFACES
// ─────────────────────────────────────────────

// GeoJSON-compatible point type
export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

// Core vehicle structure
export interface VehicleDetails {
  registration: string;
  make: string;
  model: string;
  year_of_manufacture: number;
  wheels_category: WheelsCategory;
  vehicle_category: VehicleCategory;
  loaded: LoadedStatus;
}

// Reusable offer structure (can be used by both client & truck views)
export interface Offer {
  offer_id?: string;
  offered_price: number;
  time_to_reach: string;
  client_counter_price?: number;
  createdAt: string;
  updatedAt: string;
  offer_updated_at: string;
  accepted?: boolean; // Truck view only
  truck_username?: string;
  truck_rating?: number;
  truck_photo?: string;
  client?: {
    name: string;
  };
}

// ─────────────────────────────────────────────
// RIDE REQUESTS & HISTORY TYPES
// ─────────────────────────────────────────────

// Ride Request object used by truck feed
export interface RideRequest {
  _id: string;
  status: RideStatus;
  pickup_date: string;
  origin_location: GeoPoint;
  dest_location: GeoPoint;
  vehicle_details: VehicleDetails;
}

// “ServiceResponse” now includes a nested `client` object
export interface ServiceResponse {
  _id: string;
  status: RideStatus;
  origin_location: GeoPoint;
  dest_location: GeoPoint;
  pickup_date: string;
  vehicle_details: VehicleDetails;
  offers: Offer & {
    truck_id: string;
    _id: string;
  };
  accepted_offer: string;
  createdAt: string;
  updatedAt: string;

  // NEWLY ADDED CLIENT SUB‐OBJECT:
  client: {
    client_id: string;    // ObjectId of the client
    client_name: string;  // client’s username
    client_photo: string;      // base64‐encoded compressed photo
  };
}

// “fetchActiveServiceForTruck” returns either this or null
export type ServiceResponseOrNull = ServiceResponse | null;

// Submitted offer (by truck) payload
export interface TruckOffer {
  request_id: string;
  offered_price: number;
  time_to_reach: string;
  client_counter_price?: number;
  updatedAt: string;
}

// Truck view of a ride request in feed
export interface TruckRideRequest {
  request_id: string;
  username: string;
  user_photo?: string;
  origin_location: GeoPoint;
  dest_location: GeoPoint;
  vehicle_details: VehicleDetails;
  pickup_date: string;
  updatedAt: string;
  offer?: TruckOffer;
}

// Client-side ride history view
export interface ClientHistoryItem {
  request_id: string;
  origin_location: GeoPoint;
  dest_location: GeoPoint;
  pickup_date: string;
  updatedAt: string;
  vehicle: VehicleDetails;
  accepted_offer: Offer | null;
  ride_status: {
    code: RideStatus;
    label: string;
  };
}

// Truck-side ride history view
export interface TruckHistoryItem {
  request_id: string;
  origin_location: GeoPoint;
  dest_location: GeoPoint;
  pickup_date: string;
  updatedAt: string;
  vehicle: Pick<VehicleDetails, 'make' | 'model' | 'registration'>; // partial vehicle details
  offer: Offer | null;
  ride_status: {
    code: RideStatus;
    label: string;
  };
}

// ─────────────────────────────────────────────
// USER PROFILES & SETTINGS
// ─────────────────────────────────────────────

export interface ClientProfile {
  phone: string;
  first_name: string;
  last_name: string;
  email?: string;
  address?: string;
  profile_photo?: string;
}

export interface DriverProfile {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  licenseNumber: string;
  licenseExpiry: string;
  licenseFront?: string;
  licenseBack?: string;
  licenseSelfie?: string;
}

export interface VehicleProfile {
  registration_number: string;
  make: string;
  model: string;
  color: string;
  vehiclePhoto?: string; // base64 image URI
}

// Optional settings for user preferences
export interface UserSettings {
  success: Boolean,
  message: string,
  language: Language;
  currency: Currency;
  distance_unit: DistanceUnit;
  time_format: TimeFormat;
  radius: string;
}
