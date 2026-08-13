import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { Icon } from "../ui/Icon";

export function BrandHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.mark}><Icon name="volunteer-activism" size={21} color={colors.white} label="HelpingHands" /></View>
      <View><Text style={styles.name}>HelpingHands</Text><Text style={styles.tagline}>Neighbours helping neighbours</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { minHeight: 76, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 10, paddingHorizontal: 20 },
  mark: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.forest, alignItems: "center", justifyContent: "center" },
  name: { color: colors.white, fontSize: 21, fontWeight: "800", letterSpacing: -0.3 },
  tagline: { color: colors.sage, ...typography.small, marginTop: 1 },
});
