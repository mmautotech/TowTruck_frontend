import axiosInstance from '../utils/axios';

export type BasicUserInfo = {
  name: string;
  profile_photo: string;
  profile_photo_size?: number;
  rating?: number;
  ratings_count?: number;
};

/**
 * Fetches basic user info.
 * If payload is provided, fetches info for that user.
 * Otherwise, fetches info for the authenticated user.
 */
export async function getBasicInfo(payload?: { user_id: string }): Promise<BasicUserInfo> {
  const response = await axiosInstance.post<{ data: BasicUserInfo }>('/user/basic', payload || {});
  return response.data.data;
}
