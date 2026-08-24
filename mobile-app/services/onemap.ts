import type { SelectedAddress } from "../state/AppProvider";

export type AddressSuggestion = SelectedAddress;

type ProxyResponse = { results?: AddressSuggestion[] };

const proxyUrl = process.env.EXPO_PUBLIC_ONEMAP_PROXY_URL;

const localSingaporeAddresses: AddressSuggestion[] = [
  // ITE Campuses
  { id: "mock-ite-east", label: "ITE College East", postalCode: "529757", latitude: 1.3421, longitude: 103.9634, area: "Simei" },
  { id: "mock-ite-central", label: "ITE College Central", postalCode: "569830", latitude: 1.3456, longitude: 103.9322, area: "Ang Mo Kio" },
  { id: "mock-ite-college-west", label: "ITE College West", postalCode: "688236", latitude: 1.3854, longitude: 103.7445, area: "Choa Chu Kang" },
  // Ang Mo Kio
  { id: "mock-amk-hub", label: "AMK Hub", postalCode: "569933", latitude: 1.3691, longitude: 103.8486, area: "Ang Mo Kio" },
  { id: "mock-amk-blk722", label: "Block 722, Ang Mo Kio Avenue 8", postalCode: "560722", latitude: 1.3710, longitude: 103.8540, area: "Ang Mo Kio" },
  // Bedok
  { id: "mock-bedok-mall", label: "Bedok Mall", postalCode: "467360", latitude: 1.3245, longitude: 103.9300, area: "Bedok" },
  { id: "mock-bedok-blk85", label: "Block 85, Bedok North Street 4", postalCode: "460085", latitude: 1.3285, longitude: 103.9325, area: "Bedok" },
  // Bishan
  { id: "mock-junction8", label: "Junction 8 Shopping Centre", postalCode: "579837", latitude: 1.3505, longitude: 103.8490, area: "Bishan" },
  { id: "mock-bishan-blk283", label: "Block 283, Bishan Street 22", postalCode: "570283", latitude: 1.3520, longitude: 103.8510, area: "Bishan" },
  // Boon Lay
  { id: "mock-jurong-point", label: "Jurong Point Shopping Centre", postalCode: "648886", latitude: 1.3399, longitude: 103.7060, area: "Boon Lay" },
  // Bukit Batok
  { id: "mock-westmall", label: "West Mall", postalCode: "658205", latitude: 1.3496, longitude: 103.7497, area: "Bukit Batok" },
  { id: "mock-bb-blk283", label: "Block 283, Bukit Batok East Avenue 3", postalCode: "650283", latitude: 1.3488, longitude: 103.7535, area: "Bukit Batok" },
  // Bukit Merah
  { id: "mock-anchorpoint", label: "Anchorpoint Shopping Centre", postalCode: "159836", latitude: 1.2880, longitude: 103.8028, area: "Bukit Merah" },
  { id: "mock-bm-blk163", label: "Block 163, Bukit Merah Central", postalCode: "150163", latitude: 1.2858, longitude: 103.8170, area: "Bukit Merah" },
  // Bukit Panjang
  { id: "mock-hillion-mall", label: "Hillion Mall", postalCode: "688970", latitude: 1.3800, longitude: 103.7644, area: "Bukit Panjang" },
  // Bukit Timah
  { id: "mock-beauty-world", label: "Beauty World Centre", postalCode: "588706", latitude: 1.3412, longitude: 103.7762, area: "Bukit Timah" },
  // Central Area / Downtown
  { id: "mock-raffles-place", label: "Raffles Place MRT Station", postalCode: "048583", latitude: 1.2840, longitude: 103.8514, area: "Central Area" },
  { id: "mock-suntec", label: "Suntec City", postalCode: "038988", latitude: 1.2955, longitude: 103.8580, area: "Central Area" },
  // Changi
  { id: "mock-changi-airport", label: "Changi Airport Terminal 3", postalCode: "819663", latitude: 1.3569, longitude: 103.9886, area: "Changi" },
  // Choa Chu Kang
  { id: "mock-688236", label: "1 Choa Chu Kang Grove", postalCode: "688236", latitude: 1.3854, longitude: 103.7445, area: "Choa Chu Kang" },
  { id: "mock-lot1", label: "Lot One Shoppers' Mall", postalCode: "689833", latitude: 1.3847, longitude: 103.7445, area: "Choa Chu Kang" },
  // Clementi
  { id: "mock-clementi", label: "Block 321, Clementi Avenue 3", postalCode: "129907", latitude: 1.3151, longitude: 103.7649, area: "Clementi" },
  { id: "mock-clementi-mall", label: "Clementi Mall", postalCode: "129588", latitude: 1.3150, longitude: 103.7644, area: "Clementi" },
  // Dover
  { id: "mock-sp", label: "Singapore Polytechnic", postalCode: "139651", latitude: 1.3094, longitude: 103.7795, area: "Dover" },
  // Geylang
  { id: "mock-geylang-blk2", label: "Block 2, Geylang East Avenue 2", postalCode: "389754", latitude: 1.3176, longitude: 103.8925, area: "Geylang" },
  // Hougang
  { id: "mock-hougang-mall", label: "Hougang Mall", postalCode: "538766", latitude: 1.3724, longitude: 103.8928, area: "Hougang" },
  { id: "mock-hougang-blk682", label: "Block 682, Hougang Avenue 8", postalCode: "530682", latitude: 1.3753, longitude: 103.8818, area: "Hougang" },
  // Jurong East
  { id: "mock-jurong-east", label: "Block 134, Jurong East Avenue 1", postalCode: "600134", latitude: 1.3347, longitude: 103.7436, area: "Jurong East" },
  { id: "mock-jcube", label: "JEM Shopping Mall", postalCode: "608549", latitude: 1.3331, longitude: 103.7436, area: "Jurong East" },
  // Jurong West
  { id: "mock-jw-blk501", label: "Block 501, Jurong West Street 51", postalCode: "640501", latitude: 1.3500, longitude: 103.7199, area: "Jurong West" },
  // Kallang
  { id: "mock-stadium", label: "Singapore Sports Hub", postalCode: "397630", latitude: 1.3039, longitude: 103.8753, area: "Kallang" },
  // Marine Parade
  { id: "mock-parkway", label: "Parkway Parade", postalCode: "449269", latitude: 1.3015, longitude: 103.9054, area: "Marine Parade" },
  // Novena
  { id: "mock-novena-square", label: "Novena Square", postalCode: "307684", latitude: 1.3204, longitude: 103.8438, area: "Novena" },
  // Orchard
  { id: "mock-ion", label: "ION Orchard", postalCode: "238801", latitude: 1.3040, longitude: 103.8318, area: "Orchard" },
  // Pasir Ris
  { id: "mock-whitewater", label: "White Sands Shopping Mall", postalCode: "519599", latitude: 1.3728, longitude: 103.9494, area: "Pasir Ris" },
  { id: "mock-pr-blk443", label: "Block 443, Pasir Ris Drive 6", postalCode: "510443", latitude: 1.3738, longitude: 103.9602, area: "Pasir Ris" },
  // Paya Lebar
  { id: "mock-plq", label: "Paya Lebar Quarter", postalCode: "409051", latitude: 1.3175, longitude: 103.8929, area: "Paya Lebar" },
  // Punggol
  { id: "mock-waterway-point", label: "Waterway Point", postalCode: "828761", latitude: 1.4065, longitude: 103.9023, area: "Punggol" },
  { id: "mock-punggol-blk168", label: "Block 168A, Punggol Field", postalCode: "821168", latitude: 1.3961, longitude: 103.9022, area: "Punggol" },
  // Queenstown
  { id: "mock-queensway", label: "Queensway Shopping Centre", postalCode: "149053", latitude: 1.2959, longitude: 103.8021, area: "Queenstown" },
  // Sembawang
  { id: "mock-sun-plaza", label: "Sun Plaza", postalCode: "757713", latitude: 1.4489, longitude: 103.8202, area: "Sembawang" },
  // Sengkang
  { id: "mock-compass-one", label: "Compass One", postalCode: "545078", latitude: 1.3924, longitude: 103.8953, area: "Sengkang" },
  { id: "mock-sk-blk265", label: "Block 265A, Sengkang East Way", postalCode: "541265", latitude: 1.3903, longitude: 103.8950, area: "Sengkang" },
  // Serangoon
  { id: "mock-nex", label: "NEX Shopping Mall", postalCode: "556083", latitude: 1.3507, longitude: 103.8714, area: "Serangoon" },
  // Simei
  { id: "mock-eastpoint", label: "Eastpoint Mall", postalCode: "528833", latitude: 1.3430, longitude: 103.9530, area: "Simei" },
  // Tampines
  { id: "mock-tampines-mall", label: "Tampines Mall", postalCode: "529510", latitude: 1.3530, longitude: 103.9449, area: "Tampines" },
  { id: "mock-tampines-blk201", label: "Block 201D, Tampines Street 21", postalCode: "524201", latitude: 1.3525, longitude: 103.9555, area: "Tampines" },
  // Toa Payoh
  { id: "mock-tp-hub", label: "HDB Hub, Toa Payoh", postalCode: "310480", latitude: 1.3327, longitude: 103.8494, area: "Toa Payoh" },
  { id: "mock-tp-blk190", label: "Block 190, Toa Payoh Lorong 6", postalCode: "310190", latitude: 1.3345, longitude: 103.8488, area: "Toa Payoh" },
  // Woodlands
  { id: "mock-causeway-point", label: "Causeway Point", postalCode: "738099", latitude: 1.4363, longitude: 103.7862, area: "Woodlands" },
  { id: "mock-wl-blk768", label: "Block 768, Woodlands Avenue 6", postalCode: "730768", latitude: 1.4379, longitude: 103.7949, area: "Woodlands" },
  // Yishun
  { id: "mock-northpoint", label: "Northpoint City", postalCode: "769098", latitude: 1.4296, longitude: 103.8356, area: "Yishun" },
  { id: "mock-yishun-blk292", label: "Block 292, Yishun Street 22", postalCode: "760292", latitude: 1.4313, longitude: 103.8340, area: "Yishun" },
  // Buona Vista
  { id: "mock-buona-vista", label: "Buona Vista Community Club", postalCode: "139961", latitude: 1.3074, longitude: 103.7892, area: "Buona Vista" },
  { id: "mock-one-north", label: "one-north MRT Station", postalCode: "138522", latitude: 1.2997, longitude: 103.7873, area: "Buona Vista" },
];

function toTitleCase(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (word.length === 0) return "";
      const lower = word.toLowerCase();
      if (["mrt", "lrt", "cck", "amk", "hdb", "ite", "nus", "ntu", "smu", "sutd", "sit", "ttsh", "sgh", "cgh", "ktph", "nuh", "skh", "jem", "imm", "plq", "ion"].includes(lower)) {
        return lower.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

type OneMapRawItem = {
  SEARCHVAL?: string;
  BLK_NO?: string;
  ROAD_NAME?: string;
  BUILDING?: string;
  ADDRESS?: string;
  POSTAL?: string;
  LATITUDE?: string;
  LONGITUDE?: string;
};

function parseOneMapResults(rawList: OneMapRawItem[]): AddressSuggestion[] {
  const suggestions: AddressSuggestion[] = [];
  for (const item of rawList) {
    const lat = Number(item.LATITUDE);
    const lng = Number(item.LONGITUDE);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

    const postal = item.POSTAL && item.POSTAL !== "NIL" ? item.POSTAL.trim() : "";
    const building = item.BUILDING && item.BUILDING !== "NIL" ? item.BUILDING.trim() : "";
    const road = item.ROAD_NAME && item.ROAD_NAME !== "NIL" ? item.ROAD_NAME.trim() : "";
    const blk = item.BLK_NO && item.BLK_NO !== "NIL" ? `Block ${item.BLK_NO.trim()}` : "";
    const addressStr = item.ADDRESS && item.ADDRESS !== "NIL" ? item.ADDRESS.trim() : "";
    const searchVal = item.SEARCHVAL && item.SEARCHVAL !== "NIL" ? item.SEARCHVAL.trim() : "";

    let label = "";
    if (building && building !== "NIL" && building !== searchVal) {
      label = `${building}${blk ? `, ${blk}` : ""}${road ? ` ${road}` : ""}`;
    } else if (addressStr && addressStr !== "NIL") {
      label = addressStr;
    } else if (searchVal && searchVal !== "NIL") {
      label = searchVal;
    } else {
      label = [blk, road].filter(Boolean).join(", ");
    }

    label = toTitleCase(label || "Singapore Location");
    const area = toTitleCase(road || building || "Singapore");
    const id = `onemap-${postal || `${lat.toFixed(4)}-${lng.toFixed(4)}`}-${Math.random().toString(36).slice(2, 6)}`;

    suggestions.push({
      id,
      label,
      postalCode: postal,
      latitude: lat,
      longitude: lng,
      area,
    });
  }
  return suggestions;
}

export async function searchSingaporeAddresses(query: string, signal?: AbortSignal, accessToken?: string): Promise<AddressSuggestion[]> {
  const normalized = query.trim();
  if (normalized.length < 2) return [];

  const lower = normalized.toLowerCase();

  // 1. First, try SLA Official OneMap Elastic Search (supports any 6-digit postal code, block, street, landmark in Singapore)
  try {
    const onemapUrl = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(normalized)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
    const response = await fetch(onemapUrl, {
      signal,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      const data = (await response.json()) as { results?: OneMapRawItem[] };
      if (Array.isArray(data.results) && data.results.length > 0) {
        const parsed = parseOneMapResults(data.results);
        if (parsed.length > 0) {
          return parsed.slice(0, 8);
        }
      }
    }
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    // Fallthrough to next search method
  }

  // 2. Try OpenStreetMap Nominatim Singapore Search
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(normalized)}&countrycodes=sg&format=json&addressdetails=1&limit=6`;
    const osmResponse = await fetch(nominatimUrl, {
      signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "HelpingHandsApp/1.0",
      },
    });

    if (osmResponse.ok) {
      const osmData = (await osmResponse.json()) as Array<{
        place_id: number;
        display_name: string;
        lat: string;
        lon: string;
        address?: {
          road?: string;
          suburb?: string;
          neighbourhood?: string;
          postcode?: string;
          city?: string;
        };
      }>;

      if (Array.isArray(osmData) && osmData.length > 0) {
        const osmResults: AddressSuggestion[] = osmData
          .map((item) => {
            const lat = Number(item.lat);
            const lng = Number(item.lon);
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
            const parts = item.display_name.split(",").map((p) => p.trim());
            const shortLabel = parts.slice(0, 3).join(", ");
            const postal = item.address?.postcode?.replace(/\D/g, "") ?? "";
            const area = item.address?.neighbourhood || item.address?.suburb || item.address?.road || "Singapore";

            return {
              id: `osm-${item.place_id}`,
              label: toTitleCase(shortLabel),
              postalCode: postal,
              latitude: lat,
              longitude: lng,
              area: toTitleCase(area),
            };
          })
          .filter((res): res is AddressSuggestion => res !== null);

        if (osmResults.length > 0) {
          return osmResults;
        }
      }
    }
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
  }

  // 3. Fallback: Search the comprehensive local database
  const matches = localSingaporeAddresses.filter((address) =>
    `${address.label} ${address.postalCode} ${address.area}`.toLowerCase().includes(lower)
  );

  if (matches.length > 0) {
    return matches;
  }

  // 4. If query looks like a custom address, provide a generated Singapore coordinate fallback (Central SG)
  if (normalized.length >= 3) {
    return [
      {
        id: `custom-${Date.now()}`,
        label: toTitleCase(normalized),
        postalCode: normalized.match(/\b\d{6}\b/)?.[0] || "",
        latitude: 1.3521,
        longitude: 103.8198,
        area: toTitleCase(normalized.split(",")[0] || "Singapore"),
      },
    ];
  }

  return [];
}

