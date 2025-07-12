import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  id: string;
}

export const getUserIdFromToken = async (token: string): Promise<string | null> => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded?.id || null;
  } catch (err) {
    console.error('❌ Invalid token decode:', err);
    return null;
  }
};
