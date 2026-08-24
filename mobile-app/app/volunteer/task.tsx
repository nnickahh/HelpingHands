import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../components/layout/AppScreen";
import { BackHeader } from "../../components/layout/BackHeader";
import { Divider } from "../../components/ui/Divider";
import { ImagePlaceholder } from "../../components/ui/ImagePlaceholder";
import { Steps } from "../../components/ui/Steps";
import { WireButton } from "../../components/ui/WireButton";
import { AvatarPlaceholder } from "../../components/ui/AvatarPlaceholder";
import { Surface } from "../../components/ui/Surface";
import { useApp } from "../../state/AppProvider";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { Icon } from "../../components/ui/Icon";
import { openPhoneContact } from "../../services/contact";

export default function TaskScreen() {
  const { requestStatus, setRequestStatus, requestOwner, requestDraft, category } = useApp();
  const active = requestStatus === "done" ? 2 : 1;

  const handleCallElder = async () => {
    const phone = requestOwner?.phone ?? null;
    if (!phone) {
      Alert.alert("No contact", "No elder contact is available.");
      return;
    }
    if (!(await openPhoneContact(phone, "call"))) Alert.alert("Unable to call", "Your device cannot open the phone dialer right now.");
  };

  const handleMessageElder = () => {
    router.push("/volunteer/chat");
  };

  return (
    <AppScreen tone="oat">
      <BackHeader title="Active task" eyebrow="Your commitment" />
      <Steps items={["Accepted", "In progress", "Completed"]} active={active} />
      <Divider />
      <View style={styles.content}>
        <Text style={styles.heading}>{requestDraft.displayDate ? `${category} assistance` : "Grocery assistance"}</Text>
        <Text style={styles.intro}>{requestDraft.displayDate ? `${requestDraft.displayDate} · ${requestDraft.displayTime}` : "Wednesday, 22 January · 10:00 AM"}</Text>
        <Surface style={styles.locationCard}>
          <Icon name="location-on" size={24} color={colors.forest} label="Location" />
          <View style={styles.copy}>
            <Text style={styles.cardLabel}>Requested elderly address</Text>
            <Text style={styles.location}>{requestDraft.address?.label ?? "Block 134, Jurong East Ave 1"}</Text>
          </View>
        </Surface>
        <Divider label="Requesting elder" />
        <Surface style={styles.personCard}>
          <AvatarPlaceholder size={56} />
          <View style={styles.copy}>
            <Text style={styles.personName}>{requestOwner?.name ?? "Requesting elder"}</Text>
            <Text style={styles.details}>{requestDraft.notes || "No further details provided."}</Text>
          </View>
          <View style={styles.contact}>
            <Pressable accessibilityRole="button" accessibilityLabel={`Call ${requestOwner?.name ?? "elder"}`} onPress={handleCallElder}>
              <Icon name="call" size={23} color={colors.forest} label="Call elder" />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={`Message ${requestOwner?.name ?? "elder"}`} onPress={handleMessageElder}>
              <Icon name="chat-bubble" size={23} color={colors.forest} label="Message elder" />
            </Pressable>
          </View>
        </Surface>
        <Surface tone="sand" style={styles.notes}>
          <Text style={styles.noteLabel}>Please keep in mind</Text>
          <Text style={styles.noteText}>{requestDraft.notes || "No mobility notes."}</Text>
        </Surface>
        {requestStatus === "done" ? (
          <Surface tone="sage" style={styles.completed}>
            <Text style={styles.completedText}>Task marked as completed</Text>
            <WireButton label="Find another request" outline onPress={() => router.replace("/volunteer/requests")} />
          </Surface>
        ) : (
          <View style={styles.buttonGroup}>
            <WireButton label="Message elder" outline onPress={handleMessageElder} />
            <WireButton
              label="Mark task as complete"
              onPress={() => {
                setRequestStatus("done");
                Alert.alert("Task completed", "The elder can now confirm the outcome.");
              }}
            />
            <WireButton
              label="Report urgent issue"
              outline
              destructive
              onPress={() => Alert.alert("Urgent safety issue", "If anyone is in immediate danger, call 999. The HelpingHands administrator will be notified.")}
            />
          </View>
        )}
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
  buttonGroup: { gap: 10 },
});
