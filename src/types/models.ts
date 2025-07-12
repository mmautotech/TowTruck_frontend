export interface VehicleDetails {
  Registration: string;
  make: string;
  Model: string;
  Yearofmanufacture: number;
  Wheels_category: 'rolling' | 'stationary';
  vehicle_category?: 'swb' | 'mwb' | 'lwb';
  loaded?: 'loaded' | 'donot-apply';
}

export interface RideRequest {
  _id: string;
  status: 'created' | 'posted' | 'cancelled';
  user_id: string;
  origin_location: { type: 'Point'; coordinates: [number, number] };
  dest_location: { type: 'Point'; coordinates: [number, number] };
  pickup_date: string;
  vehicle_details: VehicleDetails;
}

export interface Offer {
  offer_id: string;
  truck_username: string;
  offered_price: number;
  time_to_reach: string;
  truck_rating?: number;
  client_counter_price?: number;
}
