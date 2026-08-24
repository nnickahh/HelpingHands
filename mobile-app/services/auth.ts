import * as Linking from "expo-linking";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const configuredRedirectUrl = process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL;
export const MOCK_VERIFICATION_CODE = "246810";
const useMockVerification = process.env.EXPO_PUBLIC_USE_MOCK_VERIFICATION !== "false";
const adminEmails = (process.env.EXPO_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
  .map((value: string) => value.trim().toLowerCase())
  .filter(Boolean);

function getEmailRedirectUrl() {
  if (configuredRedirectUrl) return configuredRedirectUrl;
  if (typeof window !== "undefined") return `${window.location.origin}/auth/callback`;
  return Linking.createURL("auth/callback");
}

export function isAdminEmailAllowed(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return adminEmails.includes(normalizedEmail);
}

export function accessConfigurationMessage() {
  return "This email is not authorized for the administrator panel.";
}

export function isSupabaseAuthConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

async function authRequest(path: string, body: Record<string, unknown>) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase Auth is not configured.");
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/${path}`, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { msg?: string; error_description?: string; message?: string } | null;
    throw new Error(payload?.msg ?? payload?.error_description ?? payload?.message ?? `Supabase Auth request failed (${response.status}).`);
  }
  return response.json().catch(() => ({}));
}

export function sendEmailVerificationCode(email: string, createUser = false) {
  if (useMockVerification) return Promise.resolve({ mock: true, code: MOCK_VERIFICATION_CODE });
  return authRequest("otp", {
    email,
    create_user: createUser,
    options: { email_redirect_to: getEmailRedirectUrl() },
  });
}

export function verifyEmailCode(email: string, token: string) {
  if (useMockVerification && token === MOCK_VERIFICATION_CODE) {
    return Promise.resolve({ access_token: "mock-access-token", refresh_token: "mock-refresh-token" });
  }
  return authRequest("verify", { email, token, type: "email" });
}

export function signUpWithPassword(email: string, password: string) {
  return authRequest("signup", {
    email,
    password,
    options: { email_redirect_to: getEmailRedirectUrl() },
  });
}

export function signInWithPassword(email: string, password: string) {
  return authRequest("token?grant_type=password", { email, password });
}

export async function sendPasswordResetEmail(email: string) {
  await authRequest("recover", { email, options: { redirect_to: getEmailRedirectUrl() } });
}