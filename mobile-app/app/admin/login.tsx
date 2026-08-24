import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../components/layout/AppScreen";
import { BrandHeader } from "../../components/layout/BrandHeader";
import { WireButton } from "../../components/ui/WireButton";
import { WireInput } from "../../components/ui/WireInput";
import { Surface } from "../../components/ui/Surface";
import { useApp } from "../../state/AppProvider";
import { isAdminEmailAllowed } from "../../services/auth";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

const DEMO_ADMIN_EMAIL = "nnickahh@gmail.com";
const DEMO_ADMIN_PASSWORD = "Admin123!";

export default function AdminLoginScreen() {
  const { isAdminLoggedIn, adminLogin } = useApp();
  const [email, setEmail] = useState(DEMO_ADMIN_EMAIL);
  const [password, setPassword] = useState(DEMO_ADMIN_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAdminLoggedIn) router.replace("/admin/dashboard");
  }, [isAdminLoggedIn]);

  const handleLogin = () => {
    if (!isAdminEmailAllowed(email)) {
      setError("This email is not authorized for the administrator panel.");
      return;
    }
    if (password !== DEMO_ADMIN_PASSWORD) {
      setError("Incorrect administrator password.");
      return;
    }
    setError("");
    adminLogin();
    router.replace("/admin/dashboard");
  };

  return (
    <AppScreen tone="oat">
      <BrandHeader />
      <View style={styles.content}>
        <Text style={styles.eyebrow}>Administrator access</Text>
        <Text style={styles.heading}>System control panel</Text>
        <Text style={styles.intro}>Review volunteers, monitor safety reports, and keep the HelpingHands community operating safely.</Text>
        <Surface style={styles.form}>
          <WireInput label="Administrator email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <View style={styles.passwordRow}>
            <WireInput label="Password" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} error={error} style={styles.passwordInput} />
            <Pressable accessibilityRole="button" accessibilityLabel={showPassword ? "Hide password" : "Show password"} onPress={() => setShowPassword((current) => !current)} style={styles.passwordToggle}>
              <Text style={styles.passwordToggleText}>{showPassword ? "Hide" : "Show"}</Text>
            </Pressable>
          </View>
          <WireButton label="Log in as administrator" onPress={handleLogin} />
        </Surface>
        <WireButton label="Back to member login" outline onPress={() => router.back()} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24 },
  eyebrow: { ...typography.label, color: colors.forest, textTransform: "uppercase", marginTop: 26, marginBottom: 6 },
  heading: { ...typography.display, color: colors.ink },
  intro: { ...typography.bodyText, color: colors.gray, marginTop: 8, marginBottom: 22 },
  form: { padding: 18 },
  passwordRow: { position: "relative" },
  passwordInput: { paddingRight: 68 },
  passwordToggle: { position: "absolute", right: 10, bottom: 14, paddingVertical: 8, paddingHorizontal: 4 },
  passwordToggleText: { ...typography.small, color: colors.ink, textDecorationLine: "underline" },
});
