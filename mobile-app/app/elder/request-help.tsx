import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../components/layout/AppScreen";
import { BackHeader } from "../../components/layout/BackHeader";
import { CategoryTile } from "../../components/ui/CategoryTile";
import { WireButton } from "../../components/ui/WireButton";
import { WireInput } from "../../components/ui/WireInput";
import { DateTimeField } from "../../components/request/DateTimeField";
import { SingaporeAddressField } from "../../components/request/SingaporeAddressField";
import { assistanceCategories } from "../../data/mockData";
import { useApp } from "../../state/AppProvider";
import type { SelectedAddress } from "../../state/AppProvider";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

const singaporeFormatter = new Intl.DateTimeFormat("en-SG", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Singapore" });
const timeFormatter = new Intl.DateTimeFormat("en-SG", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Singapore" });

function singaporeDateTime(date: Date, time: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Singapore", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return `${year}-${month}-${day}T${String(time.getHours()).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}:00+08:00`;
}

export default function RequestHelpScreen() {
  const { category, setCategory, setRequestStatus, requestDraft, setRequestDraft } = useApp();
  const [notes, setNotes] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(requestDraft.scheduledAt ? new Date(requestDraft.scheduledAt) : null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(requestDraft.scheduledAt ? new Date(requestDraft.scheduledAt) : null);
  const [address, setAddress] = useState<SelectedAddress | null>(requestDraft.address);
  const [submitted, setSubmitted] = useState(false);

  const valid = Boolean(selectedDate && selectedTime && address);
  const submit = () => {
    setSubmitted(true);
    if (!selectedDate || !selectedTime || !address) return;
    setRequestDraft({
      scheduledAt: singaporeDateTime(selectedDate, selectedTime),
      timezone: "Asia/Singapore",
      displayDate: singaporeFormatter.format(selectedDate),
      displayTime: timeFormatter.format(selectedTime),
      address,
    });
    setRequestStatus("accepted");
    router.push("/elder/request-status");
  };

  return (
    <AppScreen tone="oat">
      <BackHeader title="Request help" eyebrow="Step 2 of 2" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.content}>
        <Text style={styles.heading}>What would you like a hand with?</Text>
        <Text style={styles.intro}>Choose the closest match. You can add more detail below.</Text>
        <View style={styles.categories}>{assistanceCategories.map((item) => <CategoryTile key={item.label} {...item} selected={category === item.label} onPress={() => setCategory(item.label)} />)}</View>
        <View style={styles.sectionLabel}><Text style={styles.label}>When and where</Text></View>
        <View style={styles.row}><View style={styles.half}><DateTimeField label="Preferred date" mode="date" value={selectedDate} onChange={(date) => { setSelectedDate(date); setSelectedTime((current) => current ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), current.getHours(), current.getMinutes()) : null); }} onTimeChange={setSelectedTime} error={submitted && !selectedDate ? "Choose a future date." : undefined} /></View><View style={styles.half}><DateTimeField label="Preferred time" mode="time" value={selectedTime} onChange={setSelectedTime} error={submitted && !selectedTime ? "Choose a time." : undefined} /></View></View>
        <SingaporeAddressField value={address} onChange={setAddress} error={submitted && !address ? "Choose a Singapore address from the results." : undefined} />
        <WireInput label="Anything your volunteer should know?" placeholder="Mobility notes (optional)" multiline numberOfLines={3} value={notes} onChangeText={setNotes} style={styles.notes} />
        {!valid && submitted ? <Text style={styles.formError}>Choose a date, time, and Singapore address before sending your request.</Text> : null}
        <WireButton label="Send request" disabled={!valid} onPress={submit} />
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24 },
  heading: { ...typography.title, color: colors.ink, marginTop: 22 },
  intro: { ...typography.bodyText, color: colors.gray, marginTop: 7, marginBottom: 22 },
  categories: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 10, marginBottom: 26 },
  sectionLabel: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 20, marginBottom: 12 },
  label: { ...typography.label, color: colors.ink, textTransform: "uppercase" },
  row: { flexDirection: "row", gap: 10 },
  half: { flex: 1 },
  notes: { minHeight: 100, borderRadius: 14, paddingTop: 14, textAlignVertical: "top" },
  formError: { color: colors.coral, ...typography.small, marginBottom: 10 },
});
