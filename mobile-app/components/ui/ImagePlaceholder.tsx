import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { Icon } from "./Icon";

type Props = { height: number; label?: string; width?: number | `${number}%`; icon?: "badge" | "shopping-basket" | "local-pharmacy" | "event" | "smartphone" | "inventory-2" | "accessible" | "description" };

export function ImagePlaceholder({ height, label, width = "100%", icon = "badge" }: Props) {
  return (
    <View style={[styles.box, { height, width }]}>
      <View style={styles.mark}><Icon name={icon} size={28} color={colors.forest} label={label} /></View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderWidth: 1, borderColor: colors.ink, borderRadius: 0, alignItems: "center", justifyContent: "center", backgroundColor: colors.sand, padding: 12, gap: 7 },
  mark: { width: 48, height: 48, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.oat, alignItems: "center", justifyContent: "center" },
  label: { color: colors.forestDark, ...typography.small, textAlign: "center", paddingHorizontal: 12 },
});
