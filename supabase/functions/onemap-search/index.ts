const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type TokenCache = { accessToken: string; expiresAt: number };
type OneMapResult = { SEARCHVAL?: string; ADDRESS?: string; POSTAL?: string; LATITUDE?: string; LONGITUDE?: string; BUILDING?: string; ROAD_NAME?: string; BLK_NO?: string };

let tokenCache: TokenCache | null = null;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

async function getOneMapToken(forceRefresh = false) {
  const email = Deno.env.get("nnickahh@gmail.com");
  const password = Deno.env.get("T20060807a@1");
  if (!email || !password) throw new Error("OneMap server credentials are not configured.");

  const now = Date.now();
  if (!forceRefresh && tokenCache && tokenCache.expiresAt > now + 15 * 60 * 1000) return tokenCache.accessToken;

  const response = await fetch("https://www.onemap.gov.sg/api/auth/post/getToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("OneMap authentication failed.");
  const payload = (await response.json()) as { access_token?: string; expiry_timestamp?: string };
  if (!payload.access_token) throw new Error("OneMap did not return an access token.");

  const numericExpiry = payload.expiry_timestamp ? Number(payload.expiry_timestamp) : NaN;
  const parsedExpiry = Number.isFinite(numericExpiry) ? numericExpiry : Date.parse(payload.expiry_timestamp ?? "");
  const expiry = Number.isFinite(parsedExpiry) ? parsedExpiry : now + 72 * 60 * 60 * 1000;
  tokenCache = { accessToken: payload.access_token, expiresAt: expiry };
  return payload.access_token;
}

async function searchOneMap(query: string, token: string) {
  const url = new URL("https://www.onemap.gov.sg/api/common/elastic/search");
  url.searchParams.set("searchVal", query);
  url.searchParams.set("returnGeom", "Y");
  url.searchParams.set("getAddrDetails", "Y");
  url.searchParams.set("pageNum", "1");
  url.searchParams.set("token", token);
  return fetch(url);
}

function normalize(result: OneMapResult) {
  const postalCode = result.POSTAL?.trim() ?? "";
  const latitude = Number(result.LATITUDE);
  const longitude = Number(result.LONGITUDE);
  if (!postalCode || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  const label = result.ADDRESS?.trim() || result.SEARCHVAL?.trim();
  if (!label) return null;
  const area = result.ROAD_NAME?.trim() || result.BUILDING?.trim() || "Singapore";
  return { id: `${postalCode}-${latitude}-${longitude}`, label, postalCode, latitude, longitude, area };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "GET") return json({ error: "Method not allowed" }, 405);

  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 3 || query.length > 120) return json({ error: "Search must be between 3 and 120 characters." }, 400);

  try {
    let token = await getOneMapToken();
    let response = await searchOneMap(query, token);
    if (response.status === 401) {
      tokenCache = null;
      token = await getOneMapToken(true);
      response = await searchOneMap(query, token);
    }
    if (!response.ok) return json({ error: "Singapore address search is temporarily unavailable." }, 502);

    const payload = (await response.json()) as { results?: OneMapResult[] };
    const results = (payload.results ?? []).map(normalize).filter((result): result is NonNullable<ReturnType<typeof normalize>> => result !== null).slice(0, 5);
    return json({ results });
  } catch {
    return json({ error: "Singapore address search is temporarily unavailable." }, 503);
  }
});
