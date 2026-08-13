import { router } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../components/layout/AppScreen";
import { BackHeader } from "../../components/layout/BackHeader";
import { Divider } from "../../components/ui/Divider";
import { ImagePlaceholder } from "../../components/ui/ImagePlaceholder";
import { Steps } from "../../components/ui/Steps";
import { WireButton } from "../../components/ui/WireButton";
import { AvatarPlaceholder } from "../../components/ui/AvatarPlaceholder";
import { Surface } from "../../components/ui/Surface";
import { mockElder } from "../../data/mockData";
import { useApp } from "../../state/AppProvider";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { Icon } from "../../components/ui/Icon";

export default function TaskScreen() {
  const { requestStatus, setRequestStatus } = useApp();
  const active = requestStatus === "done" ? 2 : 1;

  return (
    <AppScreen tone="oat">
      <BackHeader title="Active task" eyebrow="Your commitment" />
      <Steps items={["Accepted", "In progress", "Completed"]} active={active} />
      <Divider />
      <View style={styles.content}>
        <Text style={styles.heading}>Grocery assistance</Text>
        <Text style={styles.intro}>Wednesday, 22 January · 10:00 AM</Text>
        <Surface style={styles.locationCard}><Icon name="location-on" size={24} color={colors.forest} label="Location" /><View style={styles.copy}><Text style={styles.cardLabel}>Meet at</Text><Text style={styles.location}>Block 134, Jurong East Ave 1</Text></View></Surface>
        <Divider label="Requesting elder" />
        <Surface style={styles.personCard}><AvatarPlaceholder size={56} /><View style={styles.copy}><Text style={styles.personName}>{mockElder.name}</Text><Text style={styles.details}>{mockElder.details}</Text></View><View style={styles.contact}><Icon name="call" size={23} color={colors.forest} label="Call elder" /><Icon name="chat-bubble" size={23} color={colors.forest} label="Message elder" /></View></Surface>
        <Surface tone="sand" style={styles.notes}><Text style={styles.noteLabel}>Please keep in mind</Text><Text style={styles.noteText}>{mockElder.mobilityNotes}</Text></Surface>
        {requestStatus === "done" ? <Surface tone="sage" style={styles.completed}><Text style={styles.completedText}>Task marked as completed</Text><WireButton label="Find another request" outline onPress={() => router.replace("/volunteer/requests")} /></Surface> : <WireButton label="Mark task as complete" onPress={() => { setRequestStatus("done"); Alert.alert("Task completed", "The elder can now confirm the outcome."); }} />}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24 },
  heading: { ...typography.title, color: colors.ink, marginTop: 12 },
  intro: { ...typography.bodyText, color: colors.gray, marginTop: 6, marginBottom: 20 },
  locationCard: { flexDirection: "row", gap: 12, alignItems: "center" },
  copy: { flex: 1 },
  cardLabel: { ...typography.label, color: colors.muted, textTransform: "uppercase", marginBottom: 4 },
  location: { ...typography.bodyText, color: colors.ink },
  personCard: { flexDirection: "row", gap: 12, alignItems: "center" },
  personName: { ...typography.bodyStrong, color: colors.ink, marginBottom: 3 },
  details: { ...typography.small, color: colors.gray },
  contact: { flexDirection: "row", gap: 14 },
  notes: { marginBottom: 16 },
  noteLabel: { ...typography.label, color: colors.marigold, textTransform: "uppercase", marginBottom: 5 },
  noteText: { ...typography.bodyText, color: colors.ink },
  completed: { marginTop: 4 },
  completedText: { ...typography.bodyStrong, color: colors.forestDark, marginBottom: 10 },
});
