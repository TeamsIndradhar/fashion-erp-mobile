import * as SecureStore from "expo-secure-store";
import type { SecureKV } from "../auth/tokenStore";

// WHEN_UNLOCKED_THIS_DEVICE_ONLY: not restored to another phone from a backup (D-014).
const OPTIONS: SecureStore.SecureStoreOptions = { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY };

export const secureKV: SecureKV = {
  getItem: (key) => SecureStore.getItemAsync(key, OPTIONS),
  setItem: (key, value) => SecureStore.setItemAsync(key, value, OPTIONS),
  deleteItem: (key) => SecureStore.deleteItemAsync(key, OPTIONS),
};
