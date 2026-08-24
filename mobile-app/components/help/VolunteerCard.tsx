import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { AvatarPlaceholder } from "../ui/AvatarPlaceholder";
import { Icon } from "../ui/Icon";

type Props = { name: string; rating: string; onCall?: () => void; onMessage?: () => void };

export function VolunteerCard({ name, rating, onCall, onMessage }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.person}>
        <View><AvatarPlaceholder size={58} /><View style={styles.badge}><Icon name="verified" size={12} color={colors.white} label="Verified volunteer" /></View></View>
        <View style={styles.copy}><Text style={styles.name}>{name}</Text><View style={styles.verified}><Icon name="verified" size={16} color={colors.forest} /><Text style={styles.rating}>Verified volunteer · {rating}</Text></View></View>
      </View>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Call ${name}`} onPress={onCall} style={({ pressed }) => [styles.action, pressed && styles.pressed]}><Icon name="call" size={21} color={colors.forest} /><Text style={styles.actionText}>Call</Text></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={`Message ${name}`} onPress={onMessage} style={({ pressed }) => [styles.action, pressed && styles.pressed]}><Icon name="chat-bubble" size={21} color={colors.forest} /><Text style={styles.actionText}>Message</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.oat, borderWidth: 1, borderColor: colors.ink, borderRadius: 0, padding: 16, marginBottom: 14 },
  person: { flexDirection: "row", gap: 12, alignItems: "center", marginBottom: 16 },
  copy: { flex: 1 },
  name: { ...typography.bodyStrong, color: colors.ink, marginBottom: 5 },
  verified: { flexDirection: "row", alignItems: "center", gap: 5 },
  rating: { ...typography.small, color: colors.gray },
  badge: { position: "absolute", bottom: 0, right: 0, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.forest, borderWidth: 2, borderColor: colors.white, alignItems: "center", justifyContent: "center" },
  actions: { flexDirection: "row", gap: 10, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 13 },
  action: { flex: 1, minHeight: 44, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: 0, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 7 },
  actionText: { ...typography.bodyStrong, color: colors.forestDark },
  pressed: { backgroundColor: colors.sageSoft },
});
