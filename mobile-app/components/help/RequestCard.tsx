import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";
import { WireButton } from "../ui/WireButton";

type Props = { icon: "shopping-basket" | "local-pharmacy" | "event" | "smartphone" | "inventory-2" | "accessible"; title: string; details: string; onAccept: () => void };

export function RequestCard({ icon, title, details, onAccept }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <ImagePlaceholder width={58} height={58} icon={icon} />
        <View style={styles.copy}><Text style={styles.title}>{title}</Text><Text style={styles.details}>{details}</Text></View>
      </View>
      <View style={styles.action}><WireButton label="Accept this request" onPress={onAccept} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 16, marginBottom: 12 },
  top: { flexDirection: "row", gap: 13, alignItems: "center" },
  copy: { flex: 1 },
  title: { ...typography.bodyStrong, color: colors.ink, marginBottom: 5 },
  details: { ...typography.small, color: colors.gray, lineHeight: 19 },
  action: { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 14, paddingTop: 14, alignItems: "stretch" },
});
