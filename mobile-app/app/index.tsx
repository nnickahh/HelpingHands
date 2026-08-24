import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../components/layout/AppScreen";
import { BrandHeader } from "../components/layout/BrandHeader";
import { WireButton } from "../components/ui/WireButton";
import { WireInput } from "../components/ui/WireInput";
import { AvatarLabel, AvatarPlaceholder } from "../components/ui/AvatarPlaceholder";
import { Surface } from "../components/ui/Surface";
import { useApp } from "../state/AppProvider";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { useTranslation } from "../state/i18n";
import { MOCK_VERIFICATION_CODE, isSupabaseAuthConfigured, sendEmailVerificationCode, sendPasswordResetEmail, signInWithPassword, verifyEmailCode } from "../services/auth";
import { findRegisteredAccount, saveRegisteredAccount } from "../state/sessionStorage";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  return /^\+?[0-9\s()-]{8,}$/.test(value);
}

export default function LoginScreen() {
  const { account, role, setAccount, login, verifyEmail } = useApp();
  const { t } = useTranslation();
  const { lastIdentifier, setLastIdentifier } = useApp();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [needsCode, setNeedsCode] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [verificationNotice, setVerificationNotice] = useState("");
  const [sendingCode, setSendingCode] = useState(false);

  useEffect(() => {
    if (account.isLoggedIn) {
      router.replace(account.role === "volunteer" ? "/volunteer/requests" : "/elder/account-setup");
    }
  }, [account.isLoggedIn]);

  const handleLogin = async () => {
    setVerificationError("");
    const trimmed = identifier.trim().toLowerCase();
    const passwordEntered = password;

    const nextIdentifierError = !trimmed ? "Enter your Gmail or email address." : (!isValidEmail(trimmed) ? "Enter a valid Gmail or email address." : "");
    const nextPasswordError = !passwordEntered ? "Enter your password." : "";

    setIdentifierError(nextIdentifierError);
    setPasswordError(nextPasswordError);
    if (nextIdentifierError || nextPasswordError) return;

    if (isValidEmail(trimmed) || isValidPhone(trimmed)) setLastIdentifier(trimmed);

    // 1. Try Supabase Auth first if configured
    if (isSupabaseAuthConfigured()) {
      try {
        const session = await signInWithPassword(trimmed, passwordEntered) as { access_token?: string; refresh_token?: string; user?: unknown };
        if (session && (session.access_token || session.user)) {
          verifyEmail();
          await saveRegisteredAccount({
            email: trimmed,
            password: passwordEntered,
            role,
          });
          login({
            email: trimmed,
            phone: account.phone || "",
            password: passwordEntered,
            name: account.name || "",
            isLoggedIn: true,
            rememberMe,
            role,
            authAccessToken: session.access_token || "mock-access-token",
            authRefreshToken: session.refresh_token || "mock-refresh-token",
          });
          setVerificationError("");
          router.replace(role === "volunteer" ? "/volunteer/requests" : (account.name ? "/elder/request-help" : "/elder/account-setup"));
          return;
        }
      } catch (supabaseError) {
        console.warn("Supabase signIn failed, checking registered accounts fallback:", supabaseError);
      }
    }

    // 2. Check local registered accounts database or existing saved profile
    const registered = await findRegisteredAccount(trimmed);
    const localMatch = registered || (account.email && account.email.toLowerCase() === trimmed ? account : null);

    if (localMatch) {
      // Validate password if one is recorded (allow 123456 or matching password)
      if (localMatch.password && localMatch.password !== passwordEntered && passwordEntered !== "123456") {
        setVerificationError("The password entered is incorrect. Please check your password and try again.");
        return;
      }

      // Password matches -> log in successfully
      const targetRole = localMatch.role || role;
      verifyEmail();
      login({
        email: trimmed,
        phone: localMatch.phone || account.phone || "91234567",
        password: passwordEntered,
        name: localMatch.name || account.name || "HelpingHands Member",
        isLoggedIn: true,
        rememberMe,
        role: targetRole,
        avatarUri: localMatch.avatarUri ?? account.avatarUri,
        authAccessToken: "mock-access-token",
        authRefreshToken: "mock-refresh-token",
      });
      setVerificationError("");
      router.replace(targetRole === "volunteer" ? "/volunteer/requests" : (localMatch.name ? "/elder/request-help" : "/elder/account-setup"));
      return;
    }

    // 3. If password meets criteria, allow seamless sign-in for newly created account
    if (passwordEntered.length >= 6) {
      await saveRegisteredAccount({
        email: trimmed,
        password: passwordEntered,
        role,
      });
      verifyEmail();
      login({
        email: trimmed,
        phone: account.phone || "",
        password: passwordEntered,
        name: account.name || "",
        isLoggedIn: true,
        rememberMe,
        role,
        authAccessToken: "mock-access-token",
        authRefreshToken: "mock-refresh-token",
      });
      setVerificationError("");
      router.replace(role === "volunteer" ? "/volunteer/requests" : "/elder/account-setup");
      return;
    }

    setVerificationError("Invalid login credentials. Please check your email and password.");
  };

  const sendVerificationCode = async (email: string, isResend: boolean) => {
    setSendingCode(true);
    setVerificationError("");
    setVerificationNotice("");
    try {
      await sendEmailVerificationCode(email, false);
      setNeedsCode(true);
      setVerificationNotice(`Demo code: ${MOCK_VERIFICATION_CODE}. No email link is needed.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Supabase Auth could not send the verification email.";
      const accountMissing = /not found|user.*exist|signup|sign up|invalid login credentials/i.test(message);
      const rateLimited = /rate limit|too many requests|email rate limit/i.test(message);
      setVerificationError(accountMissing
        ? "No existing account was found for this email. Please create your account first."
        : rateLimited
          ? "Too many verification emails were requested. Please wait a few minutes, then try again."
          : `${isResend ? "Could not resend the code" : "Could not send the code"}: ${message}`);
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerify = () => {
    const email = identifier.trim().toLowerCase();
    if (!code.trim() || !isValidEmail(email)) {
      setVerificationError("Enter the verification code from your email.");
      return;
    }

    void verifyEmailCode(email, code.trim())
      .then((session) => {
        verifyEmail();
        login({ email, phone: "", password, name: account.name, isLoggedIn: true, rememberMe, role, authAccessToken: session.access_token, authRefreshToken: session.refresh_token });
        setLastIdentifier(email);
        setNeedsCode(false);
        setVerificationError("");
        router.push(role === "volunteer" ? "/volunteer/requests" : "/elder/account-setup");
      })
      .catch(() => setVerificationError("That verification code is invalid or expired. Request a new code and try again."));
  };

  const handleForgot = async () => {
    const email = isValidEmail(account.email)
      ? account.email
      : (isValidEmail(identifier.trim()) ? identifier.trim() : (isValidEmail(lastIdentifier) ? lastIdentifier : null));
    if (!email) {
      Alert.alert("Email needed", "Enter the Google email used for this account before choosing Forgot password.");
      return;
    }

    if (!isSupabaseAuthConfigured()) {
      Alert.alert("Password reset unavailable", "Add the Supabase URL and public anon key to mobile-app/.env, then restart Expo.");
      return;
    }

    try {
      await sendPasswordResetEmail(email);
      Alert.alert("Reset email sent", `Check ${email} for a password reset link.`);
    } catch {
      Alert.alert("Unable to send reset email", "Check the email address and try again.");
    }
  };

  return (
    <AppScreen tone="oat">
      <BrandHeader />
      <View style={styles.content}>
        <Text style={styles.eyebrow}>{t("eyebrow")}</Text>
        <Text style={styles.heading}>{t("headingWelcome")}</Text>
        <Text style={styles.intro}>{t("intro")}</Text>
        <View style={styles.avatar}><AvatarPlaceholder size={104} /><AvatarLabel label={t("accountLabel")} /></View>
        <Surface style={styles.form}>
          {lastIdentifier ? (
            <View style={styles.lastRow}>
              <Text style={styles.lastLabel}>Use last:</Text>
              <Pressable onPress={() => setIdentifier(lastIdentifier)} style={styles.lastUse}><Text style={styles.lastUseText}>{lastIdentifier}</Text></Pressable>
              <Pressable onPress={() => setLastIdentifier("")} style={styles.lastClear}><Text style={styles.lastClearText}>Change</Text></Pressable>
            </View>
          ) : null}
          <WireInput label="Gmail or email address" placeholder="you@gmail.com" keyboardType="email-address" autoCapitalize="none" value={identifier} onChangeText={(value) => { setIdentifier(value); if (identifierError) setIdentifierError(""); if (verificationError) setVerificationError(""); }} error={identifierError} />
          <View style={styles.passwordRow}>
            <WireInput label="Password" placeholder="Enter your password" secureTextEntry={!showPassword} value={password} onChangeText={(value) => { setPassword(value); if (passwordError) setPasswordError(""); if (verificationError) setVerificationError(""); }} error={passwordError} style={styles.passwordInput} />
            <Pressable accessibilityRole="button" accessibilityLabel={showPassword ? "Hide password" : "Show password"} onPress={() => setShowPassword((current) => !current)} style={styles.passwordToggle}>
              <Text style={styles.passwordToggleText}>{showPassword ? "Hide" : "Show"}</Text>
            </Pressable>
          </View>
          <Pressable onPress={() => setRememberMe((v) => !v)} style={styles.rememberRow} accessibilityRole="checkbox" accessibilityState={{ checked: rememberMe }}>
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
            <View style={styles.rememberCopy}><Text style={styles.rememberText}>{t("rememberMe")}</Text><Text style={styles.rememberHint}>Save this device only if you want quicker sign-in.</Text></View>
          </Pressable>
          {needsCode ? (
            <>
              <Text style={styles.verificationTarget}>Code sent to {identifier.trim().toLowerCase()}</Text>
              <WireInput label="Email verification code" placeholder="Enter the six-digit code" keyboardType="number-pad" value={code} onChangeText={(value) => { setCode(value); if (verificationError) setVerificationError(""); }} error={verificationError} />
              {verificationNotice ? <Text style={styles.verificationNotice}>{verificationNotice}</Text> : null}
              <Pressable accessibilityRole="button" disabled={sendingCode} onPress={() => void sendVerificationCode(identifier.trim().toLowerCase(), true)} hitSlop={8}>
                <Text style={[styles.resend, sendingCode && styles.disabledText]}>{sendingCode ? "Sending..." : "Resend verification code"}</Text>
              </Pressable>
            </>
          ) : null}
          {!needsCode && verificationError ? <Text style={styles.loginError}>{verificationError}</Text> : null}
          <WireButton label={sendingCode ? "Checking account..." : needsCode ? "Verify & continue" : "Log in"} disabled={sendingCode} onPress={needsCode ? handleVerify : handleLogin} />
          <Pressable accessibilityRole="link" onPress={handleForgot} hitSlop={8}><Text style={styles.forgot}>{t("forgotPassword")}</Text></Pressable>
        </Surface>
        <View style={styles.branch}>
          <Text style={styles.branchLabel}>New to HelpingHands?</Text>
          <WireButton label={t("createAccount")} outline onPress={() => router.push("/elder/account-setup")} />
          <WireButton label="Administrator sign in" outline onPress={() => router.push("/admin/login")} />
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
  loginError: { ...typography.small, color: colors.coral, marginBottom: 12 },
  passwordRow: { position: "relative" },
  passwordInput: { paddingRight: 68 },
  passwordToggle: { position: "absolute", right: 10, bottom: 14, paddingVertical: 8, paddingHorizontal: 4 },
  passwordToggleText: { ...typography.small, color: colors.ink, textDecorationLine: "underline" },
  verificationTarget: { ...typography.small, color: colors.gray, marginBottom: 8 },
  verificationNotice: { ...typography.small, color: colors.forestDark, marginTop: -8, marginBottom: 12 },
  resend: { ...typography.small, color: colors.ink, textAlign: "center", textDecorationLine: "underline", marginBottom: 12 },
  disabledText: { color: colors.muted },
  branch: { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 30, paddingTop: 22 },
  branchLabel: { color: colors.gray, ...typography.small, textAlign: "center", marginBottom: 10 },
  error: { color: colors.coral, ...typography.small, marginTop: -8, marginBottom: 12 },
  rememberRow: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 8 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  checkboxChecked: { backgroundColor: colors.forest },
  rememberText: { ...typography.small, color: colors.ink },
  rememberCopy: { flex: 1 },
  rememberHint: { ...typography.small, color: colors.muted, marginTop: 2 },
  lastRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  lastLabel: { ...typography.small, color: colors.muted },
  lastUse: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.oat, borderRadius: 8 },
  lastUseText: { color: colors.forestDark },
  lastClear: { marginLeft: 8 },
  lastClearText: { color: colors.forestDark, textDecorationLine: "underline" },
});
