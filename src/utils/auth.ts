// src/utils/auth.ts
import { clearAll } from './asyncStorage';

export async function logoutUser(navigation: any): Promise<void> {
  await clearAll();
  navigation.reset({
    index: 0,
    routes: [{ name: 'SigninScreen' }],
  });
}
