import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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

  useEffect(() => {
    const normalized = query.trim();
    if (value && normalized === value.label) return;
    onChange(null);
    setSearchError("");
    if (normalized.length < 3) {
      setResults([]);
      setLoading(false);
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
        if (id === requestId.current) setResults(suggestions.slice(0, 5));
      } catch (cause) {
        if ((cause as Error).name !== "AbortError" && id === requestId.current) setSearchError("We couldn’t search right now. Check your connection and try again.");
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, value, onChange]);

  const choose = (address: AddressSuggestion) => {
    setQuery(address.label);
    setResults([]);
    setSearchError("");
    onChange(address);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>General location</Text>
      <View style={[styles.inputWrap, value && styles.selectedInput, error && styles.errorInput]}>
        <Icon name="location-on" size={23} color={value ? colors.forest : colors.muted} label="Singapore location" />
        <TextInput accessibilityRole="combobox" accessibilityLabel="Search Singapore address" value={query} onChangeText={setQuery} placeholder="Search a Singapore address" placeholderTextColor={colors.muted} style={styles.input} autoCapitalize="words" />
        {loading ? <ActivityIndicator color={colors.forest} /> : value ? <Icon name="check-circle" size={23} color={colors.forest} label="Address selected" /> : null}
      </View>
      <Text style={styles.helper}>Choose an address from Singapore’s official results. Your exact address is shared only after acceptance.</Text>
      {loading ? <Text style={styles.status}>Searching Singapore addresses…</Text> : null}
      {!loading && !searchError && query.trim().length >= 3 && !value && results.length === 0 ? <Text style={styles.status}>No Singapore addresses found. Try a road, block, building, or postal code.</Text> : null}
      {searchError ? <Text style={styles.error}>{searchError}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {results.length > 0 ? <View style={styles.results}>{results.map((address) => <Pressable key={address.id} accessibilityRole="button" accessibilityLabel={`Select ${address.label}, Singapore ${address.postalCode}`} onPress={() => choose(address)} style={({ pressed }) => [styles.result, pressed && styles.pressed]}><Icon name="location-on" size={22} color={colors.forest} /><View style={styles.resultCopy}><Text style={styles.resultLabel}>{address.label}</Text><Text style={styles.resultMeta}>{address.area} · Singapore {address.postalCode}</Text></View></Pressable>)}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  label: { ...typography.label, color: colors.ink, textTransform: "uppercase", marginBottom: 6 },
  inputWrap: { minHeight: 58, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 14, backgroundColor: colors.white, flexDirection: "row", alignItems: "center", gap: 10 },
  selectedInput: { borderColor: colors.forest, backgroundColor: colors.sageSoft },
  errorInput: { borderColor: colors.coral, backgroundColor: colors.coralSoft },
  input: { flex: 1, color: colors.ink, fontSize: 16, minHeight: 52 },
  helper: { color: colors.gray, ...typography.small, marginTop: 7 },
  status: { color: colors.muted, ...typography.small, marginTop: 8 },
  error: { color: colors.coral, ...typography.small, marginTop: 8 },
  results: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 14, marginTop: 8, overflow: "hidden" },
  result: { minHeight: 68, padding: 12, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  resultCopy: { flex: 1 },
  resultLabel: { color: colors.ink, ...typography.bodyStrong },
  resultMeta: { color: colors.gray, ...typography.small, marginTop: 3 },
  pressed: { backgroundColor: colors.sageSoft },
});
