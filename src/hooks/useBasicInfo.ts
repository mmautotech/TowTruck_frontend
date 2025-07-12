import { useEffect, useState, useCallback } from 'react';
import { getBasicInfo } from '../api/user';

const DEFAULT_AVATAR =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQABqQIdskCD9BK0I81EbVfV9tTz320XvJ35A&s';

export function useUserInfo() {
  const [name, setName] = useState('Guest');
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [ratings_count, setRatingsCount] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const user = await getBasicInfo();
      setName(user.name || 'Guest');
      setAvatar(user.profile_photo || DEFAULT_AVATAR);
      setRating(user.rating);
      setRatingsCount(user.ratings_count);
    } catch (err: any) {
      console.error('⚠️ Failed to fetch user info:', err?.message);
      setError(err?.message || 'Failed to load user info');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    name,
    avatar,
    rating,
    ratings_count,
    loading,
    error,
    refresh: fetchUser, // 👈 expose refresh
  };
}
