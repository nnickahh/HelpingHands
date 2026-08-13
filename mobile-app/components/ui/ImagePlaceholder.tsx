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
  box: { borderWidth: 1.5, borderColor: colors.borderStrong, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: colors.sageSoft, padding: 12, gap: 7 },
  mark: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
  label: { color: colors.forestDark, ...typography.small, textAlign: "center", paddingHorizontal: 12 },
});
