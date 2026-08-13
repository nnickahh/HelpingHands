import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../components/layout/AppScreen";
import { BackHeader } from "../../components/layout/BackHeader";
import { Divider } from "../../components/ui/Divider";
import { ImagePlaceholder } from "../../components/ui/ImagePlaceholder";
import { Steps } from "../../components/ui/Steps";
import { WireButton } from "../../components/ui/WireButton";
import { WireInput } from "../../components/ui/WireInput";
import { Surface } from "../../components/ui/Surface";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export default function VerificationScreen() {
  return (
    <AppScreen tone="oat">
      <BackHeader title="Volunteer verification" eyebrow="Before you begin" />
      <Steps items={["Personal", "ID upload", "Review"]} active={1} />
      <Divider />
      <View style={styles.content}>
        <Text style={styles.heading}>Help us keep HelpingHands safe</Text>
        <Text style={styles.intro}>Your ID is reviewed by an administrator and is never shown to people requesting help.</Text>
        <ImagePlaceholder height={170} label="Add a photo of your ID" icon="badge" />
        <View style={styles.spacer} />
        <WireInput label="Emergency contact name" placeholder="Full name" />
        <WireInput label="Emergency contact phone" placeholder="Phone number" keyboardType="phone-pad" />
        <Surface tone="sand" style={styles.pending}><Text style={styles.hourglass}>◷</Text><View style={styles.pendingCopy}><Text style={styles.pendingTitle}>Pending administrator review</Text><Text style={styles.pendingBody}>You’ll see community requests once your account is approved.</Text></View></Surface>
        <WireButton label="Submit for review" onPress={() => router.push("/volunteer/requests")} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24 },
  heading: { ...typography.title, color: colors.ink, marginBottom: 7 },
  intro: { ...typography.bodyText, color: colors.gray, marginBottom: 20 },
  spacer: { height: 18 },
  pending: { flexDirection: "row", gap: 12, alignItems: "flex-start", marginBottom: 14 },
  hourglass: { color: colors.marigold, fontSize: 27, lineHeight: 30 },
  pendingCopy: { flex: 1 },
  pendingTitle: { color: colors.marigold, ...typography.bodyStrong, marginBottom: 4 },
  pendingBody: { color: colors.gray, ...typography.small },
});
