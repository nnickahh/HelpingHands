import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { Icon } from "./Icon";

type Props = { size?: number };

export function AvatarPlaceholder({ size = 76 }: Props) {
  return <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}><Icon name="person" size={size * 0.52} color={colors.forest} label="Profile photo placeholder" /></View>;
}

export function AvatarLabel({ label }: { label: string }) {
  return <Text style={styles.label}>{label}</Text>;
}

const styles = StyleSheet.create({
  avatar: { borderWidth: 2, borderColor: colors.forest, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center" },
  label: { color: colors.gray, ...typography.small, marginTop: 8 },
});
