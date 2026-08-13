import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AppScreen } from "../../components/layout/AppScreen";
import { BackHeader } from "../../components/layout/BackHeader";
import { RequestCard } from "../../components/help/RequestCard";
import { availableRequests } from "../../data/mockData";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { Icon } from "../../components/ui/Icon";

const filters = ["All", "Groceries", "Medicine", "Appointments", "Digital help"];

export default function RequestsScreen() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const requests = useMemo(() => availableRequests.filter((request) => {
    const matchesQuery = request.title.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "All" || request.title.toLowerCase().includes(filter.toLowerCase().replace("appointments", "appointment").replace("digital help", "digital"));
    return matchesQuery && matchesFilter;
  }), [filter, query]);

  return (
    <AppScreen tone="oat">
      <BackHeader title="Available requests" eyebrow="Volunteer home" />
      <View style={styles.content}>
        <Text style={styles.heading}>Ways to lend a hand</Text>
        <Text style={styles.intro}>Requests near you, ready when you are.</Text>
        <View style={styles.search}><Icon name="search" size={24} color={colors.muted} label="Search" /><TextInput accessibilityLabel="Search requests" value={query} onChangeText={setQuery} placeholder="Search by type or place" placeholderTextColor={colors.muted} style={styles.searchInput} /></View>
        <View style={styles.filters}>{filters.map((item) => <Pressable key={item} accessibilityRole="button" accessibilityState={{ selected: filter === item }} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.selectedFilter]}><Text style={[styles.filterText, filter === item && styles.selectedFilterText]}>{item}</Text></Pressable>)}</View>
        <Text style={styles.results}>{requests.length} requests available</Text>
        {requests.length ? requests.map((request) => <RequestCard key={request.title} {...request} onAccept={() => router.push("/volunteer/task")} />) : <View style={styles.empty}><Text style={styles.emptyTitle}>No matching requests</Text><Text style={styles.emptyBody}>Try another category or search term.</Text></View>}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { backgroundColor: colors.oat, padding: 24, flex: 1 },
  heading: { ...typography.title, color: colors.ink, marginTop: 20 },
  intro: { ...typography.bodyText, color: colors.gray, marginTop: 6, marginBottom: 20 },
  search: { minHeight: 54, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, backgroundColor: colors.white, flexDirection: "row", alignItems: "center", paddingHorizontal: 15, marginBottom: 14 },
  searchInput: { flex: 1, color: colors.ink, fontSize: 16, marginLeft: 10 },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  filter: { minHeight: 38, paddingHorizontal: 14, borderWidth: 1.2, borderColor: colors.border, borderRadius: 12, justifyContent: "center", backgroundColor: colors.white },
  selectedFilter: { backgroundColor: colors.ink, borderColor: colors.ink },
  filterText: { color: colors.gray, fontSize: 13, fontWeight: "700" },
  selectedFilterText: { color: colors.white },
  results: { ...typography.label, color: colors.muted, textTransform: "uppercase", marginBottom: 10 },
  empty: { backgroundColor: colors.white, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 24, alignItems: "center" },
  emptyTitle: { color: colors.ink, ...typography.bodyStrong, marginBottom: 5 },
  emptyBody: { color: colors.gray, ...typography.small },
});
