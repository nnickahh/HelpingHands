import { router } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../components/layout/AppScreen";
import { BackHeader } from "../../components/layout/BackHeader";
import { Divider } from "../../components/ui/Divider";
import { ImagePlaceholder } from "../../components/ui/ImagePlaceholder";
import { Steps } from "../../components/ui/Steps";
import { WireButton } from "../../components/ui/WireButton";
import { WireInput } from "../../components/ui/WireInput";
import { Surface } from "../../components/ui/Surface";
import { useApp } from "../../state/AppProvider";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export default function VerificationScreen() {
  const { account, submitIdForReview } = useApp();

  const submitForReview = () => {
    submitIdForReview();
    Alert.alert(
      "Submitted for review",
      "Your ID check is queued for administrator review. You can check this page again for your verification status.",
      [{ text: "OK" }],
    );
  };

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
        <Surface tone="sand" style={styles.pending}><Text style={styles.hourglass}>{account.isIdVerified ? "✓" : "◷"}</Text><View style={styles.pendingCopy}><Text style={styles.pendingTitle}>{account.isIdVerified ? "Identity approved" : account.isIdSubmitted ? "Pending administrator review" : "Not submitted"}</Text><Text style={styles.pendingBody}>{account.isIdVerified ? "Your account is ready for request matching." : "Submit your ID for review before browsing community requests."}</Text></View></Surface>
        <WireButton label={account.isIdVerified ? "Continue to requests" : account.isIdSubmitted ? "Check verification status" : "Submit for review"} onPress={account.isIdVerified ? () => router.push("/volunteer/requests") : submitForReview} />
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
