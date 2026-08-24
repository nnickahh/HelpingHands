import AsyncStorage from "./storage";
import secureStorage from "./secureStorage";

import type { AccountProfile } from "./AppProvider";

export const SESSION_STORAGE_KEY = "helpinghands:account-session";

export async function loadAccountSession(): Promise<Partial<AccountProfile> | null> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<AccountProfile>;
    if (!parsed || typeof parsed !== "object") return null;
    // Try to load a saved password from secure storage
    const password = await secureStorage.getItem(`${SESSION_STORAGE_KEY}:password`);

    return {
      name: parsed.name ?? "",
      email: parsed.email ?? "",
      phone: parsed.phone ?? "",
      password: password ?? "",
      avatarUri: parsed.avatarUri ?? null,
      lastIdentifier: parsed.lastIdentifier ?? "",
      rememberMe: Boolean(parsed.rememberMe),
      preferredLanguage: parsed.preferredLanguage ?? "English",
      isLoggedIn: Boolean(parsed.isLoggedIn),
      isEmailVerified: Boolean(parsed.isEmailVerified),
      isIdVerified: Boolean(parsed.isIdVerified),
      isIdSubmitted: Boolean(parsed.isIdSubmitted),
      showInAdmin: Boolean(parsed.showInAdmin),
      authAccessToken: await secureStorage.getItem(`${SESSION_STORAGE_KEY}:access-token`) ?? "",
      authRefreshToken: await secureStorage.getItem(`${SESSION_STORAGE_KEY}:refresh-token`) ?? "",
    };
  } catch (error) {
    console.warn("Unable to load saved session", error);
    return null;
  }
}

export async function saveAccountSession(profile: AccountProfile) {
  try {
    const safeProfile = {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      avatarUri: (profile as any).avatarUri ?? null,
      lastIdentifier: (profile as any).lastIdentifier ?? "",
      rememberMe: Boolean((profile as any).rememberMe),
      preferredLanguage: (profile as any).preferredLanguage ?? "English",
      isLoggedIn: profile.isLoggedIn,
      isEmailVerified: profile.isEmailVerified,
      isIdVerified: profile.isIdVerified,
      isIdSubmitted: Boolean(profile.isIdSubmitted),
      showInAdmin: Boolean(profile.showInAdmin),
    };

    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(safeProfile));

    const accessToken = profile.authAccessToken;
    const refreshToken = profile.authRefreshToken;
    if (accessToken) await secureStorage.setItem(`${SESSION_STORAGE_KEY}:access-token`, accessToken);
    else await secureStorage.removeItem(`${SESSION_STORAGE_KEY}:access-token`);
    if (refreshToken) await secureStorage.setItem(`${SESSION_STORAGE_KEY}:refresh-token`, refreshToken);
    else await secureStorage.removeItem(`${SESSION_STORAGE_KEY}:refresh-token`);

    // Save or remove password in secure storage depending on rememberMe
    const pwd = (profile as any).password;
    if (pwd && (profile as any).rememberMe) {
      await secureStorage.setItem(`${SESSION_STORAGE_KEY}:password`, String(pwd));
    } else {
      await secureStorage.removeItem(`${SESSION_STORAGE_KEY}:password`);
    }
  } catch (error) {
    console.warn("Unable to save session", error);
  }
}

export async function clearAccountSession() {
  try {
    await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
    await secureStorage.removeItem(`${SESSION_STORAGE_KEY}:password`);
    await secureStorage.removeItem(`${SESSION_STORAGE_KEY}:access-token`);
    await secureStorage.removeItem(`${SESSION_STORAGE_KEY}:refresh-token`);
  } catch (error) {
    console.warn("Unable to clear session", error);
  }
}

export const REGISTERED_ACCOUNTS_KEY = "helpinghands:registered-accounts";

export type RegisteredAccount = {
  email: string;
  password?: string;
  name?: string;
  phone?: string;
  role?: "elder" | "volunteer";
  avatarUri?: string | null;
  isIdVerified?: boolean;
};

const defaultSeedAccounts: Record<string, RegisteredAccount> = {
  "nnickahh@gmail.com": {
    email: "nnickahh@gmail.com",
    name: "Member",
    phone: "91234567",
    password: "123456",
    role: "elder",
  },
  "skithrills@gmail.com": {
    email: "skithrills@gmail.com",
    name: "Member",
    phone: "91234568",
    password: "123456",
    role: "elder",
  },
  "cheonganna44@gmail.com": {
    email: "cheonganna44@gmail.com",
    name: "Member",
    phone: "91234569",
    password: "123456",
    role: "volunteer",
  },
  "elder@helpinghands.sg": {
    email: "elder@helpinghands.sg",
    name: "Mdm Maria Lim",
    phone: "81234567",
    password: "123456",
    role: "elder",
  },
  "volunteer@helpinghands.sg": {
    email: "volunteer@helpinghands.sg",
    name: "Ben Lim Wei Jie",
    phone: "91234567",
    password: "123456",
    role: "volunteer",
  },
};

export async function getRegisteredAccounts(): Promise<Record<string, RegisteredAccount>> {
  try {
    const raw = await AsyncStorage.getItem(REGISTERED_ACCOUNTS_KEY);
    if (!raw) return defaultSeedAccounts;
    const parsed = JSON.parse(raw) as Record<string, RegisteredAccount>;
    return { ...defaultSeedAccounts, ...parsed };
  } catch {
    return defaultSeedAccounts;
  }
}

export async function saveRegisteredAccount(account: RegisteredAccount): Promise<void> {
  try {
    const normalizedEmail = account.email.trim().toLowerCase();
    const existing = await getRegisteredAccounts();
    existing[normalizedEmail] = {
      ...existing[normalizedEmail],
      ...account,
      email: normalizedEmail,
      password: account.password || existing[normalizedEmail]?.password || "123456",
    };
    await AsyncStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(existing));
    if (account.password) {
      await secureStorage.setItem(`pwd:${normalizedEmail}`, account.password);
    }
  } catch (error) {
    console.warn("Unable to save registered account", error);
  }
}

export async function findRegisteredAccount(email: string): Promise<RegisteredAccount | null> {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await getRegisteredAccounts();
    const found = existing[normalizedEmail];
    if (!found) return null;
    const storedPwd = await secureStorage.getItem(`pwd:${normalizedEmail}`);
    return {
      ...found,
      password: storedPwd || found.password || "123456",
    };
  } catch {
    return null;
  }
}

