// src/utils/Signout_User.ts
import { CommonActions } from '@react-navigation/native';
import { navigationRef } from '../navigation/RootNavigation';
import { disconnectSocket } from './socket';
import { clearAll } from './asyncStorage';

export async function SignoutUser(): Promise<void> {
  try {
    disconnectSocket();
    await clearAll();

    if (navigationRef.isReady()) {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'SigninScreen' }],
        })
      );
    }
  } catch (e) {
    console.error('[SignoutUser] Error during signout:', e);
  }
}
