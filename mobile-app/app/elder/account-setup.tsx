import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../components/layout/AppScreen";
import { BrandHeader } from "../../components/layout/BrandHeader";
import { WireButton } from "../../components/ui/WireButton";
import { WireInput } from "../../components/ui/WireInput";
import { useApp } from "../../state/AppProvider";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

const languages = ["English", "中文 Mandarin", "Melayu", "Tamil"];

export default function AccountSetupScreen() {
  const { role, setRole } = useApp();
  const [language, setLanguage] = useState("English");
  return (
    <AppScreen tone="oat">
      <BrandHeader />
      <View style={styles.content}>
        <Text style={styles.eyebrow}>Step 1 of 2</Text>
        <Text style={styles.heading}>Tell us who you are</Text>
        <Text style={styles.intro}>This helps us show the right kind of support.</Text>
        <View style={styles.roles}>
          {[{ label: "I need help", value: "elder" as const }, { label: "I’m a caregiver", value: "caregiver" as const }].map((item) => <Pressable key={item.value} accessibilityRole="button" accessibilityState={{ selected: role === item.value }} onPress={() => setRole(item.value)} style={[styles.role, role === item.value && styles.selectedRole]}><Text style={[styles.roleText, role === item.value && styles.selectedRoleText]}>{item.label}</Text></Pressable>)}
        </View>
        <WireInput label="Full name" placeholder="Your full name" autoCapitalize="words" />
        <WireInput label="Phone number" placeholder="Your phone number" keyboardType="phone-pad" helperText="We’ll only use this to coordinate your request." />
        <Text style={styles.label}>Preferred language</Text>
        <View style={styles.languages}>{languages.map((item) => <Pressable key={item} accessibilityRole="button" accessibilityState={{ selected: language === item }} onPress={() => setLanguage(item)} style={[styles.language, language === item && styles.selectedLanguage]}><Text style={[styles.languageText, language === item && styles.selectedLanguageText]}>{item}</Text></Pressable>)}</View>
        <WireButton label="Continue to request help" onPress={() => router.push("/elder/request-help")} />
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
});
