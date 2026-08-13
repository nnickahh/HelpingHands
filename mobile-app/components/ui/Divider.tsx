import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export function Divider({ label }: { label?: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
      {label ? <View style={styles.line} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 18, paddingHorizontal: 16 },
  line: { height: 1, backgroundColor: colors.border, flex: 1 },
  label: { ...typography.label, color: colors.muted, textTransform: "uppercase" },
});
