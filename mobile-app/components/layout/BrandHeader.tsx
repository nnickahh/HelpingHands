import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { Icon } from "../ui/Icon";

export function BrandHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.mark}><Icon name="volunteer-activism" size={18} color={colors.ink} label="HelpingHands" /></View>
      <View><Text style={styles.name}>HelpingHands</Text><Text style={styles.tagline}>Neighbours helping neighbours</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { minHeight: 66, backgroundColor: colors.oat, borderBottomWidth: 1, borderBottomColor: colors.ink, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 10, paddingHorizontal: 20 },
  mark: { width: 30, height: 30, borderWidth: 1, borderColor: colors.ink, backgroundColor: colors.sand, alignItems: "center", justifyContent: "center" },
  name: { color: colors.ink, fontSize: 18, fontWeight: "800", letterSpacing: 0 },
  tagline: { color: colors.gray, ...typography.small, marginTop: 1 },
});
