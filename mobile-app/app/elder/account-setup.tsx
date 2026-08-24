import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../components/layout/AppScreen";
import { BrandHeader } from "../../components/layout/BrandHeader";
import { WireButton } from "../../components/ui/WireButton";
import { WireInput } from "../../components/ui/WireInput";
import { useApp } from "../../state/AppProvider";
import { useTranslation } from "../../state/i18n";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { isSupabaseAuthConfigured, signUpWithPassword } from "../../services/auth";
import { saveRegisteredAccount } from "../../state/sessionStorage";

const languages = ["English", "中文 Mandarin", "Melayu", "Tamil"];

export default function AccountSetupScreen() {
  const { role, setRole } = useApp();
  const { t, language, setLanguage } = useTranslation();
  const { account, setAccount, setLastIdentifier } = useApp();
  const [name, setName] = useState(account.name);
  const [phone, setPhone] = useState(account.phone);
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [email, setEmail] = useState(account.email);
  const [password, setPassword] = useState(account.password);
  const [confirmPassword, setConfirmPassword] = useState(account.password);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [showInAdmin, setShowInAdmin] = useState(account.showInAdmin ?? false);

  const continueToHelp = () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const nextNameError = !trimmedName ? "Please enter your full name." : "";
    const nextPhoneError = !trimmedPhone ? "Please enter a phone number." : "";

    setNameError(nextNameError);
    setPhoneError(nextPhoneError);
    if (nextNameError || nextPhoneError) return;
    setAccount({ name: trimmedName, phone: trimmedPhone, showInAdmin: role === "volunteer" ? showInAdmin : false });
    router.push(role === "volunteer" ? "/volunteer/requests" : "/elder/request-help");
  };

  const createAccount = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const nextEmailError = !/^\S+@\S+\.\S+$/.test(normalizedEmail) ? "Enter a valid email address." : "";
    const nextPasswordError = password.length < 6 ? "Use a password with at least 6 characters." : password !== confirmPassword ? "Passwords do not match." : "";
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    if (nextEmailError || nextPasswordError) return;

    setCreatingAccount(true);
    try {
      if (isSupabaseAuthConfigured()) {
        try {
          await signUpWithPassword(normalizedEmail, password);
        } catch (supaErr) {
          console.warn("Supabase signup note (proceeding with local registry):", supaErr);
        }
      }

      await saveRegisteredAccount({
        email: normalizedEmail,
        password,
        name: name.trim(),
        phone: phone.trim(),
        role,
        avatarUri: account.avatarUri ?? null,
      });

      setAccount({
        email: normalizedEmail,
        password,
        name: name.trim(),
        phone: phone.trim(),
        role,
        isLoggedIn: false,
        rememberMe: true,
      });

      setLastIdentifier(normalizedEmail);

      Alert.alert("Account created", "Your account is ready. Log in with the same password to continue.", [
        { text: "Log in", onPress: () => router.replace("/") },
      ]);
    } catch (error) {
      Alert.alert("Unable to create account", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setCreatingAccount(false);
    }
  };

  return (
    <AppScreen tone="oat">
      <BrandHeader />
      <View style={styles.content}>
        <Text style={styles.eyebrow}>{t("step1")}</Text>
        <Text style={styles.heading}>{t("tellUs")}</Text>
        <Text style={styles.intro}>Choose the role that matches how you will use HelpingHands.</Text>
        {account.isLoggedIn ? <Pressable accessibilityRole="button" onPress={() => router.push("/elder/profile")} style={styles.profileLink}><Text style={styles.profileLinkText}>Open profile settings</Text><Text style={styles.profileLinkHint}>Update your details, photo, or sign out</Text></Pressable> : null}
        {!account.isLoggedIn ? (
          <>
            <WireInput label="Email address" placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={(value) => { setEmail(value); if (emailError) setEmailError(""); }} error={emailError} />
            <WireInput label="Password" placeholder="Create a password" secureTextEntry value={password} onChangeText={(value) => { setPassword(value); if (passwordError) setPasswordError(""); }} error={passwordError} />
            <WireInput label="Confirm password" placeholder="Repeat your password" secureTextEntry value={confirmPassword} onChangeText={(value) => { setConfirmPassword(value); if (passwordError) setPasswordError(""); }} />
          </>
        ) : null}
        <View style={styles.roles}>
          {[{ label: "Elderly", value: "elder" as const }, { label: "Volunteer", value: "volunteer" as const }].map((item) => <Pressable key={item.value} accessibilityRole="button" accessibilityState={{ selected: role === item.value }} onPress={() => setRole(item.value)} style={[styles.role, role === item.value && styles.selectedRole]}><Text style={[styles.roleText, role === item.value && styles.selectedRoleText]}>{item.label}</Text></Pressable>)}
        </View>
        <WireInput label={t("fullName")} placeholder="Your full name" autoCapitalize="words" value={name} onChangeText={(value) => { setName(value); if (nameError) setNameError(""); }} error={nameError} />
        <WireInput label={t("phoneNumber")} placeholder="Your phone number" keyboardType="phone-pad" helperText="We’ll only use this to coordinate your request." value={phone} onChangeText={(value) => { setPhone(value); if (phoneError) setPhoneError(""); }} error={phoneError} />
        <Text style={styles.label}>{t("preferredLanguage")}</Text>
        <View style={styles.languages}>{languages.map((item) => <Pressable key={item} accessibilityRole="button" accessibilityState={{ selected: language === item }} onPress={() => setLanguage(item)} style={[styles.language, language === item && styles.selectedLanguage]}><Text style={[styles.languageText, language === item && styles.selectedLanguageText]}>{item}</Text></Pressable>)}</View>
        {role === "volunteer" ? (
          <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: showInAdmin }} onPress={() => setShowInAdmin((current) => !current)} style={styles.visibilityRow}>
            <View style={[styles.checkbox, showInAdmin && styles.checkboxChecked]} />
            <View style={styles.visibilityCopy}><Text style={styles.visibilityTitle}>Show my volunteer profile to administrators</Text><Text style={styles.visibilityHint}>Allow your name and email to appear in the admin review panel. This is off by default.</Text></View>
          </Pressable>
        ) : null}
        <WireButton label={!account.isLoggedIn ? (creatingAccount ? "Creating account..." : "Create account") : t("continue")} disabled={creatingAccount} onPress={account.isLoggedIn ? continueToHelp : () => void createAccount()} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24 },
  eyebrow: { ...typography.label, color: colors.forest, textTransform: "uppercase", marginTop: 24, marginBottom: 6 },
  heading: { ...typography.title, color: colors.ink },
  intro: { ...typography.bodyText, color: colors.gray, marginTop: 7, marginBottom: 24 },
  roles: { flexDirection: "row", gap: 10, marginBottom: 20 },
  role: { flex: 1, minHeight: 56, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  selectedRole: { backgroundColor: colors.forest, borderColor: colors.forest },
  roleText: { color: colors.gray, fontSize: 14, fontWeight: "700", textAlign: "center" },
  selectedRoleText: { color: colors.white },
  label: { ...typography.label, color: colors.ink, textTransform: "uppercase", marginBottom: 8 },
  languages: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  language: { width: "48%", minHeight: 48, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  selectedLanguage: { backgroundColor: colors.sage, borderColor: colors.forest },
  languageText: { color: colors.gray, fontSize: 14, fontWeight: "600" },
  selectedLanguageText: { color: colors.forestDark, fontWeight: "800" },
  profileLink: { backgroundColor: colors.sageSoft, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 14, marginBottom: 20 },
  profileLinkText: { color: colors.forestDark, ...typography.bodyStrong },
  profileLinkHint: { color: colors.gray, ...typography.small, marginTop: 3 },
  visibilityRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, borderWidth: 1, borderColor: colors.borderStrong, padding: 12, marginBottom: 12 },
  checkbox: { width: 18, height: 18, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.oat, marginTop: 1 },
  checkboxChecked: { backgroundColor: colors.ink },
  visibilityCopy: { flex: 1 },
  visibilityTitle: { ...typography.bodyStrong, color: colors.ink },
  visibilityHint: { ...typography.small, color: colors.gray, marginTop: 3 },
});
