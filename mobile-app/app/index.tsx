import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../components/layout/AppScreen";
import { BrandHeader } from "../components/layout/BrandHeader";
import { WireButton } from "../components/ui/WireButton";
import { WireInput } from "../components/ui/WireInput";
import { AvatarLabel, AvatarPlaceholder } from "../components/ui/AvatarPlaceholder";
import { Surface } from "../components/ui/Surface";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

export default function LoginScreen() {
  return (
    <AppScreen tone="oat">
      <BrandHeader />
      <View style={styles.content}>
        <Text style={styles.eyebrow}>A little help goes a long way</Text>
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.intro}>Sign in to see your requests, tasks, and neighbours.</Text>
        <View style={styles.avatar}><AvatarPlaceholder size={104} /><AvatarLabel label="Your HelpingHands account" /></View>
        <Surface style={styles.form}>
          <WireInput label="Email or phone number" placeholder="Enter your email or phone" keyboardType="email-address" autoCapitalize="none" />
          <WireInput label="Password" placeholder="Enter your password" secureTextEntry />
          <WireButton label="Log in" onPress={() => router.push("/volunteer/verification")} />
          <Pressable accessibilityRole="link" onPress={() => {}} hitSlop={8}><Text style={styles.forgot}>Forgot your password?</Text></Pressable>
        </Surface>
        <View style={styles.branch}>
          <Text style={styles.branchLabel}>New to HelpingHands?</Text>
          <WireButton label="Create an elder or caregiver account" outline onPress={() => router.push("/elder/account-setup")} />
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24 },
  eyebrow: { ...typography.label, color: colors.forest, textTransform: "uppercase", marginTop: 26, marginBottom: 6 },
  heading: { ...typography.display, color: colors.ink },
  intro: { ...typography.bodyText, color: colors.gray, marginTop: 8, maxWidth: 330 },
  avatar: { alignItems: "center", marginVertical: 24 },
  form: { padding: 18 },
  forgot: { color: colors.forestDark, ...typography.small, textAlign: "center", textDecorationLine: "underline" },
  branch: { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 30, paddingTop: 22 },
  branchLabel: { color: colors.gray, ...typography.small, textAlign: "center", marginBottom: 10 },
});
