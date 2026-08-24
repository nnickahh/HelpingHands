import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AppScreen } from "../../components/layout/AppScreen";
import { BackHeader } from "../../components/layout/BackHeader";
import { AvatarPlaceholder } from "../../components/ui/AvatarPlaceholder";
import { WireButton } from "../../components/ui/WireButton";
import { WireInput } from "../../components/ui/WireInput";
import { Surface } from "../../components/ui/Surface";
import { useApp } from "../../state/AppProvider";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export default function ProfileScreen() {
  const { account, avatarUri, setAvatarUri, setAccount, logout } = useApp();
  const [name, setName] = useState(account.name);
  const [phone, setPhone] = useState(account.phone);
  const [email, setEmail] = useState(account.email);
  const [saved, setSaved] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Permission required", "Allow photo access to choose a profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.7, allowsEditing: true });
    // @ts-ignore Expo SDK exposes different result shapes across minor versions.
    const uri = (result as any).uri ?? (result as any)?.assets?.[0]?.uri;
    if (uri) setAvatarUri(uri);
  };

  const saveProfile = () => {
    setAccount({ name: name.trim(), phone: phone.trim(), email: email.trim() });
    setSaved(true);
  };

  const signOut = () => {
    Alert.alert("Log out?", "Your saved profile will stay on this device for your next login.", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: () => { logout(); router.replace("/"); } },
    ]);
  };

  return (
    <AppScreen tone="oat">
      <BackHeader title="Profile" eyebrow="Your account" />
      <View style={styles.content}>
        <View style={styles.identity}>
          <AvatarPlaceholder size={104} />
          <View style={styles.identityCopy}><Text style={styles.name}>{account.name || "HelpingHands member"}</Text><Text style={styles.email}>{account.email || account.phone || "Add your contact details"}</Text></View>
        </View>
        <Pressable accessibilityRole="button" onPress={pickImage} style={styles.photoButton}><Text style={styles.photoButtonText}>{avatarUri ? "Change profile picture" : "Add profile picture"}</Text></Pressable>
        <Surface style={styles.form}>
          <WireInput label="Full name" placeholder="Your full name" autoCapitalize="words" value={name} onChangeText={(value) => { setName(value); setSaved(false); }} />
          <WireInput label="Phone number" placeholder="Your phone number" keyboardType="phone-pad" value={phone} onChangeText={(value) => { setPhone(value); setSaved(false); }} />
          <WireInput label="Email address" placeholder="Your email address" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={(value) => { setEmail(value); setSaved(false); }} />
          <WireButton label="Save changes" onPress={saveProfile} />
          {saved ? <Text style={styles.saved}>Profile saved on this device.</Text> : null}
        </Surface>
        <View style={styles.accountFooter}><Text style={styles.footerTitle}>Account access</Text><Text style={styles.footerCopy}>Log out when you are finished using this device. Your active saved session will be cleared.</Text><WireButton label="Log out" outline destructive onPress={signOut} /></View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24 },
  identity: { flexDirection: "row", alignItems: "center", gap: 16, marginTop: 22, marginBottom: 12 },
  identityCopy: { flex: 1 },
  name: { color: colors.ink, ...typography.heading },
  email: { color: colors.gray, ...typography.small, marginTop: 4 },
  photoButton: { alignSelf: "flex-start", marginLeft: 120, marginBottom: 20, paddingVertical: 8 },
  photoButtonText: { color: colors.forestDark, ...typography.bodyStrong, textDecorationLine: "underline" },
  form: { padding: 18 },
  saved: { color: colors.forestDark, ...typography.small, textAlign: "center", marginTop: 12 },
  accountFooter: { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 28, paddingTop: 22, gap: 10 },
  footerTitle: { color: colors.ink, ...typography.bodyStrong },
  footerCopy: { color: colors.gray, ...typography.small, marginBottom: 4 },
});