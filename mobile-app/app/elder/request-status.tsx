import { router } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../components/layout/AppScreen";
import { BackHeader } from "../../components/layout/BackHeader";
import { VolunteerCard } from "../../components/help/VolunteerCard";
import { Divider } from "../../components/ui/Divider";
import { Steps } from "../../components/ui/Steps";
import { WireButton } from "../../components/ui/WireButton";
import { Surface } from "../../components/ui/Surface";
import { Icon } from "../../components/ui/Icon";
import { mockVolunteer } from "../../data/mockData";
import { useApp } from "../../state/AppProvider";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

const statuses = ["pending", "accepted", "inProgress", "done"] as const;

export default function RequestStatusScreen() {
  const { requestStatus, setRequestStatus, requestDraft } = useApp();
  const active = Math.max(0, statuses.indexOf(requestStatus));
  return (
    <AppScreen tone="oat">
      <BackHeader title="Request status" eyebrow="Your help request" />
      <View style={styles.canvas}>
        <Steps items={["Pending", "Accepted", "In progress", "Done"]} active={active} onStepPress={(index) => setRequestStatus(statuses[index])} />
        <View style={styles.content}>
          <Surface tone="sage" style={styles.match}><Text style={styles.check}>✓</Text><View style={styles.matchCopy}><Text style={styles.matchTitle}>Volunteer matched</Text><Text style={styles.details}>{requestDraft.displayDate || mockVolunteer.task} {requestDraft.displayTime ? `· ${requestDraft.displayTime}` : ""}</Text></View></Surface>
          <Surface style={styles.schedule}><View style={styles.scheduleRow}><Icon name="event" size={23} color={colors.forest} label="Scheduled date" /><View><Text style={styles.scheduleLabel}>Scheduled for</Text><Text style={styles.scheduleValue}>{requestDraft.displayDate || "Date to be confirmed"}</Text></View></View><View style={styles.scheduleRow}><Icon name="schedule" size={23} color={colors.forest} label="Scheduled time" /><View><Text style={styles.scheduleLabel}>Time</Text><Text style={styles.scheduleValue}>{requestDraft.displayTime || "Time to be confirmed"} · Singapore time</Text></View></View><View style={styles.scheduleRow}><Icon name="location-on" size={23} color={colors.forest} label="General location" /><View><Text style={styles.scheduleLabel}>General location</Text><Text style={styles.scheduleValue}>{requestDraft.address?.area || "Location to be confirmed"}</Text></View></View></Surface>
          <Divider label="Your volunteer" />
          <VolunteerCard name={mockVolunteer.name} rating={mockVolunteer.rating} onCall={() => Alert.alert("Call volunteer", "Calling is available in the connected app.")} onMessage={() => Alert.alert("Message volunteer", "Messaging is available in the connected app.")} />
          <View style={styles.actions}><WireButton label="Cancel request" outline destructive onPress={() => Alert.alert("Cancel request?", "This request can be cancelled before it begins.", [{ text: "Keep request", style: "cancel" }, { text: "Cancel request", style: "destructive", onPress: () => setRequestStatus("pending") }])} /><WireButton label="Reschedule" outline onPress={() => Alert.alert("Reschedule request", "Date and time editing will be connected in the next phase.")} /></View>
          {requestStatus === "done" ? <WireButton label="Rate your volunteer" onPress={() => router.push("/elder/rating")} /> : null}
          <Text style={styles.tip}>Your exact address is shared with the volunteer only after they accept your request.</Text>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  canvas: { backgroundColor: colors.oat, flex: 1 },
  content: { padding: 24 },
  match: { flexDirection: "row", gap: 12, alignItems: "center" },
  check: { color: colors.forest, fontSize: 30, fontWeight: "800" },
  matchCopy: { flex: 1 },
  matchTitle: { color: colors.forestDark, ...typography.bodyStrong, marginBottom: 4 },
  details: { color: colors.gray, ...typography.small },
  schedule: { gap: 14, marginTop: 14 },
  scheduleRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  scheduleLabel: { ...typography.label, color: colors.muted, textTransform: "uppercase", marginBottom: 2 },
  scheduleValue: { ...typography.bodyText, color: colors.ink },
  actions: { flexDirection: "row", gap: 10 },
  tip: { color: colors.gray, ...typography.small, textAlign: "center", marginTop: 6 },
});
