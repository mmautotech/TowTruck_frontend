export type RootStackParamList = {
  SplashScreen: undefined;
  SigninScreen: undefined;
  SignupScreen: undefined;
  ForgotPasswordScreen: undefined;
  ClientDrawerNavigator: undefined;
  TruckDrawerNavigator: undefined;
};

export type ClientDrawerParamList = {
  ClientDashboardStackNavigator: undefined;
  ClientProfileScreen: undefined;
  ClientHistoryScreen: undefined;
  ClientSettingsScreen: undefined;
  ClientTerms_ConditionsScreen: undefined;
};

export type TruckDrawerParamList = {
  TruckDashboardStackNavigator: undefined;
  TruckWalletScreen: undefined;
  TruckProfileScreen: undefined;
  TruckHistoryScreen: undefined;
  TruckSettingsScreen: undefined;
  TruckTerms_ConditionsScreen: undefined;
};


export type ClientStackParamList = {
  ClientDashboardScreen: undefined;
  ClientConfirmRequestScreen: undefined;
  ClientServicesScreen: undefined;
  ClientDriverTrackingScreen: undefined;
  MessagingScreen: undefined;
};

export type TruckStackParamList = {
  TruckDashboardScreen: undefined;
  TruckServiceScreen: undefined;
  MessagingScreen: undefined;
};

// types.ts

// Categories for vehicle details
export type WheelsCategory = 'rolling' | 'stationary';
export type VehicleCategory = 'donot-apply' | 'swb' | 'mwb' | 'lwb';
export type LoadedStatus = 'donot-apply' | 'loaded';

// Detailed vehicle information
export interface VehicleDetails {
  Registration: string;
  make: string;
  Model: string;
  Yearofmanufacture: number;
  Wheels_category: WheelsCategory;
  vehicle_category: VehicleCategory;
  loaded: LoadedStatus;
}

// Props for the RideRequestCard component
export interface RideRequestCardItem {
  request_id: string;
  username: string;
  origin_location: { coordinates: [number, number] };
  dest_location: { coordinates: [number, number] };
  vehicle_details: VehicleDetails;
  pickup_date: string;
  updatedAt: string;
  offered_price?: number;
  time_to_reach?: string;
  client_counter_price?: number;
}

export interface RideRequestCardProps {
  item: RideRequestCardItem;
  userLocation?: { latitude: number; longitude: number };
  onPress?: (item: RideRequestCardItem) => void;
}

// Offer structure returned by the API on "applied" tab
export interface Offer {
  offer_id: string;
  offered_price: number;
  time_to_reach: string;
  client_counter_price?: number;
  createdAt: string;
  updatedAt: string;
}

// RideRequest shape used in TruckDashboardScreen
export interface RideRequest {
  request_id: string;
  origin_location: { coordinates: [number, number] };
  dest_location: { coordinates: [number, number] };
  vehicle_details: VehicleDetails;
  pickup_date: string;
  updatedAt: string;
  username: string;
  offer?: Offer;
}

export interface WalletTransaction {
  _id: string;
  user_id: string;
  wallet_id: string;
  type: 'credit' | 'debit';
  amount: number;
  proof_details?: string;          // <-- ADD THIS
  proof_image_url?: string;        // (optional, if used)
  remarks?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  balanceAfter?: number;           // <-- ADD THIS
  log?: {
    action: string;
    by?: string;
    at?: string;
    note?: string;
  }[];
}

export type MessagingScreenParams = {
  reciever_id: string;
  reciever_name: string;
  reciever_photo?: string;
};

export type Notification = {
  _id: string;
  body: string;
  read: boolean;
}