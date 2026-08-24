import { createElement, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Linking, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import type { SelectedAddress } from "../../state/AppProvider";
import { searchSingaporeAddresses, type AddressSuggestion } from "../../services/onemap";
import { Icon } from "../ui/Icon";

type Props = { value: SelectedAddress | null; onChange: (address: SelectedAddress | null) => void; error?: string };

export function SingaporeAddressField({ value, onChange, error }: Props) {
  const [query, setQuery] = useState(value?.label ?? "");
  const [results, setResults] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const requestId = useRef(0);
  const controller = useRef<AbortController | null>(null);

  const choose = (address: AddressSuggestion) => {
    setQuery(address.label);
    setResults([]);
    setSearchError("");
    onChange(address);
  };

  const handleCustomUse = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const customAddress: SelectedAddress = {
      id: `manual-${Date.now()}`,
      label: trimmed,
      postalCode: trimmed.match(/\b\d{6}\b/)?.[0] || "",
      latitude: 1.3521,
      longitude: 103.8198,
      area: trimmed.split(",")[0] || "Singapore",
    };
    choose(customAddress);
  };

  const mapCenter = value;
  const openGoogleMaps = () => {
    if (!mapCenter) return;
    const queryParam = encodeURIComponent(`${mapCenter.label}, Singapore ${mapCenter.postalCode}`);
    const url = Platform.select({
      ios: `maps:0,0?q=${queryParam}`,
      android: `geo:${mapCenter.latitude},${mapCenter.longitude}?q=${queryParam}`,
      default: `https://www.google.com/maps/search/?api=1&query=${mapCenter.latitude},${mapCenter.longitude}`,
    });
    void Linking.openURL(url || `https://www.google.com/maps/search/?api=1&query=${mapCenter.latitude},${mapCenter.longitude}`).catch(() => {
      void Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${mapCenter.latitude},${mapCenter.longitude}`);
    });
  };

  useEffect(() => {
    const normalized = query.trim();
    if (value && normalized === value.label) return;

    if (normalized.length < 2) {
      setResults([]);
      setLoading(false);
      setSearchError("");
      onChange(null);
      return;
    }

    const id = ++requestId.current;
    const timeout = setTimeout(async () => {
      controller.current?.abort();
      const nextController = new AbortController();
      controller.current = nextController;
      setLoading(true);
      try {
        const suggestions = await searchSingaporeAddresses(normalized, nextController.signal);
        if (id === requestId.current) {
          setResults(suggestions.slice(0, 7));
          if (suggestions.length === 0) {
            onChange(null);
          }
        }
      } catch (cause) {
        if ((cause as Error).name !== "AbortError" && id === requestId.current) {
          setSearchError("Location search is unavailable right now. Please try again.");
          setResults([]);
        }
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query, value, onChange]);

  const mapTileUrl = mapCenter
    ? `https://static-maps.yandex.ru/1.x/?ll=${mapCenter.longitude.toFixed(5)},${mapCenter.latitude.toFixed(5)}&z=16&l=map&size=450,190&pt=${mapCenter.longitude.toFixed(5)},${mapCenter.latitude.toFixed(5)},pm2rdm`
    : null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>General location</Text>
      <View style={[styles.inputWrap, results.length > 0 && styles.openInput, value && styles.selectedInput, error && styles.errorInput]}>
        <Icon name="search" size={22} color={value ? colors.forest : colors.muted} label="Search Singapore locations" />
        <TextInput
          accessibilityRole="combobox"
          accessibilityLabel="Search Singapore address"
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (value && text !== value.label) onChange(null);
          }}
          placeholder="Enter house address, block, or 6-digit postal code"
          placeholderTextColor={colors.muted}
          style={styles.input}
          autoCapitalize="words"
          returnKeyType="search"
        />
        {loading ? (
          <ActivityIndicator color={colors.forest} />
        ) : value ? (
          <Pressable
            onPress={() => {
              setQuery("");
              onChange(null);
            }}
            hitSlop={8}
          >
            <Icon name="check-circle" size={23} color={colors.forest} label="Address selected, tap to clear" />
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.helper}>Type any Singapore postal code (e.g. 560123), street, or landmark.</Text>
      {loading ? <Text style={styles.status}>Searching Singapore official address database...</Text> : null}
      {!loading && query.trim().length >= 2 && !value && results.length === 0 && !searchError ? (
        <View style={styles.notFoundRow}>
          <Text style={styles.status}>No exact match found.</Text>
          <Pressable onPress={handleCustomUse} style={styles.useCustomBtn}>
            <Text style={styles.useCustomText}>Use "{query.trim()}" as address</Text>
          </Pressable>
        </View>
      ) : null}
      {searchError ? <Text style={styles.error}>{searchError}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {results.length > 0 ? (
        <View style={styles.results}>
          {results.map((address, index) => (
            <Pressable
              key={address.id}
              accessibilityRole="button"
              accessibilityLabel={`Select ${address.label}`}
              onPress={() => choose(address)}
              style={({ pressed }) => [styles.result, pressed && styles.pressed]}
            >
              <View style={styles.pin}>
                <Text style={styles.pinText}>{index + 1}</Text>
              </View>
              <View style={styles.resultCopy}>
                <Text style={styles.resultLabel}>{address.label}</Text>
                <Text style={styles.resultMeta}>
                  {address.area} {address.postalCode ? ` · Singapore ${address.postalCode}` : ""}
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color={colors.muted} label="Select location" />
            </Pressable>
          ))}
        </View>
      ) : null}

      {mapCenter ? (
        <View style={styles.mapWrap}>
          {Platform.OS === "web" ? (
            <View style={styles.webMap}>
              {createElement("iframe", {
                title: `Map of ${mapCenter.label}`,
                src: `https://www.google.com/maps?q=${encodeURIComponent(`${mapCenter.label}, Singapore ${mapCenter.postalCode}`)}&output=embed`,
                style: styles.webMapFrame,
                loading: "lazy",
                referrerPolicy: "no-referrer-when-downgrade",
              })}
            </View>
          ) : (
            <View style={styles.nativeMapCard}>
              {mapTileUrl ? (
                <Image
                  source={{ uri: mapTileUrl }}
                  style={styles.mapImage}
                  resizeMode="cover"
                />
              ) : null}
              <View style={styles.mapPinBadge}>
                <Icon name="location-on" size={20} color={colors.forest} label="Location marker" />
                <Text style={styles.mapPinText} numberOfLines={1}>
                  {mapCenter.label}
                </Text>
              </View>
            </View>
          )}
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Open location in Google Maps"
            onPress={openGoogleMaps}
            style={styles.webMapLink}
          >
            <Icon name="map" size={18} color={colors.forest} label="Map" />
            <Text style={styles.webMapTitle}>Open location in Google Maps</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  label: { ...typography.label, color: colors.ink, textTransform: "uppercase", marginBottom: 6 },
  inputWrap: { minHeight: 54, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: 0, paddingHorizontal: 12, backgroundColor: colors.oat, flexDirection: "row", alignItems: "center", gap: 10, zIndex: 2 },
  openInput: { borderColor: colors.ink, borderBottomColor: colors.border },
  selectedInput: { borderColor: colors.forest, backgroundColor: colors.sageSoft },
  errorInput: { borderColor: colors.coral, backgroundColor: colors.coralSoft },
  input: { flex: 1, color: colors.ink, fontSize: 16, minHeight: 52 },
  helper: { color: colors.gray, ...typography.small, marginTop: 7 },
  status: { color: colors.muted, ...typography.small, marginTop: 8 },
  error: { color: colors.coral, ...typography.small, marginTop: 8 },
  notFoundRow: { marginTop: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 },
  useCustomBtn: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.sage, borderRadius: 6 },
  useCustomText: { color: colors.forestDark, fontSize: 13, fontWeight: "700" },
  results: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.ink, borderTopWidth: 0, marginTop: 0, overflow: "hidden", zIndex: 3, elevation: 4 },
  result: { minHeight: 68, padding: 12, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  pin: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.forest, alignItems: "center", justifyContent: "center" },
  pinText: { color: colors.white, fontSize: 12, fontWeight: "700" },
  resultCopy: { flex: 1 },
  resultLabel: { color: colors.ink, ...typography.bodyStrong },
  resultMeta: { color: colors.gray, ...typography.small, marginTop: 3 },
  pressed: { backgroundColor: colors.sageSoft },
  mapWrap: { marginTop: 12, overflow: "hidden", borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.sageSoft },
  mapImage: { width: "100%", height: 180, backgroundColor: colors.sageSoft },
  nativeMapCard: { position: "relative", width: "100%", height: 180, backgroundColor: colors.sageSoft },
  mapPinBadge: { position: "absolute", bottom: 10, left: 10, right: 10, backgroundColor: "rgba(255, 255, 255, 0.94)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderColor: colors.border },
  mapPinText: { color: colors.ink, fontSize: 13, fontWeight: "700", flex: 1 },
  webMap: { backgroundColor: colors.sageSoft },
  webMapFrame: { width: "100%", height: 190, borderWidth: 0 },
  webMapLink: { minHeight: 44, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border },
  webMapTitle: { color: colors.forestDark, ...typography.bodyStrong },
});

