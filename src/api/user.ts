import axiosInstance from "../utils/axios";

/* ---------------- Types ---------------- */

export type BasicUserInfo = {
  name: string;
  profile_photo: string;
  profile_photo_size?: number;
  rating?: number;
  ratings_count?: number;
};

export type GeoLocation = {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
};

export type VehicleLocationResponse = {
  success: boolean;
  location: GeoLocation | null;
};

export type ApiResponse = {
  success: boolean;
  message?: string;
};

/* ---------------- APIs ---------------- */

/**
 * Fetch basic user info.
 * If payload is provided, fetch info for that user.
 * Otherwise fetch authenticated user info.
 */
export async function getBasicInfo(
  payload?: { user_id: string }
): Promise<BasicUserInfo> {
  const response = await axiosInstance.post<{ data: BasicUserInfo }>(
    "/user/basic",
    payload || {}
  );

  return response.data.data;
}

/**
 * Update driver vehicle location
 */
export async function updateLocation(
  geo_location: GeoLocation
): Promise<ApiResponse> {
  const response = await axiosInstance.post<ApiResponse>(
    "/user/update-location",
    { geo_location }
  );

  return response.data;
}

/**
 * Fetch driver vehicle location
 */
export async function getVehicleLocation(
  driverId: string
): Promise<VehicleLocationResponse> {
  const response = await axiosInstance.get<VehicleLocationResponse>(
    `/user/vehicle/location/${driverId}`
  );

  return response.data;
}