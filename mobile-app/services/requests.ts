import type { RequestDraft, SelectedAddress } from "../state/AppProvider";
import { availableRequests } from "../data/mockData";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export type SharedRequest = {
  id: string;
  elder_email: string;
  elder_name: string;
  elder_phone: string;
  category: string;
  scheduled_at: string | null;
  display_date: string;
  display_time: string;
  address: SelectedAddress;
  notes: string;
  status: "pending" | "accepted" | "inProgress" | "done" | "cancelled" | "rejected";
  volunteer_email: string | null;
  volunteer_name: string | null;
  volunteer_phone: string | null;
  is_elder_created?: boolean;
};

// Seed with default community requests so volunteers have tasks immediately available
const initialMockRequests: SharedRequest[] = availableRequests.map((req) => ({
  id: req.id,
  elder_email: `${req.elderName.toLowerCase().replace(/\s+/g, ".")}@example.sg`,
  elder_name: req.elderName,
  elder_phone: req.elderPhone,
  category: req.category,
  scheduled_at: req.scheduledAt,
  display_date: req.displayDate,
  display_time: req.displayTime,
  address: req.address as SelectedAddress,
  notes: req.notes,
  status: "pending",
  volunteer_email: null,
  volunteer_name: null,
  volunteer_phone: null,
  is_elder_created: false,
}));

const mockSharedRequests: SharedRequest[] = [...initialMockRequests];

async function requestApi<T>(path: string, token: string, options: RequestInit = {}): Promise<T> {
  if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase is not configured.");
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  if (!response.ok) throw new Error(`Request sync failed (${response.status}).`);
  return response.json() as Promise<T>;
}

export async function createSharedRequest(token: string, payload: {
  accountEmail: string;
  accountName: string;
  accountPhone: string;
  category: string;
  draft: RequestDraft;
}): Promise<SharedRequest> {
  const mockFallback = (): SharedRequest => {
    const mockRequest: SharedRequest = {
      id: `request-${Date.now()}`,
      elder_email: payload.accountEmail,
      elder_name: payload.accountName,
      elder_phone: payload.accountPhone,
      category: payload.category,
      scheduled_at: payload.draft.scheduledAt,
      display_date: payload.draft.displayDate,
      display_time: payload.draft.displayTime,
      address: payload.draft.address!,
      notes: payload.draft.notes,
      status: "pending",
      volunteer_email: null,
      volunteer_name: null,
      volunteer_phone: null,
      is_elder_created: true,
    };
    mockSharedRequests.unshift(mockRequest);
    return mockRequest;
  };

  if (!token || token === "mock-access-token" || !supabaseUrl || !supabaseAnonKey) {
    return mockFallback();
  }

  try {
    const rows = await requestApi<SharedRequest[]>("assistance_requests", token, {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        elder_email: payload.accountEmail,
        elder_name: payload.accountName,
        elder_phone: payload.accountPhone,
        category: payload.category,
        scheduled_at: payload.draft.scheduledAt,
        display_date: payload.draft.displayDate,
        display_time: payload.draft.displayTime,
        address: payload.draft.address,
        notes: payload.draft.notes,
        status: "pending",
      }),
    });
    if (Array.isArray(rows) && rows.length > 0) {
      const created = { ...rows[0], is_elder_created: true };
      mockSharedRequests.unshift(created);
      return created;
    }
    return mockFallback();
  } catch (error) {
    console.warn("Supabase assistance_requests sync failed, using local storage fallback:", error);
    return mockFallback();
  }
}

export async function updateSharedRequest(token: string, id: string, updates: Partial<SharedRequest>): Promise<SharedRequest | null> {
  const updateLocal = () => {
    const request = mockSharedRequests.find((item) => item.id === id);
    if (!request) return null;
    Object.assign(request, updates);
    return request;
  };

  if (!token || token === "mock-access-token" || !supabaseUrl || !supabaseAnonKey) {
    return updateLocal();
  }

  try {
    const rows = await requestApi<SharedRequest[]>(`assistance_requests?id=eq.${encodeURIComponent(id)}`, token, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(updates),
    });
    if (Array.isArray(rows) && rows.length > 0) {
      updateLocal();
      return rows[0];
    }
    return updateLocal();
  } catch {
    return updateLocal();
  }
}

export async function listPendingRequests(token: string): Promise<SharedRequest[]> {
  const localPending = mockSharedRequests.filter((request) => request.status === "pending");

  if (!token || token === "mock-access-token" || !supabaseUrl || !supabaseAnonKey) {
    return localPending;
  }

  try {
    const remote = await requestApi<SharedRequest[]>("assistance_requests?status=eq.pending&order=created_at.desc", token);
    if (Array.isArray(remote) && remote.length > 0) {
      return remote;
    }
    return localPending;
  } catch {
    return localPending;
  }
}

export async function getSharedRequest(token: string, id: string): Promise<SharedRequest | null> {
  const local = mockSharedRequests.find((request) => request.id === id) ?? null;

  if (!token || token === "mock-access-token" || !supabaseUrl || !supabaseAnonKey) {
    return local;
  }

  try {
    const rows = await requestApi<SharedRequest[]>(`assistance_requests?id=eq.${encodeURIComponent(id)}&limit=1`, token);
    return rows[0] ?? local;
  } catch {
    return local;
  }
}

export async function acceptSharedRequest(token: string, id: string, volunteer: { email: string; name: string; phone: string }): Promise<SharedRequest | null> {
  const updateLocal = () => {
    const request = mockSharedRequests.find((item) => item.id === id);
    if (!request) return null;
    Object.assign(request, { status: "accepted", volunteer_email: volunteer.email, volunteer_name: volunteer.name, volunteer_phone: volunteer.phone });
    return request;
  };

  if (!token || token === "mock-access-token" || !supabaseUrl || !supabaseAnonKey) {
    return updateLocal();
  }

  try {
    const rows = await requestApi<SharedRequest[]>(`assistance_requests?id=eq.${encodeURIComponent(id)}&status=eq.pending`, token, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status: "accepted", volunteer_email: volunteer.email, volunteer_name: volunteer.name, volunteer_phone: volunteer.phone }),
    });
    if (Array.isArray(rows) && rows.length > 0) {
      updateLocal();
      return rows[0];
    }
    return updateLocal();
  } catch {
    return updateLocal();
  }
}

export async function rejectSharedRequest(token: string, id: string): Promise<boolean> {
  const local = mockSharedRequests.find((item) => item.id === id);
  if (local) {
    local.status = "rejected";
  }

  if (!token || token === "mock-access-token" || !supabaseUrl || !supabaseAnonKey) {
    return true;
  }

  try {
    await requestApi<SharedRequest[]>(`assistance_requests?id=eq.${encodeURIComponent(id)}`, token, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status: "rejected" }),
    });
    return true;
  } catch {
    return true;
  }
}

