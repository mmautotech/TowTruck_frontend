// src/utils/asyncStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const NAMESPACE = ''; // or 'MyApp:'

export async function getItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(NAMESPACE + key);
  } catch (e) {
    console.error(`[asyncStorage] getItem("${key}") error:`, e);
    return null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(NAMESPACE + key, value);
  } catch (e) {
    console.error(`[asyncStorage] setItem("${key}") error:`, e);
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(NAMESPACE + key);
  } catch (e) {
    console.error(`[asyncStorage] removeItem("${key}") error:`, e);
  }
}

export async function multiGet(keys: string[]): Promise<Record<string, string | null>> {
  try {
    const prefixed = keys.map(k => NAMESPACE + k);
    const entries = await AsyncStorage.multiGet(prefixed);
    return entries.reduce((acc, [fullKey, v]) => {
      const key = fullKey.replace(NAMESPACE, '');
      acc[key] = v;
      return acc;
    }, {} as Record<string, string | null>);
  } catch (e) {
    console.error(`[asyncStorage] multiGet error:`, e);
    return keys.reduce((acc, k) => ({ ...acc, [k]: null }), {} as Record<string, null>);
  }
}

export async function multiSet(items: [string, string][]): Promise<void> {
  try {
    const prefixed = items.map(([k, v]) => [NAMESPACE + k, v] as [string, string]);
    await AsyncStorage.multiSet(prefixed);
  } catch (e) {
    console.error(`[asyncStorage] multiSet error:`, e);
  }
}

export async function multiRemove(keys: string[]): Promise<void> {
  try {
    const prefixed = keys.map(k => NAMESPACE + k);
    await AsyncStorage.multiRemove(prefixed);
  } catch (e) {
    console.error(`[asyncStorage] multiRemove error:`, e);
  }
}

// JSON helpers
export async function setJSON<T>(key: string, value: T): Promise<void> {
  await setItem(key, JSON.stringify(value));
}
export async function getJSON<T>(key: string): Promise<T | null> {
  const raw = await getItem(key);
  if (!raw) return null;
  try { return JSON.parse(raw) as T; }
  catch (e) {
    console.error(`[asyncStorage] getJSON("${key}") parse error:`, e);
    return null;
  }
}

// Clear-all
export async function clearAll(): Promise<void> {
  try { await AsyncStorage.clear(); }
  catch (e) { console.error('[asyncStorage] clearAll error:', e); }
}

