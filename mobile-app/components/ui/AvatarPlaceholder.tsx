import { StyleSheet, Text, View, Image } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { Icon } from "./Icon";
import { useApp } from "../../state/AppProvider";

type Props = { size?: number };

export function AvatarPlaceholder({ size = 76 }: Props) {
  const { avatarUri } = useApp();
  const style = [styles.avatar, { width: size, height: size, borderRadius: size / 2 }];
  if (avatarUri) {
    return (
      <Image source={{ uri: avatarUri }} style={[style, { resizeMode: "cover" }]} />
    );
  }

  return <View style={style}><Icon name="person" size={size * 0.52} color={colors.forest} label="Profile photo placeholder" /></View>;
}

export function AvatarLabel({ label }: { label: string }) {
  return <Text style={styles.label}>{label}</Text>;
}

const styles = StyleSheet.create({
  avatar: { borderWidth: 2, borderColor: colors.forest, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center" },
  label: { color: colors.gray, ...typography.small, marginTop: 8 },
});
