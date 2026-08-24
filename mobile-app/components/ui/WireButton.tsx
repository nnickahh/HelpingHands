import { Pressable, StyleSheet, Text, type GestureResponderEvent, type StyleProp, type ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

type Props = {
  label: string;
  outline?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: (event: GestureResponderEvent) => void;
};

export function WireButton({ label, outline = false, destructive = false, disabled = false, style, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        outline ? styles.outline : styles.filled,
        destructive && styles.destructive,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, outline ? styles.outlineText : styles.filledText, destructive && styles.destructiveText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 48, borderRadius: 0, borderWidth: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 18, marginBottom: 12 },
  filled: { backgroundColor: colors.ink, borderColor: colors.ink },
  outline: { backgroundColor: colors.oat, borderColor: colors.ink },
  destructive: { borderColor: colors.coral, backgroundColor: colors.coral },
  disabled: { opacity: 0.45 },
  pressed: { transform: [{ translateY: 1 }], opacity: 0.86 },
  text: { ...typography.bodyStrong },
  filledText: { color: colors.white },
  outlineText: { color: colors.forestDark },
  destructiveText: { color: colors.white },
});
