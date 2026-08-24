import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { Icon } from "./Icon";

type Props = { icon: "shopping-basket" | "local-pharmacy" | "event" | "smartphone" | "inventory-2" | "accessible"; label: string; selected: boolean; onPress: () => void };

export function CategoryTile({ icon, label, selected, onPress }: Props) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${label}${selected ? ", selected" : ""}`} accessibilityState={{ selected }} onPress={onPress} style={({ pressed }) => [styles.tile, selected && styles.selected, pressed && styles.pressed]}>
      <Icon name={icon} size={28} color={selected ? colors.forestDark : colors.gray} label={label} />
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: { width: "31.5%", minHeight: 82, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: 0, alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.oat, padding: 8 },
  selected: { borderColor: colors.ink, backgroundColor: colors.sand },
  pressed: { opacity: 0.78 },
  label: { ...typography.small, color: colors.ink, fontWeight: "700", textAlign: "center" },
  selectedLabel: { color: colors.forestDark },
});
