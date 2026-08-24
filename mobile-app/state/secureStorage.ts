let SecureStore: any = null;

try {
  // Dynamic require so the app doesn't crash if the module is missing in some environments
  // (Expo Go typically provides expo-secure-store).
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  SecureStore = require("expo-secure-store");
} catch (err) {
  SecureStore = null;
}

const memory = new Map<string, string>();

const secureStorage = {
  async getItem(key: string) {
    try {
      if (SecureStore && SecureStore.getItemAsync) {
        return await SecureStore.getItemAsync(key);
      }
    } catch (err) {
      // fall through to memory
    }
    return memory.get(key) ?? null;
  },
  async setItem(key: string, value: string) {
    try {
      if (SecureStore && SecureStore.setItemAsync) {
        await SecureStore.setItemAsync(key, value);
        return;
      }
    } catch (err) {
      // ignore
    }

    memory.set(key, value);
  },
  async removeItem(key: string) {
    try {
      if (SecureStore && SecureStore.deleteItemAsync) {
        await SecureStore.deleteItemAsync(key);
        return;
      }
    } catch (err) {
      // ignore
    }

    memory.delete(key);
  },
};

export default secureStorage;
