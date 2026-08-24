import { router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../components/layout/AppScreen";
import { BackHeader } from "../../components/layout/BackHeader";
import { CategoryTile } from "../../components/ui/CategoryTile";
import { WireButton } from "../../components/ui/WireButton";
import { WireInput } from "../../components/ui/WireInput";
import { DateTimeField } from "../../components/request/DateTimeField";
import { SingaporeAddressField } from "../../components/request/SingaporeAddressField";
import { assistanceCategories } from "../../data/mockData";
import { useApp } from "../../state/AppProvider";
import type { RequestDraft, SelectedAddress } from "../../state/AppProvider";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { createSharedRequest } from "../../services/requests";

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
  const { account, category, setCategory, submitRequest, requestDraft } = useApp();
  const [notes, setNotes] = useState(requestDraft.notes ?? "");
  const [selectedDate, setSelectedDate] = useState<Date | null>(requestDraft.scheduledAt ? new Date(requestDraft.scheduledAt) : null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(requestDraft.scheduledAt ? new Date(requestDraft.scheduledAt) : null);
  const [address, setAddress] = useState<SelectedAddress | null>(requestDraft.address);
  const [submitted, setSubmitted] = useState(false);

  const [deliveryMode, setDeliveryMode] = useState<"house" | "meet">("house");
  const [unitNumber, setUnitNumber] = useState("");
  const [meetLocation, setMeetLocation] = useState("");

  const isGrocery = category === "Groceries";
  const isMeetThere = isGrocery && deliveryMode === "meet";

  const missingDate = submitted && !selectedDate;
  const missingTime = submitted && !selectedTime;
  const missingAddress = submitted && !isMeetThere && !address;
  const missingMeetLocation = submitted && isMeetThere && !meetLocation.trim();
  const valid = Boolean(selectedDate && selectedTime && (isMeetThere ? meetLocation.trim() : address));

  const submit = () => {
    setSubmitted(true);
    if (!selectedDate || !selectedTime) return;
    if (isMeetThere && !meetLocation.trim()) return;
    if (!isMeetThere && !address) return;

    const draftDate = new Date(selectedDate);
    const draftTime = new Date(selectedTime);
    const normalizedDate = singaporeFormatter.format(draftDate);
    const normalizedTime = timeFormatter.format(draftTime);

    let effectiveAddress: SelectedAddress;
    let preferenceSummary = "";

    if (isGrocery) {
      if (deliveryMode === "house") {
        effectiveAddress = address!;
        preferenceSummary = `[Delivery to Doorstep: Unit ${unitNumber.trim() || "Not specified"}]`;
      } else {
        effectiveAddress = {
          id: `meet-${Date.now()}`,
          label: meetLocation.trim(),
          postalCode: meetLocation.match(/\b\d{6}\b/)?.[0] || "",
          latitude: 1.3521,
          longitude: 103.8198,
          area: meetLocation.trim().split(",")[0] || "Supermarket",
        };
        preferenceSummary = `[Meet at Store: ${meetLocation.trim()}]`;
      }
    } else {
      effectiveAddress = address!;
    }

    const combinedNotes = [preferenceSummary, notes.trim()].filter(Boolean).join(" · ");

    const nextDraft: Omit<RequestDraft, "sharedRequestId"> = {
      scheduledAt: singaporeDateTime(draftDate, draftTime),
      timezone: "Asia/Singapore",
      displayDate: normalizedDate,
      displayTime: normalizedTime,
      address: effectiveAddress,
      notes: combinedNotes,
    };
    const token = account.authAccessToken || "mock-access-token";
    const email = account.email || "elder@helpinghands.sg";
    const name = account.name || "Elderly User";
    const phone = account.phone || "91234567";

    void createSharedRequest(token, {
      accountEmail: email,
      accountName: name,
      accountPhone: phone,
      category,
      draft: { ...requestDraft, ...nextDraft },
    })
      .then((sharedRequest) => {
        submitRequest({ ...nextDraft, sharedRequestId: sharedRequest.id });
        router.push("/elder/request-status");
      })
      .catch(() => {
        submitRequest({ ...nextDraft, sharedRequestId: `request-${Date.now()}` });
        router.push("/elder/request-status");
      });
  };

  return (
    <AppScreen tone="oat">
      <BackHeader title="Request help" eyebrow="Step 2 of 2" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.content}>
        <Text style={styles.heading}>What would you like a hand with?</Text>
        <Text style={styles.intro}>Choose the closest match. You can add more detail below.</Text>
        <View style={styles.categories}>{assistanceCategories.map((item) => <CategoryTile key={item.label} {...item} selected={category === item.label} onPress={() => setCategory(item.label)} />)}</View>

        {isGrocery ? (
          <View style={styles.deliverySection}>
            <Text style={styles.label}>Delivery or Meeting preference</Text>
            <View style={styles.deliveryToggle}>
              <Pressable
                onPress={() => setDeliveryMode("house")}
                style={[styles.toggleBtn, deliveryMode === "house" && styles.toggleBtnActive]}
              >
                <Text style={[styles.toggleBtnText, deliveryMode === "house" && styles.toggleBtnTextActive]}>
                  Send to my house
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setDeliveryMode("meet")}
                style={[styles.toggleBtn, deliveryMode === "meet" && styles.toggleBtnActive]}
              >
                <Text style={[styles.toggleBtnText, deliveryMode === "meet" && styles.toggleBtnTextActive]}>
                  Meet me there
                </Text>
              </Pressable>
            </View>

            {deliveryMode === "house" ? (
              <WireInput
                label="House details / Unit number"
                placeholder="e.g. #08-456, Lift Lobby A"
                value={unitNumber}
                onChangeText={setUnitNumber}
                helperText="Your volunteer will deliver the groceries directly to this unit."
              />
            ) : (
              <WireInput
                label="Meeting location / Supermarket"
                placeholder="e.g. FairPrice Finest at AMK Hub, Level B1"
                value={meetLocation}
                onChangeText={setMeetLocation}
                error={missingMeetLocation ? "Enter the meeting location or supermarket name." : undefined}
                helperText="State where you would like to meet your volunteer."
              />
            )}
          </View>
        ) : null}

        <View style={styles.sectionLabel}><Text style={styles.label}>When and where</Text></View>
        <View style={styles.row}><View style={styles.half}><DateTimeField label="Preferred date" mode="date" value={selectedDate} onChange={(date) => { setSelectedDate(date); setSelectedTime((current) => current ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), current.getHours(), current.getMinutes()) : null); }} onTimeChange={setSelectedTime} error={missingDate ? "Choose a future date." : undefined} /></View><View style={styles.half}><DateTimeField label="Preferred time" mode="time" value={selectedTime} onChange={setSelectedTime} error={missingTime ? "Choose a time." : undefined} /></View></View>
        
        {/* Only show General Location if NOT 'Meet me there' */}
        {!isMeetThere ? (
          <SingaporeAddressField
            value={address}
            onChange={setAddress}
            error={missingAddress ? "Enter a general location or address before sending your request." : undefined}
          />
        ) : null}

        <WireInput label="Anything your volunteer should know?" placeholder="Mobility notes or specific grocery items (optional)" multiline numberOfLines={3} value={notes} onChangeText={setNotes} style={styles.notes} />
        {!valid && submitted ? <Text style={styles.formError}>{isMeetThere ? "Choose a date, time, and meeting location before sending your request." : "Choose a date, time, and general location before sending your request."}</Text> : null}
        <WireButton label="Send request" onPress={submit} />
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
  deliverySection: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 18, marginBottom: 8 },
  deliveryToggle: { flexDirection: "row", gap: 8, marginTop: 8, marginBottom: 14 },
  toggleBtn: { flex: 1, minHeight: 46, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white, borderRadius: 8, alignItems: "center", justifyContent: "center", paddingHorizontal: 6 },
  toggleBtnActive: { borderColor: colors.ink, backgroundColor: colors.sage },
  toggleBtnText: { ...typography.small, color: colors.gray, fontWeight: "600" },
  toggleBtnTextActive: { color: colors.ink, fontWeight: "800" },
  row: { flexDirection: "row", gap: 10 },
  half: { flex: 1 },
  notes: { minHeight: 100, borderRadius: 14, paddingTop: 14, textAlignVertical: "top" },
  formError: { color: colors.coral, ...typography.small, marginBottom: 10 },
});
