import { Pressable, StyleSheet, Text, type GestureResponderEvent } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

type Props = { label: string; outline?: boolean; destructive?: boolean; disabled?: boolean; onPress?: (event: GestureResponderEvent) => void };

export function WireButton({ label, outline = false, destructive = false, disabled = false, onPress }: Props) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, outline ? styles.outline : styles.filled, destructive && styles.destructive, disabled && styles.disabled, pressed && !disabled && styles.pressed]}>
      <Text style={[styles.text, outline ? styles.outlineText : styles.filledText, destructive && styles.destructiveText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: 14, borderWidth: 1.5, alignItems: "center", justifyContent: "center", paddingHorizontal: 18, marginBottom: 12 },
  filled: { backgroundColor: colors.forest, borderColor: colors.forest },
  outline: { backgroundColor: colors.white, borderColor: colors.forest },
  destructive: { borderColor: colors.coral, backgroundColor: colors.coral },
  disabled: { opacity: 0.45 },
  pressed: { transform: [{ translateY: 1 }], opacity: 0.86 },
  text: { ...typography.bodyStrong },
  filledText: { color: colors.white },
  outlineText: { color: colors.forestDark },
  destructiveText: { color: colors.white },
});
