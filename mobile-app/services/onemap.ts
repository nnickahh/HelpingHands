import type { SelectedAddress } from "../state/AppProvider";

export type AddressSuggestion = SelectedAddress;

type ProxyResponse = { results?: AddressSuggestion[] };

const proxyUrl = process.env.EXPO_PUBLIC_ONEMAP_PROXY_URL;

const localSingaporeAddresses: AddressSuggestion[] = [
  { id: "mock-jurong-east", label: "Block 134, Jurong East Avenue 1", postalCode: "600134", latitude: 1.3347, longitude: 103.7436, area: "Jurong East" },
  { id: "mock-clementi", label: "Block 321, Clementi Avenue 3", postalCode: "129907", latitude: 1.3151, longitude: 103.7649, area: "Clementi" },
  { id: "mock-buona-vista", label: "Buona Vista Community Club", postalCode: "139961", latitude: 1.3074, longitude: 103.7892, area: "Buona Vista" },
];

export async function searchSingaporeAddresses(query: string, signal?: AbortSignal, accessToken?: string): Promise<AddressSuggestion[]> {
  const normalized = query.trim();
  if (normalized.length < 3) return [];

  if (!proxyUrl) {
    const lower = normalized.toLowerCase();
    return localSingaporeAddresses.filter((address) => `${address.label} ${address.postalCode} ${address.area}`.toLowerCase().includes(lower));
  }

  const response = await fetch(`${proxyUrl.replace(/\/$/, "")}?q=${encodeURIComponent(normalized)}`, { signal, headers: { Accept: "application/json", ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) } });
  if (!response.ok) throw new Error("Address search is temporarily unavailable.");
  const payload = (await response.json()) as ProxyResponse;
  return (payload.results ?? []).filter((address) => address.postalCode && address.area);
}
