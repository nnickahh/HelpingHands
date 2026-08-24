import AsyncStorageNative from "@react-native-async-storage/async-storage";

const isWeb = typeof window !== "undefined" && typeof window.document !== "undefined";

type StorageLike = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

const webFallback: StorageLike = {
  async getItem(key: string) {
    try {
      return Promise.resolve(localStorage.getItem(key));
    } catch {
      return Promise.resolve(null);
    }
  },
  async setItem(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore
    }
    return Promise.resolve();
  },
  async removeItem(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    return Promise.resolve();
  },
};

const memoryMap = new Map<string, string>();
const memoryFallback: StorageLike = {
  async getItem(key: string) {
    return Promise.resolve(memoryMap.get(key) ?? null);
  },
  async setItem(key: string, value: string) {
    memoryMap.set(key, value);
    return Promise.resolve();
  },
  async removeItem(key: string) {
    memoryMap.delete(key);
    return Promise.resolve();
  },
};

const fallback = isWeb ? webFallback : memoryFallback;

const AsyncStorage: StorageLike = {
  async getItem(key: string) {
    try {
      const v = await AsyncStorageNative.getItem(key as any);
      return v as string | null;
    } catch (err) {
      return fallback.getItem(key);
    }
  },
  async setItem(key: string, value: string) {
    try {
      await AsyncStorageNative.setItem(key as any, value as any);
    } catch (err) {
      await fallback.setItem(key, value);
    }
  },
  async removeItem(key: string) {
    try {
      await AsyncStorageNative.removeItem(key as any);
    } catch (err) {
      await fallback.removeItem(key);
    }
  },
};

export default AsyncStorage;
