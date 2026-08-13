import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { Icon } from "../ui/Icon";

type Props = { title: string; eyebrow?: string };

export function BackHeader({ title, eyebrow }: Props) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" accessibilityLabel="Go back" hitSlop={12} onPress={() => router.back()} style={styles.back}>
        <Icon name="arrow-back" size={25} color={colors.ink} label="Go back" />
      </Pressable>
      <View><Text style={styles.eyebrow}>{eyebrow}</Text><Text style={styles.title}>{title}</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { minHeight: 72, backgroundColor: colors.oat, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 10 },
  back: { width: 44, height: 48, alignItems: "center", justifyContent: "center" },
  eyebrow: { ...typography.label, color: colors.forest, textTransform: "uppercase", marginBottom: 2 },
  title: { color: colors.ink, ...typography.heading },
});
